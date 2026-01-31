'use client'

import Link from "next/link"
import { UserAuthForm } from "../components/user-auth-form"
import { Logo } from "@/components/logo"
import { useI18n } from '@/locales/client'
import { cn } from "@/lib/utils"

export default function AuthenticationPage() {
  const t = useI18n()

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-background">
      {/* Dynamic Background Effects */}
      <div className="absolute inset-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900/20 via-background to-background pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-primary/10 rounded-full blur-[120px] opacity-20 pointer-events-none animate-pulse-slow" />
      <div className="absolute bottom-0 right-0 w-[800px] h-[600px] bg-secondary/10 rounded-full blur-[100px] opacity-20 pointer-events-none" />

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none mix-blend-overlay" />

      <div className="relative z-10 w-full max-w-[420px] px-4">
        <div className="animate-slide-up flex flex-col items-center">

          {/* Brand Header */}
          <Link href="/" className="flex flex-col items-center space-y-4 mb-8 group">
            <div className="relative">
              <div className="absolute -inset-2 rounded-full bg-gradient-to-r from-primary to-secondary opacity-30 blur-md transition-all duration-500 group-hover:opacity-50" />
              <div className="relative bg-background rounded-2xl p-3 ring-1 ring-border/50 shadow-2xl transition-transform duration-300 group-hover:scale-110">
                <Logo className="w-10 h-10 text-primary fill-current" />
              </div>
            </div>

            <div className="text-center space-y-1">
              <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl bg-clip-text text-transparent bg-gradient-to-br from-foreground to-muted-foreground">
                {t('authentication.title')}
              </h1>
              <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                {t('authentication.description')}
              </p>
            </div>
          </Link>

          {/* Glassmorphism Auth Card */}
          <div className="w-full backdrop-blur-xl bg-card/40 border border-border/50 shadow-2xl rounded-2xl p-6 sm:p-8 relative overflow-hidden group">
            {/* Subtle internal glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

            <UserAuthForm />

            <div className="relative mt-6 pt-6 border-t border-border/50 text-center">
              <p className="text-xs text-muted-foreground">
                {t('authentication.termsAndPrivacy.prefix')}{" "}
                <Link
                  href="/terms"
                  className="underline underline-offset-4 hover:text-primary transition-colors font-medium"
                >
                  {t('authentication.termsAndPrivacy.terms')}
                </Link>{" "}
                {t('authentication.termsAndPrivacy.and')}{" "}
                <Link
                  href="/privacy"
                  className="underline underline-offset-4 hover:text-primary transition-colors font-medium"
                >
                  {t('authentication.termsAndPrivacy.privacy')}
                </Link>
                .
              </p>
            </div>
          </div>

          {/* Optional Footer Text */}
          <div className="mt-8 text-center">
            <p className="text-xs text-muted-foreground/50">
              &copy; {new Date().getFullYear()} Qunt Edge. All rights reserved.
            </p>
          </div>

        </div>
      </div>
    </div>
  )
}