import Features from "./components/features";

import PricingPage from "./pricing/page";
import Partners from "./components/partners";
import FAQ from "./components/faq";
import { setStaticParamsLocale } from "next-international/server";
import Hero from "./components/hero";
import HowItWorks from "./components/how-it-works";
import ProblemStatement from "./components/problem-statement";
import Qualification from "./components/qualification";
import { getStaticParams } from "@/locales/server";

export function generateStaticParams() {
  return getStaticParams();
}

export default async function LandingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setStaticParamsLocale(locale);

  return (
    <main className="flex flex-col">
      <Hero />
      <ProblemStatement />
      <HowItWorks />
      <section
        id="partners"
        className="w-full"
      >
        <Partners />
      </section>
      <section
        id="features"
        className="w-full"
      >
        <Features />
      </section>
      <Qualification />
      <section
        id="pricing"
        className="w-full"
      >
        <PricingPage />
      </section>
      <section
        id="faq"
        className="w-full"
      >
        <FAQ />
      </section>
    </main>
  );
}
