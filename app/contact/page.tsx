"use client";

import { useState, useRef, FormEvent } from "react";
import emailjs from "@emailjs/browser";
import {
  FaEnvelope,
  FaUser,
  FaPaperPlane,
  FaCheckCircle,
  FaExclamationCircle,
  FaArrowLeft,
  FaCoffee,
  FaSpinner,
  FaQrcode,
} from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

// ── EmailJS credentials ─────────────────────────────────────
// Set these in .env.local:
//   NEXT_PUBLIC_EMAILJS_SERVICE_ID=service_XXXXXXX
//   NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=template_XXXXXXX
//   NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=XXXXXXXXXXXXXX
const SERVICE_ID  = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID  ?? "";
const TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID ?? "";
const PUBLIC_KEY  = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY  ?? "";

export default function ContactPage() {
  const formRef = useRef<HTMLFormElement>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const CONTACT_EMAIL = "YourFriendlyNeighbourhoodTech@gmail.com";

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    if (!name.trim() || !email.trim() || !message.trim()) {
      setError("Please fill in all required fields.");
      return;
    }

    // Check EmailJS is configured
    if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
      setError(
        "Contact form is not configured yet. Please email me directly."
      );
      return;
    }

    setSending(true);

    try {
      await emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, formRef.current!, {
        publicKey: PUBLIC_KEY,
      });
      setSent(true);
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Something went wrong.";
      setError(`Failed to send: ${msg}. Please try emailing me directly.`);
    } finally {
      setSending(false);
    }
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen py-6 sm:py-8 md:py-10">
        <div className="max-w-3xl lg:max-w-4xl mx-auto px-4 sm:px-6">
          {/* Header */}
          <div className="text-center mb-8 sm:mb-10">
            <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-[var(--bg-muted)] border-2 border-[var(--border)] mb-4">
              <FaEnvelope size={28} className="text-[var(--accent)]" />
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-3">
              Get in Touch
            </h1>
            <p className="text-sm sm:text-base text-[var(--text-secondary)] max-w-xl mx-auto">
              Have a question, suggestion, or found a bug? I&apos;d love to hear
              from you. Fill out the form below and your message will be sent
              directly to me.
            </p>
          </div>

          {sent ? (
            /* Success State */
            <div className="rounded-2xl border border-green-500/30 bg-green-500/5 p-6 sm:p-8 md:p-12 text-center shadow-sm">
              <FaCheckCircle className="mx-auto mb-4 text-green-500" size={48} />
              <h2 className="text-xl sm:text-2xl font-semibold mb-3">
                Message Sent Successfully!
              </h2>
              <p className="text-sm text-[var(--text-secondary)] mb-6 max-w-md mx-auto">
                Thank you for reaching out. I&apos;ll get back to you as soon as
                I can.
              </p>
              <button
                onClick={() => setSent(false)}
                className="btn-accent"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            /* Contact Form */
            <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] p-4 sm:p-6 md:p-8 shadow-sm">
              <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
                {/* Name */}
                <div>
                  <label
                    htmlFor="contact-name"
                    className="block text-sm font-medium mb-1.5"
                  >
                    <FaUser className="inline mr-1.5 text-[var(--text-muted)]" size={12} />
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="contact-name"
                    name="from_name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    className="contact-input"
                    required
                  />
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="contact-email"
                    className="block text-sm font-medium mb-1.5"
                  >
                    <FaEnvelope className="inline mr-1.5 text-[var(--text-muted)]" size={12} />
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="contact-email"
                    name="from_email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="contact-input"
                    required
                  />
                </div>

                {/* Subject */}
                <div>
                  <label
                    htmlFor="contact-subject"
                    className="block text-sm font-medium mb-1.5"
                  >
                    Subject <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="contact-subject"
                    name="subject"
                    type="text"
                    required
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="What is this about?"
                    className="contact-input"
                  />
                </div>

                {/* Message */}
                <div>
                  <label
                    htmlFor="contact-message"
                    className="block text-sm font-medium mb-1.5"
                  >
                    Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your message here..."
                    rows={6}
                    className="contact-input resize-y"
                    required
                  />
                </div>

                {/* Error */}
                {error && (
                  <div className="flex items-center gap-2 text-sm text-red-500">
                    <FaExclamationCircle size={14} />
                    <span>{error}</span>
                  </div>
                )}

                {/* Submit */}
                <div className="flex justify-center">
                <button
                  type="submit"
                  disabled={sending}
                  className="btn-accent w-full sm:w-auto inline-flex items-center justify-center gap-2"
                >
                  {sending ? (
                    <>
                      <FaSpinner size={14} className="animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <FaPaperPlane size={14} />
                      Send Message
                    </>
                  )}
                </button>
                </div>
              </form>

              {/* Direct email fallback */}
              <div className="mt-6 pt-5 border-t border-[var(--border)] text-center">
                <p className="text-xs text-[var(--text-muted)] mb-1">
                  Prefer to email directly?
                </p>
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="text-sm text-[var(--accent)] hover:underline inline-flex items-center gap-1.5"
                >
                  <FaEnvelope size={12} />
                  {CONTACT_EMAIL}
                </a>
                <p className="text-xs text-[var(--text-muted)] mt-3 italic">
                  Please don&apos;t send any documents — your documents are
                  precious to you. Keep them safe.
                </p>
              </div>
            </div>
          )}

          {/* Support CTA */}
          <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] p-4 sm:p-6 md:p-8 text-center shadow-sm mt-10">
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] mb-3">
              If this tool saved you time or money, consider supporting its
              development:
            </p>
            <a
              href="https://buymeacoffee.com/friendlyneighbourhoodtech"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm px-4 py-2 rounded-full border border-amber-500/40 bg-amber-500/10 text-amber-600 hover:bg-amber-500/20 transition-colors"
            >
              <FaCoffee size={14} />
              Buy Me a Coffee
            </a>
            <div className="mt-4 flex flex-col items-center gap-2">
              <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
                <FaQrcode size={12} />
                <span>Or scan the QR code</span>
              </div>
              <Image
                src="/images/qr-code.png"
                alt="Buy Me a Coffee QR Code"
                width={140}
                height={140}
                className="rounded-lg border border-[var(--border)] shadow-sm"
              />
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
