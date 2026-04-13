import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PdfCompressor from "@/components/PdfCompressor";

export default function PdfCompressorPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <PdfCompressor />
      </main>
      <Footer />
    </>
  );
}
