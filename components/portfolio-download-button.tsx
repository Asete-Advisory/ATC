"use client";

import { useState } from "react";
import { Download, Loader2 } from "lucide-react";

type PortfolioDownloadButtonProps = {
  label: string;
  loadingLabel: string;
  fileName: string;
};

const PDF_WIDTH = 297;
const PDF_HEIGHT = 210;

export function PortfolioDownloadButton({
  label,
  loadingLabel,
  fileName,
}: PortfolioDownloadButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  async function downloadPdf() {
    if (isGenerating) {
      return;
    }

    const slides = Array.from(
      document.querySelectorAll<HTMLElement>("[data-portfolio-slide]"),
    );

    if (slides.length === 0) {
      return;
    }

    setIsGenerating(true);

    try {
      const [{ toPng }, { PDFDocument }] = await Promise.all([
        import("html-to-image"),
        import("pdf-lib"),
      ]);

      await document.fonts.ready;

      const pdf = await PDFDocument.create();

      for (const slide of slides) {
        const image = await toPng(slide, {
          cacheBust: true,
          pixelRatio: 3,
          backgroundColor: getComputedStyle(slide).backgroundColor,
          width: slide.offsetWidth,
          height: slide.offsetHeight,
          style: {
            borderRadius: "0",
            boxShadow: "none",
          },
        });

        const png = await pdf.embedPng(image);
        const page = pdf.addPage([PDF_WIDTH, PDF_HEIGHT]);

        page.drawImage(png, {
          x: 0,
          y: 0,
          width: PDF_WIDTH,
          height: PDF_HEIGHT,
        });
      }

      const pdfBytes = await pdf.save();
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = fileName;
      link.click();
      URL.revokeObjectURL(url);
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <button
      type="button"
      onClick={downloadPdf}
      disabled={isGenerating}
      className="inline-flex h-10 items-center gap-2 rounded-full bg-[#2f6fd6] px-5 text-sm font-semibold text-white shadow-[0_18px_36px_-24px_rgba(47,111,214,0.9)] transition-colors hover:bg-[#3b7deb] disabled:cursor-wait disabled:bg-[#2f6fd6]/70 print:hidden"
    >
      {isGenerating ? (
        <Loader2 className="size-4 animate-spin" aria-hidden />
      ) : (
        <Download className="size-4" aria-hidden />
      )}
      {isGenerating ? loadingLabel : label}
    </button>
  );
}
