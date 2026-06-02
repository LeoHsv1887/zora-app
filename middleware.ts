import { createServerClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  let res = NextResponse.next({ request: { headers: req.headers } })

  // Admin-Bypass: Cookie gesetzt → Zugang ohne Supabase Session
  const isAdmin = req.cookies.get('zora_admin')?.value === 'true'
  if (isAdmin) return res

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key',
    {
      cookies: {
        getAll() {
          return req.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => req.cookies.set(name, value))
          res = NextResponse.next({ request: { headers: req.headers } })
          cookiesToSet.forEach(({ name, value, options }) =>
            res.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { session } } = await supabase.auth.getSession()

  // Protect /app/* routes
  if (req.nextUrl.pathname.startsWith('/app') && !session) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  // Redirect logged-in users away from auth pages
  if ((req.nextUrl.pathname === '/login' || req.nextUrl.pathname === '/registrierung') && session) {
    return NextResponse.redirect(new URL('/app/dashboard', req.url))
  }

  return res
}

export const config = {
  matcher: ['/app/:path*', '/login', '/registrierung'],
}
