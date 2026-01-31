import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getSubscriptionDetails } from '@/server/subscription'

const PREMIUM_ROUTES = ['/dashboard', '/dashboard/billing', '/teams']
const ADMIN_ROUTES = ['/admin']

function isPremiumRoute(pathname: string): boolean {
  return PREMIUM_ROUTES.some(route => pathname.startsWith(route))
}

function isAdminRoute(pathname: string): boolean {
  return ADMIN_ROUTES.some(route => pathname.startsWith(route))
}

function isPublicRoute(pathname: string): boolean {
  const publicRoutes = [
    '/',
    '/pricing',
    '/authentication',
    '/community',
    '/about',
    '/privacy',
    '/terms',
    '/support',
    '/updates',
    '/newsletter',
    '/referral',
    '/propfirms',
    '/disclaimers',
    '/maintenance',
    '/api/whop',
    '/api/auth',
  ]
  return publicRoutes.some(route => pathname.startsWith(route))
}

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const pathname = req.nextUrl.pathname

  if (isPublicRoute(pathname)) {
    return res
  }

  const supabase = createMiddlewareClient({ req, res })
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    if (isPremiumRoute(pathname) || isAdminRoute(pathname)) {
      const redirectUrl = new URL('/authentication', req.url)
      redirectUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(redirectUrl)
    }
    return res
  }

  const email = session.user.email
  if (!email) {
    return res
  }

  if (isAdminRoute(pathname)) {
    const adminDomains = process.env.ADMIN_EMAIL_DOMAINS?.split(',') || []
    const isAdmin = adminDomains.some(domain => 
      email.toLowerCase().endsWith(domain.toLowerCase())
    )

    if (!isAdmin) {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }
  }

  if (isPremiumRoute(pathname)) {
    try {
      const subscription = await getSubscriptionDetails()

      if (!subscription || !subscription.isActive) {
        if (!pathname.startsWith('/pricing') && !pathname.startsWith('/dashboard/billing')) {
          return NextResponse.redirect(new URL('/pricing', req.url))
        }
      }

      if (subscription) {
        res.headers.set('x-subscription-status', subscription.status)
        res.headers.set('x-subscription-plan', subscription.plan || 'FREE')
        
        if (subscription.endDate) {
          res.headers.set('x-subscription-end-date', subscription.endDate.toISOString())
        }
        
        if (subscription.trialEndsAt) {
          res.headers.set('x-subscription-trial-end', subscription.trialEndsAt.toISOString())
        }
      }
    } catch (error) {
      console.error('[Middleware] Subscription check failed:', error)
    }
  }

  return res
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
