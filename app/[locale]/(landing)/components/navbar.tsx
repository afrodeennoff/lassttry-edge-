'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, Moon, Sun, Laptop } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Command, CommandGroup, CommandItem, CommandList } from '@/components/ui/command'
import { LanguageSelector } from '@/components/ui/language-selector'
import { Logo } from '@/components/logo'
import { useTheme } from '@/context/theme-provider'
import { useI18n } from '@/locales/client'
import { cn } from '@/lib/utils'

type NavLink = {
  title: string
  href: string
}

const PRIMARY_LINKS: NavLink[] = [
  { title: 'PRODUCT', href: '/' },
  { title: 'FEATURES', href: '/#features' },
  { title: 'PRICING', href: '/pricing' },
  { title: 'PROP FIRMS CATALOGUE', href: '/propfirms' },
  { title: 'TEAMS', href: '/teams' },
  { title: 'SUPPORT', href: '/support' },
]

const SECONDARY_LINKS: NavLink[] = [
  { title: 'SUPPORT CENTER', href: '/support' },
  { title: 'COMMUNITY', href: '/community' },
  { title: 'ROADMAP', href: '/updates' },
  { title: 'ABOUT', href: '/about' },
  { title: 'FAQ', href: '/faq' },
  { title: 'PRIVACY', href: '/privacy' },
  { title: 'TERMS', href: '/terms' },
  { title: 'DISCLAIMERS', href: '/disclaimers' },
]

export default function Navbar() {
  const { theme, setTheme } = useTheme()
  const pathname = usePathname()
  const t = useI18n() as (key: string) => string

  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const isHomePath = useMemo(() => pathname === '/' || /^\/[a-z]{2}$/.test(pathname), [pathname])

  const isActive = (href: string): boolean => {
    if (href === '/') {
      return pathname === '/' || /^\/[a-z]{2}$/.test(pathname)
    }

    if (href.startsWith('/#')) {
      return isHomePath
    }

    const normalized = href.split('#')[0]
    return pathname === normalized || pathname.endsWith(normalized)
  }

  const ThemeIcon = () => {
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
        'transition-all duration-200',
        mobile
          ? 'block rounded-xl px-3 py-2.5 text-sm font-semibold tracking-wide'
          : 'rounded-xl px-2.5 py-2 text-[10px] font-black uppercase tracking-[0.14em]',
        isActive(link.href)
          ? 'bg-primary/12 text-primary'
          : 'text-muted-foreground hover:bg-muted/70 hover:text-foreground'
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
            'mx-auto flex min-h-16 items-center rounded-2xl border px-3 py-2 backdrop-blur-xl transition-all duration-300 sm:min-h-[72px] sm:px-4',
            scrolled
              ? 'border-border/70 bg-background/92 shadow-[0_18px_40px_-24px_rgba(0,0,0,0.55)]'
              : 'border-border/50 bg-background/78'
          )}
        >
          <Link href="/" className="mr-2 flex items-center gap-2.5 rounded-xl px-1 py-1">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-primary/25 bg-primary/10">
              <Logo className="h-4.5 w-4.5 fill-foreground" />
            </div>
            <div className="hidden sm:flex flex-col leading-none">
              <span className="text-sm font-black tracking-tight">Qunt Edge</span>
              <span className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground">Trading Intelligence</span>
            </div>
          </Link>

          <div className="ml-1 hidden min-w-0 flex-1 flex-col gap-1.5 xl:flex">
            <nav className="flex flex-wrap items-center gap-1">
              {PRIMARY_LINKS.map((link) => (
                <HeaderLink key={link.title} link={link} />
              ))}
            </nav>
            <nav className="flex flex-wrap items-center gap-1">
              {SECONDARY_LINKS.map((link) => (
                <HeaderLink key={link.title} link={link} />
              ))}
            </nav>
          </div>

          <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
            <LanguageSelector triggerClassName="h-9 w-9 rounded-xl hover:bg-muted/70" />

            <Popover modal>
              <PopoverTrigger asChild>
                <Button variant="ghost" className="hidden h-9 w-9 rounded-xl px-0 hover:bg-muted/70 sm:inline-flex">
                  <ThemeIcon />
                  <span className="sr-only">{t('landing.navbar.toggleTheme')}</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[190px] p-1.5" align="end">
                <Command>
                  <CommandList>
                    <CommandGroup>
                      <CommandItem onSelect={() => setTheme('light')}>{t('landing.navbar.lightMode')}</CommandItem>
                      <CommandItem onSelect={() => setTheme('dark')}>{t('landing.navbar.darkMode')}</CommandItem>
                      <CommandItem onSelect={() => setTheme('system')}>{t('landing.navbar.systemTheme')}</CommandItem>
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>

            <Button asChild className="hidden h-9 rounded-xl px-4 text-[11px] font-black uppercase tracking-[0.15em] md:inline-flex">
              <Link href="/authentication">{t('landing.navbar.signIn')}</Link>
            </Button>

            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" className="h-9 w-9 rounded-xl px-0 xl:hidden hover:bg-muted/70">
                  <Menu className="h-4.5 w-4.5" />
                  <span className="sr-only">{t('landing.navbar.openMenu')}</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[340px] border-l border-border/70 p-0">
                <div className="flex h-full flex-col bg-background">
                  <div className="flex items-center gap-3 border-b border-border/70 px-5 py-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-primary/25 bg-primary/10">
                      <Logo className="h-4.5 w-4.5 fill-foreground" />
                    </div>
                    <div className="flex flex-col leading-none">
                      <span className="text-sm font-black tracking-tight">Qunt Edge</span>
                      <span className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground">Menu</span>
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto px-4 py-5">
                    <p className="px-3 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Navigation</p>
                    <div className="mt-2 space-y-1">
                      {PRIMARY_LINKS.map((link) => (
                        <HeaderLink key={link.title} link={link} mobile />
                      ))}
                      {SECONDARY_LINKS.map((link) => (
                        <HeaderLink key={link.title} link={link} mobile />
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
