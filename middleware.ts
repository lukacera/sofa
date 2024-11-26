import { NextResponse } from 'next/server'
import { auth, signOut } from './auth'

export default auth(async (req) => {
    const publicPaths = ['/login', '/register', '/api', '/account-not-found']
    const isPublicPath = publicPaths.some(path => 
        req.nextUrl.pathname.startsWith(path)
    )
    
    const session = req.auth
    
    if (req.nextUrl.pathname === '/login' && session) {
        return NextResponse.redirect(new URL('/', req.url))
    }
    
    // Root path redirect
    if (req.nextUrl.pathname === '/') {
        return NextResponse.redirect(new URL('/home', req.url))
    }
    // If on protected path and not authenticated, redirect to login
    if (!isPublicPath && !session) {
        return NextResponse.redirect(new URL('/login', req.url))
    }
 
    // Only check DB for authenticated users on protected paths
    if (!isPublicPath && session) {
        try {
            const baseUrl = req.nextUrl.origin
            const response = await fetch(`${baseUrl}/api/users/${session.user.email}`)
            const data = await response.json()
            if (!data.user) {
                await signOut()
                return NextResponse.redirect(new URL('/login', req.url))
            }
        } catch (error) {
            console.error('Session check failed:', error)
            return NextResponse.redirect(new URL('/login', req.url))
        }
    }
 
    return NextResponse.next()
 
})

export const config = {
   matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
}