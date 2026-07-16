import type { Metadata, Viewport } from "next";
import { Manrope } from "next/font/google";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";
import { caveat } from "@/lib/fonts";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.camelify.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Talley — All your business on one platform",
    template: "%s · Talley",
  },
  description:
    "Simple, efficient business management for Indian SMBs. Accounting, inventory, GST, invoicing, and more in one affordable platform.",
  applicationName: "Talley",
  keywords: [
    "business management software",
    "accounting software India",
    "GST software",
    "inventory management",
    "Tally alternative",
    "ERP for SMB",
    "Talley",
  ],
  authors: [{ name: "Talley" }],
  creator: "Talley",
  publisher: "Talley",
  category: "technology",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "Talley",
    title: "Talley — All your business on one platform",
    description:
      "Accounting, inventory, GST, and invoicing in one platform. Built for Indian small businesses.",
    locale: "en_US",
    images: [
      {
        url: "/og-image.png",
        width: 1024,
        height: 540,
        alt: "Talley — Business management platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Talley — All your business on one platform",
    description:
      "Accounting, inventory, GST, and invoicing in one platform for Indian SMBs.",
    images: ["/og-image.png"],
    creator: "@camelify",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#714B67",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${manrope.variable} ${caveat.variable}`}>
      <body className="font-sans bg-surface text-ink-body">
        <GoogleAnalytics />
        {children}
      </body>
    </html>
  );
}
