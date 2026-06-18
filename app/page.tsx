import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Platforms } from "@/components/Platforms";
import { Comparison } from "@/components/Comparison";
import { HowItWorks } from "@/components/HowItWorks";
import { Features } from "@/components/Features";
import { Promise as PromiseSection } from "@/components/Promise";
import { FAQ, faqStructuredData } from "@/components/FAQ";
import { CTA } from "@/components/CTA";
import { Footer } from "@/components/Footer";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.camelify.com";

const organizationLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Camelify",
  url: siteUrl,
  logo: `${siteUrl}/logo.png`,
  sameAs: ["https://twitter.com/camelify", "https://www.instagram.com/camelify"],
};

const websiteLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Camelify",
  url: siteUrl,
  potentialAction: {
    "@type": "SearchAction",
    target: `${siteUrl}/{username}`,
    "query-input": "required name=username",
  },
};

const softwareLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Camelify",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  description:
    "Camelify is the creator-first link-in-bio platform. Custom domain on every plan, free analytics, 24-hour appeal SLA, and fair pricing.",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }}
      />

      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-input focus:bg-primary focus:px-4 focus:py-2 focus:font-semibold focus:text-white"
      >
        Skip to content
      </a>

      <Header />
      <main id="main">
        <Hero />
        <Platforms />
        <Comparison />
        <Features />
        <HowItWorks />
        <PromiseSection />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
