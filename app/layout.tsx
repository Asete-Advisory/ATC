import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { MotionObserver } from "@/components/motion-observer";
import "./globals.css";

export const metadata: Metadata = {
  title: "ATC China Brasil",
  description:
    "Conectamos sua empresa diretamente às melhores fábricas do mundo, com segurança e estratégia. Importação, exportação e sourcing na China.",
  metadataBase: new URL("https://atcchinabrasil.com"),
  openGraph: {
    title: "ATC China Brasil",
    description:
      "Conectamos sua empresa diretamente às melhores fábricas do mundo, com segurança e estratégia. Importação, exportação e sourcing na China.",
    url: "https://atcchinabrasil.com",
    siteName: "ATC China Brasil",
    images: [
      {
        url: "/global/atc-dark.png",
        width: 1205,
        height: 1205,
        alt: "ATC China Brasil",
      },
    ],
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ATC China Brasil",
    description:
      "Conectamos sua empresa diretamente às melhores fábricas do mundo, com segurança e estratégia. Importação, exportação e sourcing na China.",
    images: ["/global/atc-dark.png"],
  },
  icons: {
    icon: [
      {
        url: "/global/atc-dark.png",
        media: "(prefers-color-scheme: light)",
        type: "image/png",
      },
      {
        url: "/global/atc-light.png",
        media: "(prefers-color-scheme: dark)",
        type: "image/png",
      },
      {
        url: "/global/atc-light.png",
        type: "image/png",
      },
    ],
    apple: "/global/atc-light.png",
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
