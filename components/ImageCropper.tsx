"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Cropper, { type ReactCropperElement } from "react-cropper";
import "cropperjs/dist/cropper.css";
import {
  FaCropAlt,
  FaUpload,
  FaSearchPlus,
  FaSyncAlt,
  FaUndo,
  FaDownload,
  FaCheckCircle,
  FaExclamationTriangle,
  FaImage,
  FaTimes,
  FaArrowsAltH,
  FaArrowsAltV,
  FaMagic,
} from "react-icons/fa";
import HeroBanner from "./HeroBanner";

interface AspectRatio {
  label: string;
  value: number;
  desc: string;
  badge?: string;
  badgeClass?: string;
}

interface CroppedData {
  url: string;
  width: number;
  height: number;
  sizeKB: string;
  isWithinLimit: boolean;
  blob: Blob;
}

interface CropInfo {
  x: number;
  y: number;
  width: number;
  height: number;
  rotate: number;
}

const ASPECT_RATIOS: AspectRatio[] = [
  { label: "4:5", value: 4 / 5, desc: "UK", badge: "uk", badgeClass: "badge badge-purple" },
  { label: "413:531", value: 413 / 531, desc: "EU", badge: "eu", badgeClass: "badge badge-sky" },
  { label: "1:1", value: 1, desc: "USA", badge: "usa", badgeClass: "badge badge-blue" },
  { label: "1:1", value: 1, desc: "India", badge: "photo", badgeClass: "badge badge-orange" },
  { label: "3:1", value: 3, desc: "OCI Signature", badge: "signature", badgeClass: "badge badge-amber" },
];

export default function ImageCropper() {
  const cropperRef = useRef<ReactCropperElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const sampleDataUrl = useRef<string | null>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [isSample, setIsSample] = useState(true);
  const [activeRatio, setActiveRatio] = useState(1);
  const [activePreset, setActivePreset] = useState("India");
  const [showModal, setShowModal] = useState(false);
  const [croppedData, setCroppedData] = useState<CroppedData | null>(null);
  const [flipX, setFlipX] = useState(1);
  const [flipY, setFlipY] = useState(1);
  const [cropInfo, setCropInfo] = useState<CropInfo>({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    rotate: 0,
  });
  const [fileName, setFileName] = useState("");

  // Fetch sample image on mount
  useEffect(() => {
    const fetchSampleImage = async () => {
      try {
        const res = await fetch("/api/sample-image?t=" + Date.now(), {
          cache: "no-store",
        });
        if (!res.ok) throw new Error("Failed to fetch sample image");
        const blob = await res.blob();
        const reader = new FileReader();
        reader.onloadend = () => {
          const dataUrl = reader.result as string;
          sampleDataUrl.current = dataUrl;
          setImageSrc(dataUrl);
        };
        reader.readAsDataURL(blob);
      } catch (err) {
        console.warn("Could not fetch sample image, generating fallback:", err);
        const canvas = document.createElement("canvas");
        canvas.width = 600;
        canvas.height = 600;
        const ctx = canvas.getContext("2d")!;
        const bgGrad = ctx.createLinearGradient(0, 0, 600, 600);
        bgGrad.addColorStop(0, "#dce3ec");
        bgGrad.addColorStop(1, "#c8d6e5");
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, 600, 600);
        ctx.fillStyle = "#d4a574";
        ctx.beginPath();
        ctx.ellipse(300, 260, 100, 120, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#2c3e6b";
        ctx.beginPath();
        ctx.ellipse(300, 560, 180, 140, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.font = "bold 15px Arial, sans-serif";
        ctx.fillStyle = "rgba(102,126,234,0.6)";
        ctx.textAlign = "center";
        ctx.fillText("SAMPLE — Upload your photo above", 300, 575);
        const dataUrl = canvas.toDataURL("image/jpeg", 0.92);
        sampleDataUrl.current = dataUrl;
        setImageSrc(dataUrl);
      }
    };
    fetchSampleImage();
  }, []);

  // Close modal on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && showModal) setShowModal(false);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [showModal]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [showModal]);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      if (!file.type.startsWith("image/")) {
        alert("Please select a valid image file.");
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        alert("Image too large. Please select an image under 10MB.");
        return;
      }
      setFileName(file.name);
      setIsSample(false);
      const reader = new FileReader();
      reader.onload = () => setImageSrc(reader.result as string);
      reader.readAsDataURL(file);
      setShowModal(false);
      setCroppedData(null);
    },
    []
  );

  const handleCrop = useCallback(() => {
    const cropper = cropperRef.current?.cropper;
    if (!cropper) return;
    const data = cropper.getData(true);
    setCropInfo({
      x: Math.round(data.x),
      y: Math.round(data.y),
      width: Math.round(data.width),
      height: Math.round(data.height),
      rotate: Math.round(data.rotate),
    });
  }, []);

  const handleCropClick = useCallback(() => {
    const cropper = cropperRef.current?.cropper;
    if (!cropper) return;
    const data = cropper.getData(true);
    const cropWidth = Math.round(data.width);
    const cropHeight = Math.round(data.height);
    if (cropWidth === 0 || cropHeight === 0) {
      alert("Please select a crop area first.");
      return;
    }

    /* ── Per-preset limits ─────────────────────────────────────── */
    const presetLimits: Record<string, { minW: number; minH: number; maxW: number; maxH: number; maxSize: number; minSize: number }> = {
      USA:              { minW: 600, minH: 600, maxW: 1200, maxH: 1200, maxSize: 240 * 1024,        minSize: 0 },
      India:            { minW: 200, minH: 200, maxW: 900,  maxH: 900,  maxSize: 200 * 1024,        minSize: 10 * 1024 },
      UK:               { minW: 600, minH: 750, maxW: 4500, maxH: 5625, maxSize: 10 * 1024 * 1024,  minSize: 50 * 1024 },
      "OCI Signature":  { minW: 200, minH: 67,  maxW: 3500, maxH: 2500, maxSize: 1 * 1024 * 1024,   minSize: 10 * 1024 },
    };
    const defaults = { minW: 200, minH: 200, maxW: 1500, maxH: 1500, maxSize: 500 * 1024, minSize: 0 };
    const limits = presetLimits[activePreset] ?? defaults;
    const { minW: MIN_W, minH: MIN_H, maxW: MAX_W, maxH: MAX_H, maxSize: MAX_SIZE, minSize: MIN_SIZE } = limits;

    const ratio = cropWidth / cropHeight;
    let outWidth: number;
    let outHeight: number;
    if (ratio >= 1) {
      outWidth = Math.min(cropWidth, MAX_W);
      outHeight = Math.round(outWidth / ratio);
      if (outHeight < MIN_H) {
        outHeight = MIN_H;
        outWidth = Math.round(outHeight * ratio);
      }
    } else {
      outHeight = Math.min(cropHeight, MAX_H);
      outWidth = Math.round(outHeight * ratio);
      if (outWidth < MIN_W) {
        outWidth = MIN_W;
        outHeight = Math.round(outWidth / ratio);
      }
    }
    if (outWidth > MAX_W) {
      outWidth = MAX_W;
      outHeight = Math.round(outWidth / ratio);
    }
    if (outHeight > MAX_H) {
      outHeight = MAX_H;
      outWidth = Math.round(outHeight * ratio);
    }
    outWidth = Math.max(outWidth, MIN_W);
    outHeight = Math.max(outHeight, MIN_H);
    const canvas = cropper.getCroppedCanvas({
      width: outWidth,
      height: outHeight,
      fillColor: "#fff",            // white background for JPEG output
      imageSmoothingEnabled: true,
      imageSmoothingQuality: "high",
    });
    if (!canvas) {
      alert("Could not crop. Please try again.");
      return;
    }
    const compressToLimit = async (
      srcCanvas: HTMLCanvasElement
    ): Promise<{
      blob: Blob | null;
      url: string;
      width: number;
      height: number;
    }> => {
      let quality = 0.92;
      let blob: Blob | null = null;
      while (quality >= 0.1) {
        blob = await new Promise<Blob | null>((resolve) =>
          srcCanvas.toBlob((b) => resolve(b), "image/jpeg", quality)
        );
        if (blob && blob.size <= MAX_SIZE) break;
        quality -= 0.05;
      }
      if (blob && blob.size > MAX_SIZE) {
        let scale = 0.9;
        let scaledCanvas: HTMLCanvasElement = srcCanvas;
        while (scale >= 0.3) {
          const tmpCanvas = document.createElement("canvas");
          tmpCanvas.width = Math.round(srcCanvas.width * scale);
          tmpCanvas.height = Math.round(srcCanvas.height * scale);
          const ctx = tmpCanvas.getContext("2d")!;
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = "high";
          ctx.drawImage(srcCanvas, 0, 0, tmpCanvas.width, tmpCanvas.height);
          blob = await new Promise<Blob | null>((resolve) =>
            tmpCanvas.toBlob((b) => resolve(b), "image/jpeg", 0.85)
          );
          scaledCanvas = tmpCanvas;
          if (blob && blob.size <= MAX_SIZE) break;
          scale -= 0.1;
        }
        if (scaledCanvas !== srcCanvas) {
          const dataUrl = scaledCanvas.toDataURL("image/jpeg", 0.85);
          return {
            blob,
            url: dataUrl,
            width: scaledCanvas.width,
            height: scaledCanvas.height,
          };
        }
      }
      const dataUrl = srcCanvas.toDataURL(
        "image/jpeg",
        quality > 0.1 ? quality : 0.1
      );
      return {
        blob,
        url: dataUrl,
        width: srcCanvas.width,
        height: srcCanvas.height,
      };
    };
    compressToLimit(canvas).then(({ blob, url, width, height }) => {
      if (!blob) {
        alert("Could not process the image. Please try again.");
        return;
      }
      const sizeKB = (blob.size / 1024).toFixed(1);
      const isWithinLimit = blob.size <= MAX_SIZE && blob.size >= MIN_SIZE;
      setCroppedData({ url, width, height, sizeKB, isWithinLimit, blob });
      setShowModal(true);
    });
  }, [activePreset]);

  const handleDownload = useCallback(() => {
    if (!croppedData) return;
    const url = URL.createObjectURL(croppedData.blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `passport-photo-${activePreset.toLowerCase()}-${Date.now()}.jpg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [croppedData, activePreset]);

  const handleRatioChange = useCallback((ratio: number, preset: string) => {
    setActiveRatio(ratio);
    setActivePreset(preset);
    const cropper = cropperRef.current?.cropper;
    if (cropper) cropper.setAspectRatio(ratio);
  }, []);

  const handleZoomReset = useCallback(() => {
    cropperRef.current?.cropper?.zoomTo(1);
  }, []);

  const handleRotateLeft1 = useCallback(() => {
    cropperRef.current?.cropper?.rotate(-1);
  }, []);

  const handleRotateRight1 = useCallback(() => {
    cropperRef.current?.cropper?.rotate(1);
  }, []);

  const handleRotate = useCallback(() => {
    cropperRef.current?.cropper?.rotate(45);
  }, []);

  const handleFlipH = useCallback(() => {
    const newScale = flipX * -1;
    setFlipX(newScale);
    cropperRef.current?.cropper?.scaleX(newScale);
  }, [flipX]);

  const handleFlipV = useCallback(() => {
    const newScale = flipY * -1;
    setFlipY(newScale);
    cropperRef.current?.cropper?.scaleY(newScale);
  }, [flipY]);

  const handleReset = useCallback(() => {
    cropperRef.current?.cropper?.reset();
    setCroppedData(null);
    setShowModal(false);
    setFlipX(1);
    setFlipY(1);
    if (!isSample && sampleDataUrl.current) {
      setImageSrc(sampleDataUrl.current);
      setIsSample(true);
      setFileName("");
    }
  }, [isSample]);

  return (
    <>
      {/* Hero Banner */}
      <HeroBanner>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2 tracking-tight">
          <FaCropAlt className="inline mr-2 align-baseline" />
          Passport Photo &amp; Signature Cropper
        </h1>
        <p className="hero-subtitle text-base sm:text-lg">
          Free tool to resize and crop your photos &amp; signatures for
          UK, EU, USA, India, OCI and other applications
        </p>
      </HeroBanner>

      <div className="max-w-5xl lg:max-w-6xl xl:max-w-7xl mx-auto px-4 sm:px-6">
        {/* Sample Image Banner */}
        {isSample && (
          <div className="sample-banner mb-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 px-5">
              <div className="flex items-center gap-3">
                <div className="sample-badge">
                  <FaMagic size={22} className="text-white" />
                </div>
                <div>
                  <h6 className="font-bold text-sm text-foreground">
                    Try it out with the sample image below!
                  </h6>
                  <small className="text-sm text-secondary">
                    Or upload your own photo to get started
                  </small>
                </div>
              </div>
              <label className="btn-accent btn-accent-lg cursor-pointer shadow-sm">
                <FaUpload className="mr-2" />
                Upload Your Image
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        )}

        {/* Cropper Card */}
        <div className="cropper-card mb-6">
          <Cropper
            ref={cropperRef}
            src={imageSrc ?? undefined}
            className="cropper-responsive"
            aspectRatio={activeRatio}
            viewMode={1}
            dragMode="move"
            autoCropArea={0.8}
            responsive={true}
            guides={true}
            center={true}
            highlight={true}
            cropBoxMovable={true}
            cropBoxResizable={true}
            crop={handleCrop}
          />
        </div>

        {/* Crop Info Bar */}
        <div className="info-bar mb-6">
          <div className="py-2.5 px-4">
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 text-center">
              {[
                { label: "X", value: cropInfo.x, unit: "px" },
                { label: "Y", value: cropInfo.y, unit: "px" },
                { label: "Width", value: cropInfo.width, unit: "px" },
                { label: "Height", value: cropInfo.height, unit: "px" },
                { label: "Rotate", value: cropInfo.rotate, unit: "\u00b0" },
              ].map((item) => (
                <div key={item.label}>
                  <small className="block text-muted">
                    {item.label}
                  </small>
                  <strong className="text-foreground">
                    {item.value}
                    <span className="font-normal text-muted">
                      {item.unit}
                    </span>
                  </strong>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="card-panel mb-6">
          <div className="p-5">
            {/* Action Buttons – Row 1: Upload, Crop, Reset */}
            <div className="flex flex-wrap justify-center gap-2 mb-2">
              <label className="btn-outline cursor-pointer">
                <FaUpload className="mr-1" />
                {isSample ? "Upload Your Image" : "Change Image"}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  ref={isSample ? fileInputRef : undefined}
                />
              </label>
              <button
                className="btn-success px-5 shadow-sm"
                onClick={handleCropClick}
              >
                <FaCropAlt className="mr-1" /> Crop Image
              </button>
              <button className="btn-danger-outline" onClick={handleReset}>
                <FaUndo className="mr-1" /> Reset
              </button>
            </div>

            {/* Action Buttons – Row 2: Zoom, Rotate, Flip */}
            <div className="flex flex-wrap justify-center gap-2 mb-4">
              <button className="btn-outline" onClick={handleZoomReset}>
                <FaSearchPlus className="mr-1" /> Zoom 100%
              </button>
              <button className="btn-warning-outline" onClick={handleRotateLeft1}>
                <FaSyncAlt className="mr-1" /> −1°
              </button>
              <button className="btn-warning-outline" onClick={handleRotateRight1}>
                <FaSyncAlt className="mr-1" /> +1°
              </button>
              <button className="btn-warning-outline" onClick={handleRotate}>
                <FaSyncAlt className="mr-1" /> Rotate 45°
              </button>
              <button className="btn-warning-outline" onClick={handleFlipH}>
                <FaArrowsAltH className="mr-1" /> Flip H
              </button>
              <button className="btn-warning-outline" onClick={handleFlipV}>
                <FaArrowsAltV className="mr-1" /> Flip V
              </button>
            </div>

            {/* Aspect Ratio Selector */}
            <h6 className="mb-2 text-sm font-medium text-center text-muted">
              Aspect Ratio
            </h6>
            <div className="flex flex-wrap justify-center gap-2">
              {ASPECT_RATIOS.map((r) => (
                <button
                  key={r.desc}
                  className={
                    activePreset === r.desc
                      ? "btn-accent shadow-sm px-4"
                      : "btn-outline px-4"
                  }
                  onClick={() => handleRatioChange(r.value, r.desc)}
                >
                  {r.label}
                  {r.badge && (
                    <span className={`ml-1 ${r.badgeClass}`}>
                      {r.desc}
                    </span>
                  )}
                  {!r.badge && (
                    <small className="ml-1 text-muted">
                      ({r.desc})
                    </small>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Note Box */}
        <div className="note-card mb-6">
          <div>
            <h6 className="font-bold mb-2">
              <FaExclamationTriangle className="inline text-amber-500 mr-2" />
              Important Notes
            </h6>
            <ul className="space-y-1.5 pl-1">
              {activePreset === "India" && (
                <>
                  <li>
                    Indian Passport / Visa / OCI{" "}
                    <strong>Photo</strong> aspect ratio:{" "}
                    <span className="badge-info">1:1</span> — height and width
                    must be equal
                  </li>
                  <li>
                    Dimensions: min <strong>200×200 px</strong>, max{" "}
                    <strong>900×900 px</strong>
                  </li>
                  <li>
                    File size: at least <strong>10 KB</strong>, maximum{" "}
                    <strong>200 KB</strong> (JPEG format)
                  </li>
                  <li>
                    Photo must have a <strong>white or light</strong> background
                  </li>
                  <li>
                    Face must be <strong>centered</strong> and clearly visible
                    (no sunglasses, hats, or head coverings unless religious)
                  </li>
                </>
              )}
              {activePreset === "OCI Signature" && (
                <>
                  <li>
                    Indian Passport / Visa / OCI{" "}
                    <strong>Signature</strong> aspect ratio:{" "}
                    <span className="badge-warning">3:1</span> — width is 3×
                    the height
                  </li>
                  <li>
                    Dimensions: min <strong>200×67 px</strong>, max{" "}
                    <strong>3500×2500 px</strong>
                  </li>
                  <li>
                    File size: at least <strong>10 KB</strong>, maximum{" "}
                    <strong>1 MB</strong> (JPEG format preferred)
                  </li>
                  <li>
                    Signature must be on a <strong>white</strong> background
                    with <strong>black or dark blue</strong> ink
                  </li>
                  <li>
                    The signature must be <strong>your own</strong> hand-written
                    signature — no digital or typed text
                  </li>
                </>
              )}
              {activePreset === "UK" && (
                <>
                  <li>
                    UK Passport photo ratio:{" "}
                    <span className="badge-info">4:5</span> — 35 mm wide ×
                    45 mm tall (min{" "}
                    <strong>600 × 750 px</strong>)
                  </li>
                  <li>
                    File size: at least <strong>50 KB</strong> and no more than{" "}
                    <strong>10 MB</strong>
                  </li>
                  <li>
                    Photo must be <strong>clear, in focus, in colour</strong>{" "}
                    and <strong>unaltered</strong> by software
                  </li>
                  <li>
                    Taken against a{" "}
                    <strong>plain light-coloured background</strong> with no
                    other objects or people
                  </li>
                  <li>
                    Face <strong>forwards</strong>, looking straight at camera,{" "}
                    <strong>plain expression</strong>, mouth closed, eyes open
                    and visible
                  </li>
                  <li>
                    No hair covering eyes; no head coverings unless for{" "}
                    <strong>religious or medical</strong> reasons
                  </li>
                  <li>
                    Do <strong>not</strong> wear glasses unless essential — no
                    sunglasses or tinted lenses; no frames covering eyes, no
                    glare or reflections
                  </li>
                  <li>
                    No shadows on face or behind you; no red-eye
                  </li>
                  <li>
                    Photo must have been taken in the{" "}
                    <strong>last month</strong>
                  </li>
                  <li>
                    <small>
                      Source:{" "}
                      <a
                        href="https://www.gov.uk/photos-for-passports"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-accent"
                      >
                        GOV.UK — Get a passport photo
                      </a>
                    </small>
                  </li>
                </>
              )}
              {activePreset === "EU" && (
                <>
                  <li>
                    EU/Schengen passport photo:{" "}
                    <span className="badge-info">413:531</span> — 35 × 45 mm
                    (ICAO/ISO standard, min{" "}
                    <strong>413 × 531 px</strong> at 300 DPI)
                  </li>
                  <li>
                    Photo must be <strong>recent</strong>, in colour, sharp and
                    in focus — <strong>no digital alterations</strong>
                  </li>
                  <li>
                    Taken against a{" "}
                    <strong>plain, light (white or light grey)</strong>{" "}
                    background with uniform lighting
                  </li>
                  <li>
                    Face the camera <strong>directly</strong>; neutral
                    expression, mouth closed, eyes open and clearly visible
                  </li>
                  <li>
                    Head must occupy <strong>70–80 %</strong> of the frame
                    (from chin to crown approx. 32–36 mm)
                  </li>
                  <li>
                    No head coverings unless for <strong>religious</strong>{" "}
                    reasons — face must remain fully visible
                  </li>
                  <li>
                    Glasses allowed only if <strong>no glare</strong>, no
                    tinted lenses, and frames do not cover the eyes
                  </li>
                  <li>
                    No shadows on the face or background; no red-eye
                  </li>
                  <li>
                    <small>
                      Based on ICAO Doc 9303 &amp; EU Council Regulation
                      (EC) 2252/2004
                    </small>
                  </li>
                </>
              )}
              {activePreset === "USA" && (
                <>
                  <li>
                    U.S. Passport photo ratio:{" "}
                    <span className="badge-info">1:1</span> — 2 × 2 inches
                    (51 × 51 mm)
                  </li>
                  <li>
                    Minimum dimensions:{" "}
                    <strong>600 × 600 px</strong>; maximum dimensions:{" "}
                    <strong>1200 × 1200 px</strong>
                  </li>
                  <li>
                    Maximum file size: <strong>240 KB</strong>
                  </li>
                  <li>
                    Submit a recent colour photo taken in the{" "}
                    <strong>last 6 months</strong>
                  </li>
                  <li>
                    Use a <strong>white or off-white</strong> background —
                    no shadows, texture, or lines
                  </li>
                  <li>
                    Clear image of your face — do <strong>not</strong> alter
                    with software, phone apps, filters, or AI
                  </li>
                  <li>
                    Face the camera <strong>directly</strong> without tilting
                    your head; <strong>plain expression</strong>, mouth closed
                  </li>
                  <li>
                    <strong>Remove eyeglasses</strong> for the photo
                  </li>
                  <li>
                    No hats or head coverings unless for{" "}
                    <strong>religious</strong> reasons
                  </li>
                  <li>
                    Photo must be high resolution — not blurry, grainy, or
                    pixelated
                  </li>
                  <li>
                    <small>
                      Source:{" "}
                      <a
                        href="https://travel.state.gov/content/travel/en/passports/how-apply/photos.html"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-accent"
                      >
                        U.S. Department of State — Passport Photos
                      </a>
                    </small>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </div>

      {/* Crop Result Modal */}
      <div
        className={`modal-overlay${showModal ? " open" : ""}`}
        onClick={(e: React.MouseEvent<HTMLDivElement>) => {
          if (e.target === e.currentTarget) setShowModal(false);
        }}
        aria-hidden={!showModal}
      >
        <div
          className="modal-dialog"
          role="dialog"
          aria-labelledby="cropResultModalLabel"
        >
          <div className="crop-modal-card">
            <div className="modal-header">
              <h5 className="modal-title" id="cropResultModalLabel">
                <FaCropAlt className="text-accent" />
                Cropped Result
              </h5>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setShowModal(false)}
                aria-label="Close"
              >
                <FaTimes />
              </button>
            </div>
            <div className="modal-body text-center">
              {croppedData && (
                <>
                  <div className="cropped-preview-wrapper mb-3">
                    <img
                      src={croppedData.url}
                      alt="Cropped"
                      className="rounded-lg shadow-sm"
                    />
                  </div>
                  <div className="flex flex-wrap justify-center gap-4 sm:gap-8 mb-3">
                    <div>
                      <small className="block text-muted">
                        Dimensions
                      </small>
                      <strong>
                        {croppedData.width} × {croppedData.height} px
                      </strong>
                    </div>
                    <div>
                      <small className="block text-muted">
                        File Size
                      </small>
                      <strong
                        className={
                          croppedData.isWithinLimit
                            ? "text-green-500"
                            : "text-red-500"
                        }
                      >
                        {croppedData.sizeKB} KB{" "}
                        {croppedData.isWithinLimit ? (
                          <FaCheckCircle className="inline" />
                        ) : (
                          <FaExclamationTriangle className="inline" />
                        )}
                      </strong>
                    </div>
                  </div>
                  {!croppedData.isWithinLimit && (
                    <div className="alert-warning py-2 text-sm">
                      <FaExclamationTriangle className="inline mr-1" />
                      {activePreset === "UK"
                        ? `File must be between 50 KB and 10 MB. Current: ${croppedData.sizeKB} KB.`
                        : activePreset === "USA"
                        ? `File exceeds 240 KB USA limit. We'll compress it on download.`
                        : activePreset === "India"
                        ? `File exceeds 200 KB India limit. We'll compress it on download.`
                        : activePreset === "OCI Signature"
                        ? `File exceeds 1 MB OCI Signature limit. We'll compress it on download.`
                        : `File exceeds 500 KB limit. We'll compress it on download.`}
                    </div>
                  )}
                  {activePreset === "UK" &&
                    (croppedData.width < 600 || croppedData.height < 750) && (
                    <div className="alert-danger py-2 text-sm">
                      <FaExclamationTriangle className="inline mr-1" />
                      Image is below the minimum 600×750 px UK requirement.
                      Please select a larger crop area.
                    </div>
                  )}
                  {activePreset === "USA" &&
                    (croppedData.width < 600 || croppedData.height < 600) && (
                    <div className="alert-danger py-2 text-sm">
                      <FaExclamationTriangle className="inline mr-1" />
                      Image is below the minimum 600×600 px USA requirement.
                      Please select a larger crop area.
                    </div>
                  )}
                  {activePreset === "OCI Signature" &&
                    (croppedData.width < 200 || croppedData.height < 67) && (
                    <div className="alert-danger py-2 text-sm">
                      <FaExclamationTriangle className="inline mr-1" />
                      Image is below the minimum 200×67 px OCI Signature
                      requirement. Please select a larger crop area.
                    </div>
                  )}
                  {activePreset !== "UK" && activePreset !== "USA" &&
                    activePreset !== "OCI Signature" &&
                    (croppedData.width < 200 || croppedData.height < 200) && (
                    <div className="alert-danger py-2 text-sm">
                      <FaExclamationTriangle className="inline mr-1" />
                      Image is below the minimum 200×200 px requirement. Please
                      select a larger crop area.
                    </div>
                  )}
                </>
              )}
            </div>
            <div className="modal-footer">
              <button
                className="btn-success btn-success-lg px-8 shadow-sm"
                onClick={handleDownload}
              >
                <FaDownload className="mr-2" />
                Download Image
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
