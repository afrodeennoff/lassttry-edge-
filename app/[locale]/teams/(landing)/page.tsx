'use client'

import React, { useEffect } from 'react'
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useI18n } from '@/locales/client'
import { getCalApi } from "@calcom/embed-react"
import {
  Users,
  BarChart3,
  Shield,
  Code,
  Clock,
  FileText,
  ChevronRight,
  Building2,
  Target,
  Globe,
  ArrowRight
} from 'lucide-react'
import Footer from '../../(landing)/components/footer'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import TeamNavbar from '../components/team-navbar'

export default function TeamPage() {
  const t = useI18n()
  const [activeSection, setActiveSection] = React.useState('hero')

  useEffect(() => {
    (async function () {
      const cal = await getCalApi({ "namespace": "qunt-edge-team" });
      cal("ui", { "hideEventTypeDetails": false, "layout": "month_view" });
    })();
  }, [])

  // Scroll Spy Logic
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['hero', 'features', 'use-cases', 'cta']
      const current = sections.find(section => {
        const element = document.getElementById(section)
        if (element) {
          const rect = element.getBoundingClientRect()
          return rect.top >= -100 && rect.top <= 300
        }
        return false
      })
      if (current) setActiveSection(current)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollTo = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const features = [
    {
      icon: Users,
      title: t('teams.features.multiAccount.title'),
      description: t('teams.features.multiAccount.description'),
    },
    {
      icon: BarChart3,
      title: t('teams.features.teamAnalytics.title'),
      description: t('teams.features.teamAnalytics.description'),
    },
    {
      icon: Clock,
      title: t('teams.features.realTime.title'),
      description: t('teams.features.realTime.description'),
    },
    {
      icon: Shield,
      title: t('teams.features.riskManagement.title'),
      description: t('teams.features.riskManagement.description'),
    },
    {
      icon: FileText,
      title: t('teams.features.compliance.title'),
      description: t('teams.features.compliance.description'),
    },
    {
      icon: Code,
      title: t('teams.features.api.title'),
      description: t('teams.features.api.description'),
    },
  ]

  const useCases = [
    {
      icon: Building2,
      title: t('teams.usecases.fund.title'),
      description: t('teams.usecases.fund.description'),
    },
    {
      icon: Target,
      title: t('teams.usecases.prop.title'),
      description: t('teams.usecases.prop.description'),
    },
    {
      icon: Users,
      title: t('teams.usecases.family.title'),
      description: t('teams.usecases.family.description'),
    },
    {
      icon: Globe,
      title: t('teams.usecases.institutional.title'),
      description: t('teams.usecases.institutional.description'),
    },
  ]


  const stats = [
    { value: '500+', label: t('teams.stats.traders') },
    { value: '2,000+', label: t('teams.stats.accounts') },
    { value: '50+', label: t('teams.stats.brokers') },
  ]

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  }

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  return (
    <div className="flex flex-col min-h-dvh bg-background text-foreground overflow-hidden relative">
      <TeamNavbar />

      {/* Sticky Navigation Dots */}
      <div className="fixed right-8 top-1/2 -translate-y-1/2 z-50 hidden lg:flex flex-col gap-4">
        {['hero', 'features', 'use-cases', 'cta'].map((section) => (
          <button
            key={section}
            onClick={() => scrollTo(section)}
            className={cn(
              "w-3 h-3 rounded-full transition-all duration-300",
              activeSection === section ? "bg-emerald-500 scale-125" : "bg-muted-foreground/30 hover:bg-emerald-500/50"
            )}
            aria-label={`Scroll to ${section}`}
          />
        ))}
      </div>

      <main className="flex-1">
        {/* Hero Section */}
        <section id="hero" className="relative isolate pt-14 dark:bg-gray-900 min-h-screen flex items-center">
          <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
            <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" style={{ clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)' }} />
          </div>

          <div className="py-24 sm:py-32 lg:pb-40 w-full">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
              <div className="mx-auto max-w-2xl text-center">
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={fadeInUp}
                  className="mb-8 flex justify-center"
                >
                  <div className="rounded-full px-3 py-1 text-sm leading-6 text-muted-foreground ring-1 ring-gray-900/10 dark:ring-white/10 hover:ring-gray-900/20 dark:hover:ring-white/20 transition-all">
                    {t('teams.badge')} <a href="#" className="font-semibold text-primary"><span className="absolute inset-0" aria-hidden="true" />{t('teams.badge.description')} <span aria-hidden="true">&rarr;</span></a>
                  </div>
                </motion.div>

                <motion.h1
                  initial="hidden"
                  animate="visible"
                  variants={fadeInUp}
                  className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400"
                >
                  {t('teams.hero.title')}
                </motion.h1>

                <motion.p
                  initial="hidden"
                  animate="visible"
                  variants={fadeInUp}
                  className="mt-6 text-lg leading-8 text-muted-foreground"
                >
                  {t('teams.hero.description')}
                </motion.p>

                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={fadeInUp}
                  className="mt-10 flex items-center justify-center gap-x-6"
                >
                  <Link href="/authentication?next=teams/dashboard">
                    <Button size="lg" className="rounded-xl h-12 px-8 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-lg shadow-emerald-500/25 transition-all hover:scale-105">
                      {t('teams.cta')}
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="lg"
                    className="rounded-xl h-12 px-8 border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
                    data-cal-namespace="qunt-edge-team"
                    data-cal-link="hugo-demenez/qunt-edge-team"
                    data-cal-config='{"layout":"month_view"}'
                  >
                    {t('teams.cta.secondary')} <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </motion.div>
              </div>

              {/* Stats Section */}
              <motion.dl
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={container}
                className="mt-16 grid grid-cols-1 gap-0.5 overflow-hidden rounded-2xl text-center sm:grid-cols-3 bg-white/5 ring-1 ring-white/10 backdrop-blur-3xl"
              >
                {stats.map((stat) => (
                  <motion.div key={stat.label} variants={fadeInUp} className="flex flex-col bg-white/5 p-8 hover:bg-white/10 transition-colors">
                    <dt className="text-sm font-semibold leading-6 text-muted-foreground">{stat.label}</dt>
                    <dd className="order-first text-3xl font-semibold tracking-tight text-foreground">{stat.value}</dd>
                  </motion.div>
                ))}
              </motion.dl>

              {/* Hero Image */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 40 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
                className="mt-16 flow-root sm:mt-24"
              >
                <div className="-m-2 rounded-xl bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10 dark:bg-white/5 dark:ring-white/10 lg:-m-4 lg:rounded-2xl lg:p-4 backdrop-blur-md">
                  <Image
                    alt="Dashboard screenshot"
                    src="/business-dark.png"
                    width={2432}
                    height={1442}
                    className="w-full rounded-md shadow-2xl ring-1 ring-gray-900/10 dark:ring-gray-100/10 hidden dark:block"
                    priority
                  />
                  <Image
                    alt="Dashboard screenshot"
                    src="/business-light.png"
                    width={2432}
                    height={1442}
                    className="w-full rounded-md shadow-2xl ring-1 ring-gray-900/10 dark:hidden"
                    priority
                  />
                </div>
              </motion.div>
            </div>
          </div>

          <div className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]" aria-hidden="true">
            <div className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-20 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]" style={{ clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)' }} />
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="relative py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-base font-semibold leading-7 text-emerald-500">
                {t('teams.features.subtitle')}
              </h2>
              <p className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                {t('teams.features.title')}
              </p>
              <p className="mt-6 text-lg leading-8 text-muted-foreground">
                {t('teams.features.description')}
              </p>
            </div>
            <motion.div
              variants={container}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none"
            >
              <div className="grid grid-cols-1 gap-x-8 gap-y-16 lg:grid-cols-3">
                {features.map((feature) => (
                  <motion.div key={feature.title} variants={fadeInUp} className="flex flex-col group">
                    <div className="mb-6 flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10 group-hover:bg-emerald-500/20 transition-colors">
                      <feature.icon className="h-6 w-6 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                    </div>
                    <dt className="text-base font-semibold leading-7 text-foreground">
                      {feature.title}
                    </dt>
                    <dd className="mt-1 flex flex-auto flex-col text-base leading-7 text-muted-foreground">
                      <p className="flex-auto">{feature.description}</p>
                    </dd>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Use Cases Section */}
        <section id="use-cases" className="relative isolate overflow-hidden bg-muted/40 py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl lg:mx-0">
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">{t('teams.usecases.title')}</h2>
              <p className="mt-6 text-lg leading-8 text-muted-foreground">
                {t('teams.usecases.description')}
              </p>
            </div>
            <motion.div
              variants={container}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-6 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-2 lg:gap-8"
            >
              {useCases.map((useCase) => (
                <motion.div key={useCase.title} variants={fadeInUp}>
                  <Card className="flex gap-x-4 p-6 bg-background/60 backdrop-blur-sm border-muted/50 hover:border-emerald-500/30 hover:shadow-lg transition-all duration-300">
                    <CardHeader className="p-0">
                      <div className="flex h-12 w-12 flex-none items-center justify-center rounded-full bg-emerald-500/10">
                        <useCase.icon className="h-6 w-6 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                      </div>
                    </CardHeader>
                    <CardContent className="p-0 pl-4">
                      <CardTitle className="text-xl font-semibold leading-6 text-foreground mb-2">{useCase.title}</CardTitle>
                      <CardDescription className="text-sm leading-6 text-muted-foreground">{useCase.description}</CardDescription>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section id="cta" className="relative isolate py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                {t('teams.cta.createAccount.title')}
              </h2>
              <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-muted-foreground">
                {t('teams.cta.createAccount.description')}
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                <Link href="/authentication?next=teams/dashboard">
                  <Button size="lg" className="rounded-xl h-12 px-8 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-lg shadow-emerald-500/25 transition-all hover:scale-105">
                    {t('teams.cta.createAccount.button')}
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  size="lg"
                  className="rounded-xl h-12 px-8 border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
                  data-cal-namespace="qunt-edge-team"
                  data-cal-link="hugo-demenez/qunt-edge-team"
                  data-cal-config='{"layout":"month_view"}'
                >
                  {t('teams.cta.demo.button')} <span aria-hidden="true" className="ml-2">→</span>
                </Button>
              </div>
              <p className="mt-4 text-sm text-muted-foreground">{t('teams.cta.createAccount.subtext')}</p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="w-full py-12 border-t bg-muted/20">
          <div className="container mx-auto px-4">
            <Footer />
          </div>
        </footer>
      </main>
    </div>
  )
}