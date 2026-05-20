"use client";

import { Download } from "lucide-react";

type PortfolioDownloadButtonProps = {
  label: string;
};

export function PortfolioDownloadButton({ label }: PortfolioDownloadButtonProps) {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="inline-flex h-10 items-center gap-2 rounded-full bg-[#2f6fd6] px-5 text-sm font-semibold text-white shadow-[0_18px_36px_-24px_rgba(47,111,214,0.9)] transition-colors hover:bg-[#3b7deb] print:hidden"
    >
      <Download className="size-4" aria-hidden />
      {label}
    </button>
  );
}
