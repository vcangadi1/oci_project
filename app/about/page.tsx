import {
  FaHeart,
  FaShieldAlt,
  FaMoneyBillWave,
  FaUserShield,
  FaLightbulb,
  FaArrowLeft,
  FaGlobeAmericas,
  FaHandsHelping,
  FaCoffee,
  FaQrcode,
} from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

const values = [
  {
    icon: FaMoneyBillWave,
    title: "100 % Free — No Hidden Costs",
    description:
      "No subscriptions, no paywalls, no surprise charges. Every feature on this site is completely free. I know what it feels like to pay for photos at a photobooth only to find your image doesn't meet the upload requirements.",
  },
  {
    icon: FaShieldAlt,
    title: "Private & Secure by Design",
    description:
      "Your photos and documents never leave your device. Everything is processed right in your browser — no server uploads, no cloud storage, no third-party tracking. Unlike other sites riddled with ads and data-harvesting scripts, your personal data stays yours.",
  },
  {
    icon: FaUserShield,
    title: "No Ads, No Data Grabbing",
    description:
      "Too many online tools plaster ads across the page and quietly collect your personal photos and documents. This site has zero ads, zero trackers, and zero interest in your data. It's built to help, not to profit from your information.",
  },
  {
    icon: FaGlobeAmericas,
    title: "Built for Everyone",
    description:
      "Whether you're applying for a UK Passport, EU/Schengen Visa, US Visa, Indian Passport, or OCI — this tool has you covered. One place for all the different photo sizes, aspect ratios, and file-size limits each country demands.",
  },
];

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen py-6 sm:py-8 md:py-10">
        <div className="max-w-4xl lg:max-w-5xl xl:max-w-6xl mx-auto px-4 sm:px-6">
          {/* Header */}
          <div className="text-center mb-8 sm:mb-10">
            <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-[var(--bg-muted)] border-2 border-[var(--border)] mb-4">
              <FaHeart size={28} className="text-red-500" />
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-3">
              Why I Built This
            </h1>
            <p className="text-sm sm:text-base text-[var(--text-secondary)] max-w-2xl mx-auto">
              A free, private, and frustration-free tool — born out of
              real-world passport and visa application headaches.
            </p>
          </div>

          {/* Story Section */}
          <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] p-4 sm:p-6 md:p-8 mb-10 shadow-sm">
            <div className="flex items-center gap-3 mb-5">
              <div className="icon-circle">
                <FaLightbulb size={20} />
              </div>
              <h2 className="text-xl font-semibold">The Story</h2>
            </div>
            <div className="space-y-4 text-sm text-[var(--text-secondary)] leading-relaxed">
              <p>
                If you&apos;ve ever applied for a passport or visa, you know the
                drill — every country has its own photo requirements. Different
                aspect ratios, different pixel dimensions, different file-size
                limits. One portal wants 1:1 at under 200 KB, another wants 4:5
                at under 10 MB, and yet another insists on 2 × 2 inches at
                exactly 600 px.
              </p>
              <p>
                I went through this myself. I{" "}
                <strong>paid for photos at a photobooth</strong>, only to find
                they didn&apos;t meet the online upload requirements. The
                dimensions were wrong, the file was too large, or the aspect
                ratio didn&apos;t match. So I&apos;d end up hunting for an
                online tool to resize and crop the image.
              </p>
              <p>
                To make matters worse, I also tried using{" "}
                <strong>immigration agents</strong> — only to be met with{" "}
                <strong>
                  exorbitant fees for tasks that should have been
                  straightforward
                </strong>
                . Paying a premium just to have someone resize a photo or
                compress a PDF felt unreasonable, especially when the entire
                process could be done in seconds with the right tool.
              </p>
              <p>
                And that&apos;s where the next problem started. Most &ldquo;free&rdquo;
                online photo tools are{" "}
                <strong>
                  covered in ads, riddled with pop-ups, and quietly upload your
                  personal photos to their servers
                </strong>
                . Some even require you to create an account. You&apos;re
                handing over sensitive identity documents — passport photos,
                signatures — to websites you can&apos;t fully trust.
              </p>
              <p>
                On top of that, many government portals require PDF documents to
                be under 1 MB, and the same shady online compressors were the
                only option.
              </p>
              <p>
                I thought:{" "}
                <em>
                  &ldquo;There has to be a better way. Why not build something
                  that runs entirely in the browser, handles every country&apos;s
                  requirements, and never touches your data?&rdquo;
                </em>
              </p>
              <p>
                So I built this tool — and I&apos;m sharing it as a{" "}
                <strong>free service for everyone</strong> facing the same
                frustrations. No sign-ups, no ads, no uploads, no cost. Just a
                tool that works.
              </p>
            </div>
          </div>

          {/* Values Cards */}
          <h2 className="text-xl sm:text-2xl font-bold mb-6 text-center flex items-center justify-center gap-2">
            <FaHandsHelping className="text-[var(--accent)]" />
            What This Project Stands For
          </h2>
          <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 mb-12">
            {values.map((item) => (
              <div key={item.title} className="requirement-card group">
                <div className="icon-circle mb-4 mx-auto">
                  <item.icon size={22} />
                </div>
                <h3 className="text-base sm:text-lg font-semibold mb-2 text-center">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-[var(--text-secondary)] text-center leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] p-4 sm:p-6 md:p-8 text-center shadow-sm">
            <FaHeart
              className="mx-auto mb-3 sm:mb-4 text-red-500"
              size={28}
            />
            <h2 className="text-lg sm:text-xl font-semibold mb-2">
              Start Using It — It&apos;s Free
            </h2>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] mb-4 sm:mb-5 max-w-md mx-auto">
              Crop your passport photos, compress your PDFs, and get on with
              your application — without worrying about your privacy or your
              wallet.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/photo-cropper" className="btn-accent">
                Crop a Photo
              </Link>
              <Link href="/pdf-compressor" className="btn-accent">
                Compress a PDF
              </Link>
            </div>
          </div>

          {/* Support / Buy Me a Coffee */}
          <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] p-4 sm:p-6 md:p-8 text-center shadow-sm mt-10">
            <FaCoffee className="mx-auto mb-3 sm:mb-4 text-amber-500" size={28} />
            <h2 className="text-lg sm:text-xl font-semibold mb-2">
              Support This Project
            </h2>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] mb-4 sm:mb-5 max-w-lg mx-auto">
              This tool is — and will always be — completely free. If it
              saved you time, money, or a trip to the photobooth, consider
              buying me a coffee. Every little bit helps keep this project
              running and motivates future improvements.
            </p>
            <a
              href="https://buymeacoffee.com/friendlyneighbourhoodtech"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-accent inline-flex items-center gap-2"
            >
              <FaCoffee size={16} />
              Buy Me a Coffee
            </a>
            <div className="mt-6 flex flex-col items-center gap-2">
              <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
                <FaQrcode size={12} />
                <span>Or scan the QR code</span>
              </div>
              <Image
                src="/images/qr-code.png"
                alt="Buy Me a Coffee QR Code"
                width={160}
                height={160}
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
