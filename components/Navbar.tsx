"use client";

import { useState } from "react";
import Link from "next/link";
import { FaCropAlt, FaBars, FaTimes, FaHome, FaFilePdf, FaConciergeBell, FaClipboardList, FaInfoCircle, FaEnvelope, FaCoffee } from "react-icons/fa";
import ThemeSwitcher from "./ThemeSwitcher";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="site-navbar">
      <div className="navbar-inner">
        <Link className="navbar-brand" href="/">
          <FaCropAlt size={20} />
          <span>Photo Cropper</span>
        </Link>

        {/* Always-visible right group: BMC + theme switcher + hamburger toggler */}
        <div className="navbar-always-visible">
          <a
            href="https://buymeacoffee.com/friendlyneighbourhoodtech"
            target="_blank"
            rel="noopener noreferrer"
            className={`bmc-navbar-btn${isOpen ? " bmc-hidden" : ""}`}
            title="Buy Me a Coffee"
          >
            <FaCoffee size={14} />
            <span className="bmc-label">Buy Me a Coffee</span>
          </a>
          <div className={`theme-topbar${isOpen ? " theme-hidden" : ""}`}>
            <ThemeSwitcher />
          </div>
          <button
            className="navbar-toggler"
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            aria-expanded={isOpen}
            aria-label="Toggle navigation"
          >
            {isOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {/* Collapsible menu — links + theme switcher only */}
        <div className={`navbar-menu${isOpen ? " open" : ""}`}>
          <div className="nav-links">
            <Link
              className="nav-link-item"
              href="/"
              onClick={() => setIsOpen(false)}
              title="Home"
            >
              <FaHome size={15} className="nav-icon" />
              <span className="nav-label">Home</span>
            </Link>
            <Link
              className="nav-link-item"
              href="/photo-cropper"
              onClick={() => setIsOpen(false)}
              title="Photo Cropper"
            >
              <FaCropAlt size={15} className="nav-icon" />
              <span className="nav-label">Photo Cropper</span>
            </Link>
            <Link
              className="nav-link-item"
              href="/pdf-compressor"
              onClick={() => setIsOpen(false)}
              title="PDF Compressor"
            >
              <FaFilePdf size={15} className="nav-icon" />
              <span className="nav-label">PDF Compressor</span>
            </Link>
            <Link
              className="nav-link-item"
              href="/services"
              onClick={() => setIsOpen(false)}
              title="Services"
            >
              <FaConciergeBell size={15} className="nav-icon" />
              <span className="nav-label">Services</span>
            </Link>
            <Link
              className="nav-link-item"
              href="/requirements"
              onClick={() => setIsOpen(false)}
              title="Requirements"
            >
              <FaClipboardList size={15} className="nav-icon" />
              <span className="nav-label">Requirements</span>
            </Link>
            <Link
              className="nav-link-item"
              href="/about"
              onClick={() => setIsOpen(false)}
              title="About"
            >
              <FaInfoCircle size={15} className="nav-icon" />
              <span className="nav-label">About</span>
            </Link>
            <Link
              className="nav-link-item"
              href="/contact"
              onClick={() => setIsOpen(false)}
              title="Contact"
            >
              <FaEnvelope size={15} className="nav-icon" />
              <span className="nav-label">Contact</span>
            </Link>
          </div>
          {/* BMC button — desktop: visible inline; mobile: full-size inside menu */}
          <a
            href="https://buymeacoffee.com/friendlyneighbourhoodtech"
            target="_blank"
            rel="noopener noreferrer"
            className="bmc-menu-btn"
            title="Buy Me a Coffee"
          >
            <FaCoffee size={14} />
            <span>Buy Me a Coffee</span>
          </a>
          <ThemeSwitcher />
          {/* Close button at bottom-right of mobile menu */}
          <button
            className="navbar-menu-close"
            type="button"
            onClick={() => setIsOpen(false)}
            aria-label="Close menu"
          >
            <FaTimes size={16} />
          </button>
        </div>
      </div>
    </nav>
  );
}
