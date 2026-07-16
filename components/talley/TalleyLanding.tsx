"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { TalleyHeader } from "./TalleyHeader";
import { TalleyHero } from "./TalleyHero";
import { TalleyAppGrid } from "./TalleyAppGrid";
import { TalleyImagine, TalleyFeatures } from "./TalleyFeatures";
import { TalleyPricing } from "./TalleyPricing";
import { TalleyTestimonials } from "./TalleyTestimonials";
import { TalleyCTA, TalleyFooter } from "./TalleyCTA";
import { WaitlistProvider, WaitlistAutoOpen } from "./WaitlistContext";

function WaitlistQueryTriggerInner() {
  const params = useSearchParams();
  return <WaitlistAutoOpen trigger={params.get("try") === "1"} />;
}

function WaitlistQueryTrigger() {
  return (
    <Suspense fallback={null}>
      <WaitlistQueryTriggerInner />
    </Suspense>
  );
}

export function TalleyLanding() {
  return (
    <WaitlistProvider>
      <WaitlistQueryTrigger />
      <TalleyHeader />
      <main>
        <TalleyHero />
        <TalleyAppGrid />
        <TalleyImagine />
        <TalleyFeatures />
        <TalleyPricing />
        <TalleyTestimonials />
        <TalleyCTA />
      </main>
      <TalleyFooter />
    </WaitlistProvider>
  );
}
