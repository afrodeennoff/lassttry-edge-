import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Script from "next/script";
import { connection } from "next/server";
import { ScrollLockFix } from "@/components/scroll-lock-fix";

const inter = Inter({ subsets: ["latin"] });

type Props = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({
  searchParams,
}: Props): Promise<Metadata> {
  const params = searchParams ? await searchParams : undefined;
  const ref = (params?.ref as string) ?? "";

  // Build the dynamic image URL (works locally & in production)
  const base = process.env.NEXT_PUBLIC_BASE_URL ?? "https://qunt-edge.vercel.app";
  const ogUrl = `${base}/api/og${ref ? `?ref=${encodeURIComponent(ref)}` : ""}`;

  return {
    title: "Qunt Edge",
    description: "Next generation trading dashboard",
    metadataBase: new URL("https://qunt-edge.vercel.app"),
    alternates: {
      canonical: "https://qunt-edge.vercel.app",
      languages: {
        "en-US": "https://qunt-edge.vercel.app",
        "fr-FR": "https://qunt-edge.vercel.app/fr",
      },
    },
    // ---------- OPEN GRAPH ----------
    openGraph: {
      title: "Qunt Edge",
      description:
        "Qunt Edge is a next generation trading dashboard that provides real-time insights and analytics for traders.",
      images: [
        {
          url: ref ? ogUrl : "/opengraph-image.png", // dynamic when ref exists
          width: 1200,
          height: 630,
          alt: "Qunt Edge Open Graph Image",
        },
      ],
    },

    // ---------- TWITTER ----------
    twitter: {
      card: "summary_large_image",
      title: "Qunt Edge",
      description: "Next generation trading dashboard",
      images: [ref ? ogUrl : "/twitter-image.png"],
    },

    // ---------- ICONS ----------
    icons: {
      icon: [
        { url: "/favicon.ico", sizes: "any" },
        { url: "/icon.png", type: "image/png", sizes: "32x32" },
      ],
      apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
      other: [
        { rel: "mask-icon", url: "/safari-pinned-tab.svg", color: "#000000" },
        {
          rel: "android-chrome",
          sizes: "192x192",
          url: "/android-chrome-192x192.png",
        },
        {
          rel: "android-chrome",
          sizes: "512x512",
          url: "/android-chrome-512x512.png",
        },
      ],
    },

    // ---------- PWA ----------
    manifest: "/site.webmanifest",

    // ---------- ROBOTS ----------
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },

    // ---------- OTHER ----------
    other: { google: "notranslate" },
    authors: [{ name: "TIMON" }],
    creator: "TIMON",
    publisher: "TIMON",
    formatDetection: { email: false, address: false, telephone: false },
  };
}

export const viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await connection();
  return (
    <html
      lang="en"
      className="bg-background"
      translate="no"
      suppressHydrationWarning
      style={{ ["--theme-intensity" as string]: "100%" }}
    >
      <head>
        {/* Resource Hinting for Performance */}
        <link rel="dns-prefetch" href="https://qunt-edge.vercel.app" />
        <link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* Mobile-First Meta Tags */}
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5, viewport-fit=cover" />
        <meta name="theme-color" content="#040404" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="format-detection" content="telephone=no, address=no, email=no" />

        {/* Accessibility & SEO */}
        <meta name="google" content="notranslate" />
        <meta name="robots" content="index, follow" />

        {/* Apply stored theme before paint to avoid blank flash */}
        <Script id="init-theme" strategy="beforeInteractive">
          {`
            (function() {
              try {
                var root = document.documentElement;
                var savedTheme = localStorage.getItem('theme');
                var resolvedTheme = savedTheme === 'dark'
                  ? 'dark'
                  : savedTheme === 'light'
                    ? 'light'
                    : (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

                root.classList.remove('light', 'dark');
                root.classList.add(resolvedTheme);

                var savedIntensity = localStorage.getItem('intensity');
                var intensity = savedIntensity ? Number(savedIntensity) : 100;
                root.style.setProperty('--theme-intensity', intensity + '%');
              } catch (e) {
                // Fail silently to avoid blocking render
              }
            })();
          `}
        </Script>

        {/* Prevent Google Translate DOM manipulation */}
        <Script id="prevent-google-translate" strategy="beforeInteractive">
          {`
            // Function to prevent Google Translate from modifying the DOM
            function preventGoogleTranslate() {
              // Prevent Google Translate from modifying the DOM
              const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                  if (mutation.type === 'childList' && 
                      mutation.target.classList && 
                      mutation.target.classList.contains('goog-te-menu-frame')) {
                    // Prevent Google Translate from modifying our React components
                    const elements = document.querySelectorAll('[class*="goog-te-"]');
                    elements.forEach((el) => {
                      if (el.tagName === 'SPAN' && el.parentElement) {
                        // Preserve the original text content
                        const originalText = el.getAttribute('data-original-text') || el.textContent;
                        el.textContent = originalText;
                      }
                    });
                  }
                });
              });

              // Start observing the document with the configured parameters
              observer.observe(document.body, {
                childList: true,
                subtree: true,
                attributes: true,
                attributeFilter: ['class']
              });

              // Prevent Google Translate from initializing
              if (window.google && window.google.translate) {
                window.google.translate.TranslateElement = function() {
                  return {
                    translate: function() {
                      return false;
                    }
                  };
                };
              }
            }

            // Run the prevention function
            preventGoogleTranslate();
          `}
        </Script>

        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="apple-touch-icon-precomposed"
          sizes="180x180"
          href="/apple-touch-icon-precomposed.png"
        />

        <style>
          {`
            /* Base layout */
            html {
              margin: 0;
              padding: 0;
              scrollbar-gutter: stable !important;
              -ms-overflow-style: scrollbar !important;
            }

            /* Style the scrollbar */
            ::-webkit-scrollbar {
              width: 14px !important;
              background-color: transparent !important;
            }

            ::-webkit-scrollbar-track {
              background: hsl(var(--background)) !important;
              border-left: 1px solid hsl(var(--border)) !important;
            }

            ::-webkit-scrollbar-thumb {
              background: hsl(var(--muted-foreground) / 0.3) !important;
              border-radius: 7px !important;
              border: 3px solid hsl(var(--background)) !important;
              min-height: 40px !important;
            }

            ::-webkit-scrollbar-thumb:hover {
              background: hsl(var(--muted-foreground) / 0.4) !important;
            }

            /* Firefox scrollbar styles */
            * {
              scrollbar-width: thin !important;
              scrollbar-color: hsl(var(--muted-foreground) / 0.3) transparent !important;
            }

            /* Prevent Radix UI Dialog from adding padding-right/margin-right to body */
            /* Since we use scrollbar-gutter: stable, we don't need the padding/margin */
            body[data-scroll-locked],
            body[style*="padding-right"],
            body[style*="margin-right"] {
              padding-right: 0 !important;
              margin-right: 0 !important;
            }
            
            /* Also target any Radix scroll lock classes */
            body.radix-scroll-lock,
            body[class*="scroll-lock"] {
              padding-right: 0 !important;
              margin-right: 0 !important;
            }
            
            /* Force margin-right to 0 when body has pointer-events: none (Radix UI scroll lock) */
            body[style*="pointer-events: none"] {
              margin-right: 0 !important;
              padding-right: 0 !important;
            }
          `}
        </style>
      </head>
      <body className={inter.className}>
        <ScrollLockFix />
        <SpeedInsights />
        <Analytics />
        {children}
      </body>
    </html>
  );
}
