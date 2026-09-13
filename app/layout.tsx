import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { MotionObserver } from "@/components/motion-observer";
import { brandAssets } from "@/lib/brand";
import "./globals.css";

export const metadata: Metadata = {
  title: "ATC China Brasil",
  description:
    "Conectamos sua empresa diretamente às melhores fábricas do mundo, com segurança e estratégia. Importação, exportação e sourcing na China.",
  metadataBase: new URL("https://acs.atcchinabrasil.com"),
  openGraph: {
    title: "ATC China Brasil",
    description:
      "Conectamos sua empresa diretamente às melhores fábricas do mundo, com segurança e estratégia. Importação, exportação e sourcing na China.",
    url: "https://acs.atcchinabrasil.com",
    siteName: "ATC China Brasil",
    images: [brandAssets.social],
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ATC China Brasil",
    description:
      "Conectamos sua empresa diretamente às melhores fábricas do mundo, com segurança e estratégia. Importação, exportação e sourcing na China.",
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
    <html lang="pt-BR" className="bg-background">
      <body className="font-sans antialiased">
        <MotionObserver />
        {children}
        {process.env.NODE_ENV === "production" && <Analytics />}
      </body>
    </html>
  );
}
