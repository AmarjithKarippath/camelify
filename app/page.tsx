import type { Metadata } from "next";
import { TalleyLanding } from "@/components/talley/TalleyLanding";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.talley.app";

export const metadata: Metadata = {
  title: "Talley — All your business on one platform",
  description:
    "Simple, efficient business management for Indian SMBs. Accounting, inventory, GST, invoicing, and more — all in one affordable platform.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "Talley",
    title: "Talley — All your business on one platform",
    description:
      "Accounting, inventory, GST, and invoicing in one platform. Built for Indian small businesses.",
    images: [{ url: "/og-image.png", width: 1024, height: 540, alt: "Talley" }],
  },
};

export default function HomePage() {
  return <TalleyLanding />;
}
