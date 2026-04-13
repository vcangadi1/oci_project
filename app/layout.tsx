import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeSwitcher";

export const metadata: Metadata = {
  title: "Passport Photo Cropper & PDF Compressor | Free Online Tool",
  description:
    "Free online tool to resize and crop passport photos and signatures for UK, EU/Schengen, USA, Indian Passport, Visa, and OCI applications. Also compress PDFs to under 1 MB.",
  icons: {
    icon: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
