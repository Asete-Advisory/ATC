import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { MotionObserver } from "@/components/motion-observer";
import { brandAssets } from "@/lib/brand";
import "./globals.css";

export const metadata: Metadata = {
  title: "ATC China Brasil",
  description:
    "We connect your company directly with leading factories worldwide. Import, export and sourcing solutions with local expertise in China.",
  metadataBase: new URL("https://acs.atcchinabrasil.com"),
  openGraph: {
    title: "ATC China Brasil",
    description:
      "We connect your company directly with leading factories worldwide. Import, export and sourcing solutions with local expertise in China.",
    url: "https://acs.atcchinabrasil.com",
    siteName: "ATC China Brasil",
    images: [brandAssets.social],
    locale: "en_US",
    alternateLocale: ["zh_CN", "pt_BR"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ATC China Brasil",
    description:
      "We connect your company directly with leading factories worldwide. Import, export and sourcing solutions with local expertise in China.",
    images: [brandAssets.social.url],
  },
  icons: {
    icon: [
      {
        url: brandAssets.icons.black,
        type: "image/png",
      },
      {
        url: brandAssets.icons.black,
        media: "(prefers-color-scheme: light)",
        type: "image/png",
      },
      {
        url: brandAssets.icons.white,
        media: "(prefers-color-scheme: dark)",
        type: "image/png",
      },
    ],
    apple: brandAssets.icons.apple,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-US" className="bg-background">
      <body className="font-sans antialiased">
        <MotionObserver />
        {children}
        {process.env.NODE_ENV === "production" && <Analytics />}
      </body>
    </html>
  );
}
