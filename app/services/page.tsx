import {
  FaCropAlt,
  FaMagic,
  FaClock,
  FaGlobeAmericas,
  FaGlobeEurope,
  FaEnvelope,
  FaArrowLeft,
  FaCompressArrowsAlt,
  FaGlobeAsia,
} from "react-icons/fa";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

const services = [
  {
    icon: FaGlobeEurope,
    title: "UK Passport Photo",
    description:
      "Resize to the 4:5 aspect ratio (35 × 45 mm). Minimum 600 × 750 px, 50 KB – 10 MB file size. Must have a plain light-grey or cream background with no shadows. Neutral expression, no glasses.",
  },
  {
    icon: FaGlobeEurope,
    title: "EU / Schengen Passport Photo",
    description:
      "Crop to the 413:531 aspect ratio (35 × 45 mm) following ICAO 9303 standards. Light, uniform background with the face occupying 70–80 % of the frame. 300 DPI recommended.",
  },
  {
    icon: FaGlobeAmericas,
    title: "USA Passport Photo",
    description:
      "Crop to 1:1 (2 × 2 inches / 51 × 51 mm). 600–1200 px, maximum 240 KB. White or off-white background required. Photo taken within last 6 months, no eyeglasses.",
  },
  {
    icon: FaGlobeAsia,
    title: "India — Passport, Visa & OCI",
    description:
      "Crop your photo to the 1:1 aspect ratio (200–900 px, 10 KB – 200 KB) required for Indian Passport, Visa, and OCI applications. Also supports the 3:1 OCI Signature crop (200–3500 px, 10 KB – 1 MB). Exported as JPEG with white background.",
  },
  {
    icon: FaMagic,
    title: "Smart Crop Controls",
    description:
      "Fine-tune your crop with ±1° and 45° rotation, horizontal & vertical flip, zoom controls, and live dimension readouts (X, Y, Width, Height, Rotation). Switch between country presets instantly.",
  },
  {
    icon: FaClock,
    title: "100 % Browser-Based & Private",
    description:
      "Everything runs entirely in your browser — no uploads to any server. Your images and PDFs are processed instantly and never leave your device. No account or sign-up required.",
  },
  {
    icon: FaCompressArrowsAlt,
    title: "PDF Compressor",
    description:
      "Compress PDF documents to under 1 MB — ideal for Passport, Visa, and OCI application uploads. Uses per-page budget-aware JPEG rendering with automatic quality optimisation. Supports files up to 50 MB.",
  },
];

export default function ServicesPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen py-6 sm:py-8 md:py-10">
        <div className="max-w-5xl lg:max-w-6xl xl:max-w-7xl mx-auto px-4 sm:px-6">
          {/* Header */}
          <div className="text-center mb-8 sm:mb-10">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-3">
              Services
            </h1>
            <p className="text-sm sm:text-base text-[var(--text-secondary)] max-w-2xl mx-auto">
              Fast, free, and privacy-first passport photo cropping and PDF
              compression for UK, EU / Schengen, USA, Indian Passport, Visa,
              and OCI applications — all in your browser, no sign-up needed.
            </p>
          </div>

          {/* Service Cards */}
          <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-12">
            {services.map((service) => (
              <div key={service.title} className="requirement-card group">
                <div className="icon-circle mb-4 mx-auto">
                  <service.icon size={22} />
                </div>
                <h3 className="text-base sm:text-lg font-semibold mb-2 text-center">
                  {service.title}
                </h3>
                <p className="text-xs sm:text-sm text-[var(--text-secondary)] text-center leading-relaxed">
                  {service.description}
                </p>
              </div>
            ))}
          </div>

          {/* Email CTA */}
          <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] p-4 sm:p-6 md:p-8 text-center shadow-sm">
            <FaEnvelope
              className="mx-auto mb-3 sm:mb-4 text-[var(--accent)]"
              size={28}
            />
            <h2 className="text-lg sm:text-xl font-semibold mb-2">Need Help?</h2>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] mb-4 sm:mb-5 max-w-md mx-auto">
              If you face any issues or need a professionally processed photo or
              signature, reach out to me.
            </p>
            <Link
              href="/contact"
              className="btn-accent"
            >
              <FaEnvelope size={14} />
              Contact Me
            </Link>
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
