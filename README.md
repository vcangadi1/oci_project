# Passport Photo Cropper & PDF Compressor

A modern **Next.js** web application for resizing and cropping passport photos and compressing PDFs — supporting **UK, EU/Schengen, USA, Indian Passport/Visa, and OCI** applications. 100 % browser-based, free, private, and ad-free.

## ✨ Features

### � Passport Photo Cropper
- **Multi-Country Presets** — UK (4:5), EU/Schengen (413:531), USA (1:1), India (1:1), OCI Signature (3:1)
- **Smart Crop Controls** — Drag, resize, zoom, ±1° and 45° rotation, horizontal & vertical flip
- **Live Dimensions** — Real-time readouts for X, Y, Width, Height, and Rotation
- **Per-Preset Constraints** — Automatic min/max dimension and file-size enforcement
- **JPEG Export** — Automatic JPEG conversion with correct file-size limits

### 📄 PDF Compressor
- **Budget-Aware Compression** — Targets ≤ 1 MB output automatically
- **Per-Page Quality Optimisation** — Smart byte-budget allocation across pages
- **Large File Support** — Handles PDFs up to 50 MB
- **100 % Client-Side** — Uses pdf-lib and pdf.js; files never leave your device

### 🌐 Additional Pages
- **Home** — Tool overview with magic-border cards and trust badges
- **Services** — Detailed breakdown of all features
- **Requirements** — Country-specific photo, signature, and PDF specifications
- **About** — Project story, values, and Buy Me a Coffee support
- **Contact** — EmailJS-powered contact form with direct email fallback

## 🛠️ Tech Stack

- **Next.js 16** — React framework with App Router & Turbopack
- **React 19** — Latest React with TypeScript (strict mode)
- **Tailwind CSS v4** — Utility-first styling
- **Cropper.js** — Image cropping via `react-cropper`
- **pdf-lib** — PDF creation and manipulation
- **pdf.js** — PDF rendering (CDN)
- **@emailjs/browser** — Contact form email delivery
- **React Icons** — Icon library

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) v18 or later

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build
```bash
npx next build
npx next start -p 3000
```

### Environment Variables

Create a `.env.local` file with:

```env
NEXT_PUBLIC_EMAILJS_SERVICE_ID=service_XXXXXXX
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=template_XXXXXXX
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=XXXXXXXXXXXXXX
```

## 📁 Project Structure
```
oci_project/
├── app/
│   ├── layout.tsx              # Root layout with theme provider
│   ├── page.tsx                # Home page
│   ├── globals.css             # Theme styles & component CSS
│   ├── icon.svg                # Favicon (crop-tool icon)
│   ├── photo-cropper/
│   │   └── page.tsx            # Photo cropper page
│   ├── pdf-compressor/
│   │   └── page.tsx            # PDF compressor page
│   ├── services/
│   │   └── page.tsx            # Services page
│   ├── requirements/
│   │   └── page.tsx            # Requirements page
│   ├── about/
│   │   └── page.tsx            # About page
│   ├── contact/
│   │   └── page.tsx            # Contact page (EmailJS)
│   └── api/
│       └── sample-image/
│           └── route.ts        # Sample image API
├── components/
│   ├── Navbar.tsx              # Navigation bar with icons
│   ├── Footer.tsx              # Footer with links & disclaimer
│   ├── HeroBanner.tsx          # Hero banner component
│   ├── ImageCropper.tsx        # Main photo cropper component
│   ├── PdfCompressor.tsx       # PDF compressor component
│   └── ThemeSwitcher.tsx       # Light/Dark/System theme toggle
├── public/
│   └── images/
│       └── qr-code.png         # Buy Me a Coffee QR code
├── package.json
└── README.md
```

## 📋 Supported Photo Specifications

| Country          | Aspect Ratio | Dimensions         | Max File Size |
| ---------------- | ------------ | ------------------ | ------------- |
| UK               | 4:5          | ≥ 600 × 750 px     | 10 MB         |
| EU / Schengen    | 413:531      | 300 DPI recommended | —             |
| USA              | 1:1          | 600–1200 px         | 240 KB        |
| India (Photo)    | 1:1          | 200–900 px          | 200 KB        |
| India (Signature)| 3:1          | 200–3500 px         | 1 MB          |

## ☕ Support

If this tool saved you time or money, consider [buying me a coffee](https://buymeacoffee.com/friendlyneighbourhoodtech).

## ⚠️ Disclaimer

This is a free helping tool and does not constitute immigration, legal, or professional advice. Always refer to official government websites for the most up-to-date application requirements.
