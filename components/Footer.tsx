"use client";

import Link from "next/link";
import { FaHeart, FaExclamationCircle, FaCoffee } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="footer-section py-6 sm:py-8 mt-8 sm:mt-10">
      <div className="max-w-5xl lg:max-w-6xl xl:max-w-7xl mx-auto px-4 sm:px-6 text-center">
        <p className="mb-2 text-sm sm:text-base">
          Made with <FaHeart className="inline text-red-500 mx-1" /> for hassle-free
          passport photos &amp; PDF compression
        </p>
        <div className="flex flex-wrap justify-center gap-3 sm:gap-6 mb-3">
          <Link href="/photo-cropper" className="footer-link text-xs sm:text-sm">
            Photo Cropper
          </Link>
          <Link href="/pdf-compressor" className="footer-link text-xs sm:text-sm">
            PDF Compressor
          </Link>
          <Link href="/services" className="footer-link text-xs sm:text-sm">
            Services
          </Link>
          <Link href="/requirements" className="footer-link text-xs sm:text-sm">
            Requirements
          </Link>
          <Link href="/about" className="footer-link text-xs sm:text-sm">
            About
          </Link>
          <Link href="/contact" className="footer-link text-xs sm:text-sm">
            Contact
          </Link>
        </div>

        {/* Buy Me a Coffee */}
        <div className="mb-4">
          <a
            href="https://buymeacoffee.com/friendlyneighbourhoodtech"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm px-4 py-2 rounded-full border border-amber-500/40 bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20 transition-colors"
          >
            <FaCoffee size={14} />
            Buy Me a Coffee
          </a>
        </div>

        {/* Disclaimer */}
        <div className="max-w-2xl mx-auto mt-4 mb-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg border border-[var(--border-color)] bg-[var(--bg-muted)] text-[10px] sm:text-xs text-[var(--text-secondary)] leading-relaxed">
          <FaExclamationCircle className="inline text-amber-500 mr-1.5 relative -top-px" size={12} />
          <strong>Disclaimer:</strong> This is a free helping tool and does not
          constitute immigration, legal, or professional advice of any kind. The
          creator is not an expert in immigration matters. Always refer to
          official government guidelines for your application requirements.
        </div>

        <p className="text-xs sm:text-sm opacity-70">
          &copy; {new Date().getFullYear()} Passport Photo Cropper &amp; PDF
          Compressor. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
