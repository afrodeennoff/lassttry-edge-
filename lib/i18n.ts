import { headers } from "next/headers";

export type Lang = "en" | "fr";

export async function detectLang(): Promise<Lang> {
  const h = await headers();
  const value = h.get("accept-language")?.toLowerCase() ?? "en";
  return value.startsWith("fr") ? "fr" : "en";
}

const copy = {
  en: {
    nav: {
      product: "Product",
      auth: "Auth",
      onboarding: "Onboarding",
      dashboard: "Dashboard",
      admin: "Admin"
    },
    heroTitle: "AI Trading Journal Built For Teams",
    heroSubtitle: "Security-first journaling, analytics, imports, AI, and Whop billing in one launch-ready platform.",
    ctaPrimary: "Open Dashboard",
    ctaSecondary: "Start Onboarding"
  },
  fr: {
    nav: {
      product: "Produit",
      auth: "Auth",
      onboarding: "Integration",
      dashboard: "Tableau de bord",
      admin: "Admin"
    },
    heroTitle: "Journal de Trading IA pour les equipes",
    heroSubtitle: "Journalisation securisee, analyses, imports, IA et facturation Whop dans une seule plateforme prete au lancement.",
    ctaPrimary: "Ouvrir le tableau",
    ctaSecondary: "Commencer l'integration"
  }
} as const;

export async function getCopy() {
  const lang = await detectLang();
  return { lang, t: copy[lang] };
}
