'use client'

import type { ComponentType } from 'react'
import Link from 'next/link'
import { Logo } from '../../../../components/logo'
import { useI18n } from "@/locales/client"
import { Github, Youtube, MessageCircle } from "lucide-react"

type FooterLink = {
  name: string
  href: string
}

type SocialLink = FooterLink & {
  icon: ComponentType<{ className?: string }>
}

export default function Footer() {
  const t = useI18n()

  const productLinks: FooterLink[] = [
    { name: t('footer.product.features'), href: '/#features' },
    { name: t('footer.product.pricing'), href: '/pricing' },
    { name: t('footer.product.propfirms'), href: '/propfirms' },
    { name: t('footer.product.teams'), href: '/teams' },
    { name: t('footer.product.support'), href: '/support' },
  ]

  const supportLinks: FooterLink[] = [
    { name: 'Support Center', href: '/support' },
    { name: 'Community', href: '/community' },
    { name: 'Roadmap', href: '/updates' },
    { name: t('footer.company.about'), href: '/about' },
    { name: 'FAQ', href: '/faq' },
  ]

  const legalLinks: FooterLink[] = [
    { name: t('footer.legal.privacy'), href: '/privacy' },
    { name: t('footer.legal.terms'), href: '/terms' },
    { name: t('footer.legal.disclaimers'), href: '/disclaimers' },
  ]

  const socialLinks: SocialLink[] = [
    { name: 'GitHub', href: 'https://github.com/afrodeennoff/lassttry-edge-', icon: Github },
    { name: 'YouTube', href: 'https://www.youtube.com/@hugodemenez', icon: Youtube },
    { name: 'Discord', href: process.env.NEXT_PUBLIC_DISCORD_INVITATION || '', icon: MessageCircle },
  ]

  return (
    <footer aria-labelledby="footer-heading" className="relative mt-20 border-t border-border/60 bg-background">
      <h2 id="footer-heading" className="sr-only">
        {t('footer.heading')}
      </h2>

      <div className="pointer-events-none absolute inset-0 opacity-60">
        <div className="absolute left-1/2 top-0 h-px w-[min(90%,900px)] -translate-x-1/2 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
        <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
      </div>

      <div className="container-fluid relative py-10 sm:py-14">
        <div className="rounded-3xl border border-border/60 bg-gradient-to-b from-background to-muted/20 p-6 sm:p-8 lg:p-10">
          <div className="grid gap-10 lg:grid-cols-[1.2fr_2fr]">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-primary/25 bg-primary/10">
                  <Logo className="h-5 w-5 fill-foreground" />
                </div>
                <div className="flex flex-col leading-none">
                  <span className="text-base font-black tracking-tight">Qunt Edge</span>
                  <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Execution Intelligence</span>
                </div>
              </div>

              <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
                {t('footer.description')}
              </p>

              <div className="flex flex-wrap items-center gap-2">
                <Link href="/pricing" className="rounded-xl border border-border/70 px-4 py-2 text-[11px] font-black uppercase tracking-[0.15em] text-foreground transition-colors hover:bg-muted/70">
                  {t('footer.product.pricing')}
                </Link>
                <Link href="/support" className="rounded-xl bg-primary px-4 py-2 text-[11px] font-black uppercase tracking-[0.15em] text-primary-foreground transition-opacity hover:opacity-90">
                  Support Center
                </Link>
              </div>

              <div className="flex items-center gap-2 pt-1">
                {socialLinks.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={item.name}
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-border/70 text-muted-foreground transition-all hover:border-primary/40 hover:text-primary"
                  >
                    <item.icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
              <FooterColumn title={t('footer.product.title')} links={productLinks} />
              <FooterColumn title="Support" links={supportLinks} />
              <FooterColumn title={t('footer.legal.title')} links={legalLinks} />
            </div>
          </div>

          <div className="mt-10 border-t border-border/60 pt-6">
            <p className="text-xs text-muted-foreground">
              {t('footer.copyright', { year: new Date().getFullYear() })}
            </p>
            <p className="mt-3 text-[11px] leading-relaxed text-muted-foreground/90">
              {t('disclaimer.risk.content')}
            </p>
            <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground/90">
              {t('disclaimer.hypothetical.content')}
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

function FooterColumn({ title, links }: { title: string; links: FooterLink[] }) {
  return (
    <div>
      <h3 className="text-[10px] font-black uppercase tracking-[0.22em] text-muted-foreground">
        {title}
      </h3>
      <ul className="mt-4 space-y-2.5">
        {links.map((item) => (
          <li key={item.name}>
            <Link
              href={item.href}
              className="text-sm text-foreground/85 transition-colors hover:text-primary"
            >
              {item.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
