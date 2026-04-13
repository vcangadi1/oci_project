import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroBanner from "@/components/HeroBanner";
import {
  FaCropAlt,
  FaCompressArrowsAlt,
  FaArrowRight,
  FaShieldAlt,
  FaGlobeAmericas,
} from "react-icons/fa";

export default function Home() {
  return (
    <>
      <Navbar />

      {/* Hero */}
      <HeroBanner>
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 tracking-tight">
          Passport Photo Cropper &amp; PDF Compressor
        </h1>
        <p className="hero-subtitle text-sm sm:text-base md:text-lg">
          Free, private, browser-based tools for your Passport, Visa &amp; OCI
          applications — no sign-up, no ads, no uploads.
        </p>
      </HeroBanner>

      <main>
        {/* Tool Cards — contrasting background section */}
        <section className="home-tools-section">
          <div className="max-w-5xl lg:max-w-6xl xl:max-w-7xl mx-auto px-4 sm:px-6">
            <div className="grid gap-4 sm:gap-6 sm:grid-cols-2">
          {/* Photo Cropper Card */}
          <Link href="/photo-cropper" className="group no-underline">
            <div className="magic-card h-full flex flex-col">
              <div className="icon-circle mb-5 mx-auto w-16 h-16">
                <FaCropAlt size={28} />
              </div>
              <h2 className="text-lg sm:text-xl font-bold mb-3 text-center">
                Passport Photo Cropper
              </h2>
              <p className="text-xs sm:text-sm text-[var(--text-secondary)] text-center leading-relaxed mb-5">
                Crop and resize your photos to the exact specifications
                required for UK, EU/Schengen, USA, Indian Passport, Visa &amp;
                OCI application portals. Supports multiple aspect ratios,
                rotation, flip, and automatic JPEG export.
              </p>
              <div className="flex flex-wrap justify-center gap-2 mb-5">
                <span className="badge badge-purple">UK</span>
                <span className="badge badge-sky">EU</span>
                <span className="badge badge-blue">USA</span>
                <span className="badge badge-orange">India</span>
                <span className="badge badge-amber">OCI</span>
              </div>
              <div className="text-center mt-auto">
                <span className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--accent)] group-hover:gap-3 transition-all">
                  Open Photo Cropper
                  <FaArrowRight size={12} />
                </span>
              </div>
            </div>
          </Link>

          {/* PDF Compressor Card */}
          <Link href="/pdf-compressor" className="group no-underline">
            <div className="magic-card h-full flex flex-col">
              <div className="icon-circle mb-5 mx-auto w-16 h-16">
                <FaCompressArrowsAlt size={28} />
              </div>
              <h2 className="text-lg sm:text-xl font-bold mb-3 text-center">
                PDF Compressor
              </h2>
              <p className="text-xs sm:text-sm text-[var(--text-secondary)] text-center leading-relaxed mb-5">
                Compress PDF documents to under 1 MB — perfect for Passport, Visa,
                and OCI application uploads. Uses smart per-page
                budget-aware compression to guarantee the smallest file size
                while maintaining readability.
              </p>
              <div className="flex flex-wrap justify-center gap-2 mb-5">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-green-500/10 text-green-600 dark:text-green-400">
                  Target ≤ 1 MB
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400">
                  Up to 50 MB input
                </span>
              </div>
              <div className="text-center mt-auto">
                <span className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--accent)] group-hover:gap-3 transition-all">
                  Open PDF Compressor
                  <FaArrowRight size={12} />
                </span>
              </div>
            </div>
          </Link>
        </div>
          </div>
        </section>

        {/* Trust Badges */}
        <div className="max-w-5xl lg:max-w-6xl xl:max-w-7xl mx-auto px-4 sm:px-6 pb-10">
          <div className="grid gap-4 sm:grid-cols-3 mb-10">
          <div className="text-center p-3 sm:p-4">
            <FaShieldAlt className="mx-auto mb-2 text-[var(--accent)]" size={24} />
            <h3 className="font-semibold text-xs sm:text-sm mb-1">100 % Private</h3>
            <p className="text-[10px] sm:text-xs text-[var(--text-secondary)]">
              Everything runs in your browser. Your files never leave your
              device.
            </p>
          </div>
          <div className="text-center p-3 sm:p-4">
            <FaGlobeAmericas className="mx-auto mb-2 text-[var(--accent)]" size={24} />
            <h3 className="font-semibold text-xs sm:text-sm mb-1">Multi-Country Support</h3>
            <p className="text-[10px] sm:text-xs text-[var(--text-secondary)]">
              UK, EU, USA, India, and OCI presets built in — one tool for
              all applications.
            </p>
          </div>
          <div className="text-center p-3 sm:p-4">
            <FaCropAlt className="mx-auto mb-2 text-[var(--accent)]" size={24} />
            <h3 className="font-semibold text-xs sm:text-sm mb-1">Completely Free</h3>
            <p className="text-[10px] sm:text-xs text-[var(--text-secondary)]">
              No sign-up, no ads, no hidden charges. Built as a free service
              for everyone.
            </p>
          </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
