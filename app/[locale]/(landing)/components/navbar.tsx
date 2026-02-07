'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandGroup, CommandItem, CommandList } from "@/components/ui/command"
import { Logo } from "@/components/logo"
import { LanguageSelector } from "@/components/ui/language-selector"
import { cn } from '@/lib/utils'
import { useTheme } from '@/context/theme-provider'
import { useI18n } from "@/locales/client"
import { Menu, Moon, Sun, Laptop } from "lucide-react"

type NavLink = {
  title: string
  href: string
}

export default function Navbar() {
  const { theme, setTheme } = useTheme()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()
  const t = useI18n() as (key: string) => string

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const primaryLinks = useMemo<NavLink[]>(() => [
    { title: t('landing.navbar.features'), href: '/#features' },
    { title: t('landing.navbar.pricing'), href: '/pricing' },
    { title: t('landing.navbar.propFirms'), href: '/propfirms' },
    { title: t('landing.navbar.teams'), href: '/teams' },
    { title: t('landing.navbar.support'), href: '/support' },
  ], [t])

  const secondaryLinks = useMemo<NavLink[]>(() => [
    { title: 'Community', href: '/community' },
    { title: 'Roadmap', href: '/updates' },
    { title: t('landing.navbar.about'), href: '/about' },
    { title: 'FAQ', href: '/faq' },
  ], [t])

  const isHomePath = pathname === "/" || /^\/[a-z]{2}$/.test(pathname)

  const isActive = (href: string) => {
    if (href.startsWith("/#")) return isHomePath
    const normalizedHref = href.split("#")[0]
    return pathname === normalizedHref || pathname.endsWith(normalizedHref)
  }

  const getThemeIcon = () => {
    if (theme === 'light') return <Sun className="h-4 w-4" />
    if (theme === 'dark') return <Moon className="h-4 w-4" />
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return <Moon className="h-4 w-4" />
    }
    return <Laptop className="h-4 w-4" />
  }

  const HeaderLink = ({ link, mobile = false }: { link: NavLink; mobile?: boolean }) => (
    <Link
      href={link.href}
      onClick={() => setMobileOpen(false)}
      className={cn(
        "transition-all duration-200",
        mobile
          ? "block rounded-xl px-3 py-2.5 text-sm font-medium"
          : "rounded-xl px-3 py-2 text-[11px] font-bold uppercase tracking-[0.16em]",
        isActive(link.href)
          ? "text-primary bg-primary/10"
          : "text-muted-foreground hover:text-foreground hover:bg-muted/70"
      )}
    >
      {link.title}
    </Link>
  )

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="container-fluid pt-3 sm:pt-4">
        <div
          className={cn(
            "mx-auto flex h-14 sm:h-16 items-center rounded-2xl border px-3 sm:px-4 backdrop-blur-xl transition-all duration-300",
            scrolled
              ? "border-border/70 bg-background/90 shadow-[0_18px_40px_-24px_rgba(0,0,0,0.55)]"
              : "border-border/40 bg-background/70"
          )}
        >
          <Link href="/" className="flex items-center gap-2.5 pr-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-primary/25 bg-primary/10">
              <Logo className="h-4.5 w-4.5 fill-foreground" />
            </div>
            <div className="hidden sm:flex flex-col leading-none">
              <span className="text-sm font-black tracking-tight">Qunt Edge</span>
              <span className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground">Trading Intelligence</span>
            </div>
          </Link>

          <nav className="ml-3 hidden lg:flex items-center gap-1">
            {primaryLinks.map((link) => (
              <HeaderLink key={link.href} link={link} />
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
            <div className="hidden xl:flex items-center gap-1 pr-2 border-r border-border/60">
              {secondaryLinks.map((link) => (
                <HeaderLink key={link.href} link={link} />
              ))}
            </div>

            <LanguageSelector triggerClassName="h-9 w-9 rounded-xl hover:bg-muted/70" />

            <Popover modal>
              <PopoverTrigger asChild>
                <Button variant="ghost" className="hidden sm:inline-flex h-9 w-9 rounded-xl px-0 hover:bg-muted/70">
                  {getThemeIcon()}
                  <span className="sr-only">{t('landing.navbar.toggleTheme')}</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[190px] p-1.5" align="end">
                <Command>
                  <CommandList>
                    <CommandGroup>
                      <CommandItem onSelect={() => setTheme("light")}>{t('landing.navbar.lightMode')}</CommandItem>
                      <CommandItem onSelect={() => setTheme("dark")}>{t('landing.navbar.darkMode')}</CommandItem>
                      <CommandItem onSelect={() => setTheme("system")}>{t('landing.navbar.systemTheme')}</CommandItem>
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>

            <Button asChild className="hidden md:inline-flex h-9 rounded-xl px-4 text-[11px] font-black uppercase tracking-[0.15em]">
              <Link href="/authentication">{t('landing.navbar.signIn')}</Link>
            </Button>

            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" className="h-9 w-9 rounded-xl px-0 lg:hidden hover:bg-muted/70">
                  <Menu className="h-4.5 w-4.5" />
                  <span className="sr-only">{t('landing.navbar.openMenu')}</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[320px] border-l border-border/70 p-0">
                <div className="flex h-full flex-col bg-background">
                  <div className="flex items-center gap-3 border-b border-border/70 px-5 py-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-primary/25 bg-primary/10">
                      <Logo className="h-4.5 w-4.5 fill-foreground" />
                    </div>
                    <div className="flex flex-col leading-none">
                      <span className="text-sm font-black tracking-tight">Qunt Edge</span>
                      <span className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground">Navigation</span>
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto px-4 py-5">
                    <p className="px-3 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Product</p>
                    <div className="mt-2 space-y-1">
                      {primaryLinks.map((link) => (
                        <HeaderLink key={link.href} link={link} mobile />
                      ))}
                    </div>

                    <p className="mt-6 px-3 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Company</p>
                    <div className="mt-2 space-y-1">
                      {secondaryLinks.map((link) => (
                        <HeaderLink key={link.href} link={link} mobile />
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-border/70 p-4">
                    <Button asChild className="h-10 w-full rounded-xl text-[11px] font-black uppercase tracking-[0.15em]">
                      <Link href="/authentication" onClick={() => setMobileOpen(false)}>
                        {t('landing.navbar.signIn')}
                      </Link>
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}
