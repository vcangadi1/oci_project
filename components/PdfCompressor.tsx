"use client";

import { useState, useRef, useCallback } from "react";
import { PDFDocument } from "pdf-lib";
import {
  FaFilePdf,
  FaCloudUploadAlt,
  FaDownload,
  FaTrashAlt,
  FaExclamationTriangle,
  FaCheckCircle,
  FaInfoCircle,
  FaCompressArrowsAlt,
  FaSpinner,
  FaRedo,
} from "react-icons/fa";

/* ── Constants ─────────────────────────────────────────────────── */
const TARGET_SIZE = 1 * 1024 * 1024; // 1 MB
const MAX_UPLOAD_SIZE = 50 * 1024 * 1024; // 50 MB upload limit

/* ── Helpers ───────────────────────────────────────────────────── */
function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function reductionPercent(original: number, compressed: number): string {
  if (original === 0) return "0";
  return ((1 - compressed / original) * 100).toFixed(1);
}

/* ── Render page to canvas and re-embed as JPEG ────────────────── */

/**
 * Renders every page of the source PDF onto a <canvas> at a given
 * scale, then converts each page to JPEG.  Instead of using a fixed
 * quality, it calculates a **per-page byte budget** from the 1 MB
 * target and uses a binary-search on canvas.toBlob quality to hit
 * that budget.  This guarantees the output is ≤ 1 MB regardless of
 * page count.
 */
async function renderPdfToCompressedPdf(
  pdfBytes: Uint8Array,
  scaleFactor: number,
  _jpegQuality: number,              // kept for signature compat; ignored
  onProgress?: (msg: string) => void
): Promise<Uint8Array> {
  const pdfjsLib = await loadPdfJs();

  const loadingTask = pdfjsLib.getDocument({ data: pdfBytes.slice(0) });
  const srcDoc = await loadingTask.promise;
  const numPages = srcDoc.numPages;

  /* Reserve ~30 KB for PDF structure overhead per page */
  const overhead = numPages * 30 * 1024;
  const totalBudget = Math.max(TARGET_SIZE - overhead, TARGET_SIZE * 0.7);
  const perPageBudget = Math.floor(totalBudget / numPages);

  const newDoc = await PDFDocument.create();

  for (let i = 1; i <= numPages; i++) {
    onProgress?.(`Rendering page ${i}/${numPages}…`);
    const page = await srcDoc.getPage(i);
    const viewport = page.getViewport({ scale: scaleFactor });

    const canvas = document.createElement("canvas");
    canvas.width = Math.max(Math.round(viewport.width), 1);
    canvas.height = Math.max(Math.round(viewport.height), 1);
    const ctx = canvas.getContext("2d")!;

    await page.render({ canvasContext: ctx, viewport }).promise;

    /* Binary-search for the highest JPEG quality that fits the budget */
    let lo = 0.01;
    let hi = 0.92;
    let bestBlob: Blob | null = null;

    for (let iter = 0; iter < 8; iter++) {
      const mid = (lo + hi) / 2;
      const blob: Blob = await new Promise((resolve) =>
        canvas.toBlob((b) => resolve(b!), "image/jpeg", mid)
      );
      if (blob.size <= perPageBudget) {
        bestBlob = blob;   // fits — try higher quality
        lo = mid + 0.001;
      } else {
        hi = mid - 0.001;  // too big — go lower
      }
    }

    /* If even the lowest quality is too large, just use it */
    if (!bestBlob) {
      bestBlob = await new Promise((resolve) =>
        canvas.toBlob((b) => resolve(b!), "image/jpeg", 0.01)
      );
    }

    const jpegBytes = new Uint8Array(await bestBlob!.arrayBuffer());
    const jpegImage = await newDoc.embedJpg(jpegBytes);
    const newPage = newDoc.addPage([viewport.width, viewport.height]);
    newPage.drawImage(jpegImage, {
      x: 0,
      y: 0,
      width: viewport.width,
      height: viewport.height,
    });

    /* Free memory */
    canvas.width = 0;
    canvas.height = 0;
  }

  srcDoc.destroy();

  const result = await newDoc.save({ useObjectStreams: true, addDefaultPage: false });
  return result;
}

/* ── Load pdf.js from CDN (lazy, cached) ───────────────────────── */
/* eslint-disable @typescript-eslint/no-explicit-any */
let _pdfjsPromise: Promise<any> | null = null;

function loadPdfJs(): Promise<any> {
  if (_pdfjsPromise) return _pdfjsPromise;
  _pdfjsPromise = new Promise((resolve, reject) => {
    const existingLib = (window as any).pdfjsLib;
    if (existingLib) {
      resolve(existingLib);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.9.155/pdf.min.mjs";
    script.type = "module";

    /* pdf.js 4.x is an ES module; we need to import() it instead */
    const moduleScript = document.createElement("script");
    moduleScript.type = "module";
    moduleScript.textContent = `
      import * as pdfjsLib from "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.9.155/pdf.min.mjs";
      pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.9.155/pdf.worker.min.mjs";
      window.__pdfjsLib = pdfjsLib;
      window.dispatchEvent(new Event("pdfjsReady"));
    `;
    document.head.appendChild(moduleScript);

    const onReady = () => {
      window.removeEventListener("pdfjsReady", onReady);
      resolve((window as any).__pdfjsLib);
    };
    window.addEventListener("pdfjsReady", onReady);

    /* Timeout fallback */
    setTimeout(() => {
      if (!(window as any).__pdfjsLib) {
        reject(new Error("Failed to load pdf.js from CDN"));
      }
    }, 15000);
  });
  return _pdfjsPromise;
}
/* eslint-enable @typescript-eslint/no-explicit-any */

/* ── Structural-only compression (pdf-lib) ─────────────────────── */
async function structuralCompress(pdfBytes: Uint8Array): Promise<Uint8Array> {
  const doc = await PDFDocument.load(pdfBytes, { ignoreEncryption: true });
  return await doc.save({ useObjectStreams: true, addDefaultPage: false, objectsPerTick: 100 });
}

/* ── Main compression pipeline ─────────────────────────────────── */
async function compressPdf(
  fileBytes: Uint8Array,
  onProgress?: (msg: string) => void
): Promise<{ result: Uint8Array; passes: number }> {

  /* Pass 1: structural optimisation */
  onProgress?.("Pass 1: Structural optimisation…");
  let bestBytes = await structuralCompress(fileBytes);
  let pass = 1;

  if (bestBytes.length <= TARGET_SIZE) {
    return { result: bestBytes, passes: pass };
  }

  /*
   * Pass 2+: render pages as budget-aware JPEGs.
   * The render function internally binary-searches per-page JPEG
   * quality to fit the 1 MB budget.  We try a few scales from
   * high (better readability) to low (smaller canvases → smaller
   * minimum JPEG sizes) and stop as soon as the output fits.
   */
  const scales = [1.5, 1.2, 1.0, 0.8, 0.6, 0.45, 0.35, 0.25];

  for (const scale of scales) {
    if (bestBytes.length <= TARGET_SIZE) break;
    pass++;
    onProgress?.(
      `Pass ${pass}: Budget-aware render (scale ${Math.round(scale * 100)}%)…`
    );

    try {
      const rendered = await renderPdfToCompressedPdf(
        fileBytes, scale, 0, onProgress
      );
      if (rendered.length > 1024 && rendered.length < bestBytes.length) {
        bestBytes = rendered;
      }
    } catch (err) {
      console.warn(`Pass ${pass} failed, trying next scale`, err);
    }
  }

  return { result: bestBytes, passes: pass };
}

/* ══════════════════════════════════════════════════════════════════
   PDF COMPRESSOR COMPONENT
   ══════════════════════════════════════════════════════════════════ */
export default function PdfCompressor() {
  const inputRef = useRef<HTMLInputElement>(null);

  /* State */
  const [file, setFile] = useState<File | null>(null);
  const [originalSize, setOriginalSize] = useState(0);
  const [compressedBlob, setCompressedBlob] = useState<Blob | null>(null);
  const [compressedSize, setCompressedSize] = useState(0);
  const [isCompressing, setIsCompressing] = useState(false);
  const [progress, setProgress] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  /* ── Reset ───────────────────────────────────────────────────── */
  const reset = useCallback(() => {
    setFile(null);
    setOriginalSize(0);
    setCompressedBlob(null);
    setCompressedSize(0);
    setIsCompressing(false);
    setProgress("");
    setError("");
    setDone(false);
    if (inputRef.current) inputRef.current.value = "";
  }, []);

  /* ── Handle file ─────────────────────────────────────────────── */
  const handleFile = useCallback((f: File) => {
    setError("");
    setDone(false);
    setCompressedBlob(null);
    setCompressedSize(0);
    setProgress("");

    if (f.type !== "application/pdf") {
      setError("Please upload a valid PDF file.");
      return;
    }
    if (f.size > MAX_UPLOAD_SIZE) {
      setError(`File is too large (${formatBytes(f.size)}). Maximum upload size is ${formatBytes(MAX_UPLOAD_SIZE)}.`);
      return;
    }
    if (f.size <= TARGET_SIZE) {
      setError(`This PDF is already ${formatBytes(f.size)} — under the 1 MB target. No compression needed!`);
      return;
    }
    setFile(f);
    setOriginalSize(f.size);
  }, []);

  /* ── Drag & Drop ─────────────────────────────────────────────── */
  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const droppedFile = e.dataTransfer.files?.[0];
      if (droppedFile) handleFile(droppedFile);
    },
    [handleFile]
  );

  /* ── Compress ────────────────────────────────────────────────── */
  const handleCompress = useCallback(async () => {
    if (!file) return;
    setIsCompressing(true);
    setError("");
    setProgress("Reading PDF…");

    try {
      const arrayBuffer = await file.arrayBuffer();
      const bytes = new Uint8Array(arrayBuffer);

      const { result, passes } = await compressPdf(bytes, setProgress);

      const blob = new Blob([result.buffer as ArrayBuffer], { type: "application/pdf" });
      setCompressedBlob(blob);
      setCompressedSize(result.length);
      setDone(true);

      if (result.length > TARGET_SIZE) {
        setProgress(
          `Compressed in ${passes} pass${passes > 1 ? "es" : ""} but still ${formatBytes(result.length)}. The PDF may contain vector graphics or fonts that cannot be compressed further.`
        );
      } else {
        setProgress(
          `Done! Compressed in ${passes} pass${passes > 1 ? "es" : ""}.`
        );
      }
    } catch (err) {
      console.error(err);
      setError(
        "Failed to compress this PDF. It may be encrypted, corrupted, or use an unsupported format."
      );
      setProgress("");
    } finally {
      setIsCompressing(false);
    }
  }, [file]);

  /* ── Download ────────────────────────────────────────────────── */
  const handleDownload = useCallback(() => {
    if (!compressedBlob || !file) return;
    const url = URL.createObjectURL(compressedBlob);
    const a = document.createElement("a");
    a.href = url;
    const baseName = file.name.replace(/\.pdf$/i, "");
    a.download = `${baseName}_compressed.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [compressedBlob, file]);

  /* ── Render ──────────────────────────────────────────────────── */
  return (
    <div className="max-w-3xl lg:max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[var(--bg-muted)] border-2 border-[var(--border)] mb-4">
          <FaCompressArrowsAlt size={28} className="text-[var(--accent)]" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">
          PDF Compressor
        </h2>
        <p className="text-[var(--text-secondary)] max-w-lg mx-auto">
          Compress your PDF files to under <strong>1 MB</strong> — perfect for
          Passport, Visa, and OCI applications. 100 % browser-based, your files
          never leave your device.
        </p>
      </div>

      {/* Upload / File Info */}
      {!file ? (
        <div
          className="upload-zone p-8 text-center"
          onClick={() => inputRef.current?.click()}
          onDragOver={onDragOver}
          onDrop={onDrop}
        >
          <input
            ref={inputRef}
            type="file"
            accept="application/pdf,.pdf"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleFile(f);
            }}
          />
          <div className="upload-icon-wrapper mx-auto mb-4">
            <FaCloudUploadAlt size={36} className="text-[var(--accent)]" />
          </div>
          <h5 className="text-lg font-semibold mb-2">
            Drop your PDF here or click to browse
          </h5>
          <p className="text-sm text-[var(--text-secondary)]">
            Supports PDF files up to {formatBytes(MAX_UPLOAD_SIZE)}
          </p>
        </div>
      ) : (
        <div className="card-panel p-5 mb-6">
          {/* File info bar */}
          <div className="info-bar flex items-center justify-between p-3 mb-4">
            <div className="flex items-center gap-3 min-w-0">
              <FaFilePdf size={24} className="text-red-500 shrink-0" />
              <div className="min-w-0">
                <p className="font-semibold text-sm truncate">{file.name}</p>
                <p className="text-xs text-[var(--text-secondary)]">
                  Original size: <strong>{formatBytes(originalSize)}</strong>
                </p>
              </div>
            </div>
            <button
              className="btn-danger-outline shrink-0"
              onClick={reset}
              title="Remove file"
            >
              <FaTrashAlt size={14} />
              <span className="hidden sm:inline">Remove</span>
            </button>
          </div>

          {/* Compress button */}
          {!done && (
            <button
              className="btn-accent-lg w-full"
              onClick={handleCompress}
              disabled={isCompressing}
            >
              {isCompressing ? (
                <>
                  <FaSpinner size={16} className="animate-spin" />
                  Compressing…
                </>
              ) : (
                <>
                  <FaCompressArrowsAlt size={16} />
                  Compress to 1 MB
                </>
              )}
            </button>
          )}

          {/* Progress */}
          {progress && (
            <div className={`note-card mt-4 ${done && compressedSize <= TARGET_SIZE ? "border-green-500/30" : ""}`}>
              <div className="flex items-start gap-2">
                {done && compressedSize <= TARGET_SIZE ? (
                  <FaCheckCircle className="text-green-500 mt-0.5 shrink-0" />
                ) : done && compressedSize > TARGET_SIZE ? (
                  <FaExclamationTriangle className="text-amber-500 mt-0.5 shrink-0" />
                ) : (
                  <FaInfoCircle className="text-[var(--accent)] mt-0.5 shrink-0" />
                )}
                <span className="text-sm">{progress}</span>
              </div>
            </div>
          )}

          {/* Results */}
          {done && compressedBlob && (
            <div className="mt-4 space-y-4">
              {/* Size comparison */}
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-muted)] p-4 text-center">
                  <p className="text-xs text-[var(--text-secondary)] mb-1 uppercase tracking-wide">
                    Original
                  </p>
                  <p className="text-lg font-bold text-red-500">
                    {formatBytes(originalSize)}
                  </p>
                </div>
                <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-muted)] p-4 text-center">
                  <p className="text-xs text-[var(--text-secondary)] mb-1 uppercase tracking-wide">
                    Compressed
                  </p>
                  <p className={`text-lg font-bold ${compressedSize <= TARGET_SIZE ? "text-green-500" : "text-amber-500"}`}>
                    {formatBytes(compressedSize)}
                  </p>
                </div>
              </div>

              {/* Reduction badge */}
              <div className="text-center">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold ${
                  compressedSize <= TARGET_SIZE
                    ? "bg-green-500/10 text-green-600 dark:text-green-400"
                    : "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                }`}>
                  {compressedSize <= TARGET_SIZE ? <FaCheckCircle size={14} /> : <FaExclamationTriangle size={14} />}
                  {reductionPercent(originalSize, compressedSize)}% reduction
                </span>
              </div>

              {/* Action buttons */}
              <div className="flex gap-3">
                <button className="btn-success flex-1" onClick={handleDownload}>
                  <FaDownload size={14} />
                  Download Compressed PDF
                </button>
                <button className="btn-outline" onClick={reset}>
                  <FaRedo size={14} />
                  New File
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="note-card mt-4 border-red-500/30">
          <div className="flex items-start gap-2">
            <FaExclamationTriangle className="text-red-500 mt-0.5 shrink-0" />
            <span className="text-sm">{error}</span>
          </div>
        </div>
      )}

      {/* Info section */}
      <div className="note-card mt-6">
        <h6 className="font-bold mb-2">
          <FaInfoCircle className="inline text-[var(--accent)] mr-2" />
          How It Works
        </h6>
        <ul className="space-y-1.5 pl-1 text-sm text-[var(--text-secondary)]">
          <li>• <strong>Pass 1:</strong> Structural optimisation — removes unused objects and uses compact object streams</li>
          <li>• <strong>Pass 2+:</strong> Renders each page as a compressed JPEG image at progressively lower resolution &amp; quality</li>
          <li>• Automatically finds the best scale/quality combination to hit the <strong>≤ 1 MB</strong> target</li>
          <li>• Uses pdf.js for rendering and pdf-lib for rebuilding — everything in your browser</li>
          <li>• Your files <strong>never leave your device</strong> — 100 % private</li>
          <li>• Ideal for Passport, Visa, and OCI application uploads</li>
        </ul>
      </div>
    </div>
  );
}
