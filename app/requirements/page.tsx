import {
  FaCamera,
  FaSignature,
  FaLightbulb,
  FaArrowLeft,
  FaFilePdf,
  FaGlobeAmericas,
  FaGlobeEurope,
  FaGlobeAsia,
  FaCompressArrowsAlt,
} from "react-icons/fa";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

/* ── UK Passport ───────────────────────────────────────────────── */
const ukPhotoReqs = [
  "Aspect ratio: 4:5 (35 × 45 mm print size)",
  "Minimum dimensions: 600 × 750 px",
  "File size: at least 50 KB and no more than 10 MB",
  "Format: JPEG / JPG",
  "Background: Plain light-grey or cream — no patterns or shadows",
  "Neutral expression, mouth closed",
  "No glasses (including sunglasses)",
  "No head coverings unless for religious reasons",
];

/* ── EU / Schengen Passport ────────────────────────────────────── */
const euPhotoReqs = [
  "Aspect ratio: 413:531 (35 × 45 mm print size)",
  "Face height: 32–36 mm (70–80 % of frame)",
  "Minimum resolution: 300 DPI recommended",
  "Format: JPEG / JPG",
  "Background: Light, uniform, single colour",
  "Neutral expression, mouth closed, both eyes visible",
  "No tinted or reflective glasses",
  "Follows ICAO 9303 biometric standards",
];

/* ── USA Passport ──────────────────────────────────────────────── */
const usaPhotoReqs = [
  "Aspect ratio: 1:1 (2 × 2 inches / 51 × 51 mm)",
  "Minimum dimensions: 600 × 600 px",
  "Maximum dimensions: 1200 × 1200 px",
  "Maximum file size: 240 KB",
  "Format: JPEG / JPG",
  "Background: White or off-white — no shadows, texture, or lines",
  "Photo taken within the last 6 months",
  "Remove eyeglasses for the photo",
  "No hats or head coverings unless for religious reasons",
];

/* ── India (Passport / Visa / OCI) ─────────────────────────────── */
const indiaPhotoReqs = [
  "Aspect ratio: 1:1 (square)",
  "Minimum dimensions: 200 × 200 px",
  "Maximum dimensions: 900 × 900 px",
  "File size: at least 10 KB and no more than 200 KB",
  "Format: JPEG / JPG",
  "Background: Plain white or light",
  "Face must cover 70–80 % of the frame",
];

const indiaSignatureReqs = [
  "Aspect ratio: 3:1 (wide landscape)",
  "Minimum dimensions: 200 × 67 px",
  "Maximum dimensions: 3500 × 2500 px",
  "File size: at least 10 KB and no more than 1 MB",
  "Format: JPEG / JPG",
  "Background: Plain white",
  "Use black or dark-blue ink",
];

/* ── Quick Tips ────────────────────────────────────────────────── */
const quickTips = [
  {
    icon: "🖼️",
    title: "Background",
    tip: "Use a plain white or light-coloured background. Avoid patterns, shadows, and other people in the frame.",
  },
  {
    icon: "💡",
    title: "Lighting",
    tip: "Ensure even lighting on your face with no harsh shadows. Natural daylight works best.",
  },
  {
    icon: "😐",
    title: "Expression",
    tip: "Keep a neutral expression with mouth closed. Both eyes must be open and clearly visible.",
  },
  {
    icon: "📄",
    title: "Format",
    tip: "Save your final images in JPEG format. Our tool handles compression automatically to meet each country's size limit.",
  },
  {
    icon: "📦",
    title: "PDF Size",
    tip: "Many application portals require PDF uploads under 1 MB. Use our PDF Compressor to reduce file size while maintaining readability.",
  },
];

export default function OciRequirementsPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen py-6 sm:py-8 md:py-10">
        <div className="max-w-5xl lg:max-w-6xl xl:max-w-7xl mx-auto px-4 sm:px-6">
          {/* Header */}
          <div className="text-center mb-8 sm:mb-10">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-3">
              Photo, Signature &amp; PDF Requirements
            </h1>
            <p className="text-sm sm:text-base text-[var(--text-secondary)] max-w-2xl mx-auto">
              Make sure your photos, signatures, and PDF documents meet official
              specifications for UK, EU / Schengen, USA, and India
              (Passport / Visa / OCI) applications.
            </p>
          </div>

          {/* ── UK ────────────────────────────────────────────── */}
          <h2 className="text-xl sm:text-2xl font-bold mb-4 flex items-center gap-2">
            <FaGlobeEurope className="text-[#7c3aed]" />
            UK Passport
          </h2>
          <div className="grid gap-4 sm:gap-6 md:grid-cols-1 mb-12">
            <div className="requirement-card">
              <div className="flex items-center gap-3 mb-4">
                <div className="icon-circle">
                  <FaCamera size={20} />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold">Photo Requirements</h3>
              </div>
              <ul className="space-y-2">
                {ukPhotoReqs.map((req) => (
                  <li
                    key={req}
                    className="flex items-start gap-2 text-sm text-[var(--text-secondary)]"
                  >
                    <span className="mt-1 text-green-500 shrink-0">✓</span>
                    {req}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* ── EU / Schengen ─────────────────────────────────── */}
          <h2 className="text-xl sm:text-2xl font-bold mb-4 flex items-center gap-2">
            <FaGlobeEurope className="text-[#0ea5e9]" />
            EU / Schengen Passport
          </h2>
          <div className="grid gap-4 sm:gap-6 md:grid-cols-1 mb-12">
            <div className="requirement-card">
              <div className="flex items-center gap-3 mb-4">
                <div className="icon-circle">
                  <FaCamera size={20} />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold">Photo Requirements</h3>
              </div>
              <ul className="space-y-2">
                {euPhotoReqs.map((req) => (
                  <li
                    key={req}
                    className="flex items-start gap-2 text-sm text-[var(--text-secondary)]"
                  >
                    <span className="mt-1 text-green-500 shrink-0">✓</span>
                    {req}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* ── USA ───────────────────────────────────────────── */}
          <h2 className="text-xl sm:text-2xl font-bold mb-4 flex items-center gap-2">
            <FaGlobeAmericas className="text-[#2563eb]" />
            USA Passport
          </h2>
          <div className="grid gap-4 sm:gap-6 md:grid-cols-1 mb-12">
            <div className="requirement-card">
              <div className="flex items-center gap-3 mb-4">
                <div className="icon-circle">
                  <FaCamera size={20} />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold">Photo Requirements</h3>
              </div>
              <ul className="space-y-2">
                {usaPhotoReqs.map((req) => (
                  <li
                    key={req}
                    className="flex items-start gap-2 text-sm text-[var(--text-secondary)]"
                  >
                    <span className="mt-1 text-green-500 shrink-0">✓</span>
                    {req}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* ── India ─────────────────────────────────────────── */}
          <h2 className="text-xl sm:text-2xl font-bold mb-4 flex items-center gap-2">
            <FaGlobeAsia className="text-[var(--accent)]" />
            India — Passport, Visa &amp; OCI
          </h2>
          <div className="grid gap-4 sm:gap-6 md:grid-cols-2 mb-12">
            {/* Photo Card */}
            <div className="requirement-card">
              <div className="flex items-center gap-3 mb-4">
                <div className="icon-circle">
                  <FaCamera size={20} />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold">Photo Requirements</h3>
              </div>
              <ul className="space-y-2">
                {indiaPhotoReqs.map((req) => (
                  <li
                    key={req}
                    className="flex items-start gap-2 text-sm text-[var(--text-secondary)]"
                  >
                    <span className="mt-1 text-green-500 shrink-0">✓</span>
                    {req}
                  </li>
                ))}
              </ul>
            </div>

            {/* Signature Card */}
            <div className="requirement-card">
              <div className="flex items-center gap-3 mb-4">
                <div className="icon-circle">
                  <FaSignature size={20} />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold">
                  Signature Requirements
                </h3>
              </div>
              <ul className="space-y-2">
                {indiaSignatureReqs.map((req) => (
                  <li
                    key={req}
                    className="flex items-start gap-2 text-sm text-[var(--text-secondary)]"
                  >
                    <span className="mt-1 text-green-500 shrink-0">✓</span>
                    {req}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* ── PDF Compression ────────────────────────────────── */}
          <h2 className="text-xl sm:text-2xl font-bold mb-4 flex items-center gap-2">
            <FaCompressArrowsAlt className="text-[var(--accent)]" />
            PDF Compression
          </h2>
          <div className="grid gap-4 sm:gap-6 md:grid-cols-1 mb-12">
            <div className="requirement-card">
              <div className="flex items-center gap-3 mb-4">
                <div className="icon-circle">
                  <FaFilePdf size={20} />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold">PDF Requirements for Applications</h3>
              </div>
              <ul className="space-y-2">
                {[
                  "Many Passport, Visa, and OCI portals require PDF uploads under 1 MB",
                  "Our compressor targets ≤ 1 MB output automatically",
                  "Supports uploads up to 50 MB",
                  "Uses per-page budget-aware JPEG rendering for optimal quality",
                  "Multi-page PDFs are handled with automatic per-page quality adjustment",
                  "Output format: PDF with embedded JPEG pages",
                  "100 % browser-based — your files never leave your device",
                ].map((req) => (
                  <li
                    key={req}
                    className="flex items-start gap-2 text-sm text-[var(--text-secondary)]"
                  >
                    <span className="mt-1 text-green-500 shrink-0">✓</span>
                    {req}
                  </li>
                ))}
              </ul>
              <div className="mt-4">
                <Link
                  href="/pdf-compressor"
                  className="btn-accent inline-flex items-center gap-2"
                >
                  <FaCompressArrowsAlt size={14} />
                  Open PDF Compressor
                </Link>
              </div>
            </div>
          </div>

          {/* Quick Tips */}
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-6 justify-center">
              <FaLightbulb className="text-yellow-500" size={20} />
              <h2 className="text-xl font-semibold">Quick Tips</h2>
            </div>
            <div className="grid gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {quickTips.map((tip) => (
                <div key={tip.title} className="note-card">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">{tip.icon}</span>
                    <h3 className="font-semibold text-sm">{tip.title}</h3>
                  </div>
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                    {tip.tip}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Official Guidelines links */}
          <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] p-4 sm:p-6 md:p-8 text-center shadow-sm">
            <FaFilePdf
              className="mx-auto mb-3 sm:mb-4 text-red-500"
              size={28}
            />
            <h2 className="text-lg sm:text-xl font-semibold mb-2">
              Official Guidelines
            </h2>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] mb-4 sm:mb-5 max-w-md mx-auto">
              For the most up-to-date specifications, refer to the official
              guidelines from each country.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <a
                href="https://ociservices.gov.in"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-accent"
              >
                <FaGlobeAsia size={14} />
                India — OCI Portal
              </a>
              <a
                href="https://www.gov.uk/photos-for-passports"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-accent"
              >
                <FaGlobeEurope size={14} />
                UK — GOV.UK
              </a>
              <a
                href="https://travel.state.gov/content/travel/en/passports/how-apply/photos.html"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-accent"
              >
                <FaGlobeAmericas size={14} />
                USA — State Dept
              </a>
            </div>
          </div>

          {/* Back link */}
          <div className="text-center mt-10">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-[var(--accent)] hover:underline"
            >
              <FaArrowLeft size={12} />
              Back to Home
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
