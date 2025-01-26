import { NextResponse } from 'next/server'
import { auth, signOut } from './auth'

export default auth(async (req) => {
    const publicPaths = ['/login', '/register', '/account-not-found']
    const publicApiPaths = ['/api/auth']
    
    // Check if the path is public (non-API)
    const isPublicPath = publicPaths.some(path => 
        req.nextUrl.pathname.startsWith(path)
    )
    
    // Check if the path is a public API route
    const isPublicApiPath = publicApiPaths.some(path =>
        req.nextUrl.pathname.startsWith(path)
    )
    
    // Check if it's an API route
    const isApiRoute = req.nextUrl.pathname.startsWith('/api')

    const session = req.auth

    // Login redirect if already authenticated
    if (req.nextUrl.pathname === '/login' && session) {
        return NextResponse.redirect(new URL('/', req.nextUrl.origin))
    }

    // Root path redirect
    if (req.nextUrl.pathname === '/') {
        return NextResponse.redirect(new URL('/home', req.nextUrl.origin))
    }
    
    // Handle API routes
    if (isApiRoute && !isPublicApiPath) {
        if (!session) {
            return new NextResponse(
                JSON.stringify({ error: 'Unauthorized' }),
                { 
                    status: 401,
                    headers: { 'Content-Type': 'application/json' }
                }
            )
        }
    }
    
    // If on protected path (including protected API routes) and not authenticated, redirect to login
    if (!isPublicPath && !isPublicApiPath && !session) {
        if (isApiRoute) {
            return new NextResponse(
                JSON.stringify({ error: 'Unauthorized' }),
                { 
                    status: 401,
                    headers: { 'Content-Type': 'application/json' }
                }
            )
        }
        return NextResponse.redirect(new URL('/login', req.nextUrl.origin))
    }

    // Only check DB for authenticated users on protected paths
    if (!isPublicPath && !isPublicApiPath && session) {
        try {
            const baseUrl = req.nextUrl.origin
            const response = await fetch(`${baseUrl}/api/users/${session.user.email}`)
            const data = await response.json()
            if (!data.user) {
                await signOut()
                return NextResponse.redirect(new URL('/login', req.nextUrl.origin))
            }
        } catch (error) {
            console.error('Session check failed:', error)
            return NextResponse.redirect(new URL('/login', req.nextUrl.origin))
        }
    }

    return NextResponse.next()
})

export const config = {
    matcher: [
        /*
         * Match all paths except:
         * 1. _next/static (static files)
         * 2. _next/image (image optimization files)
         * 3. favicon.ico (favicon file)
         */
        '/((?!_next/static|_next/image|favicon.ico).*)'
    ]
}