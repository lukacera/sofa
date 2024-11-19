import { NextResponse } from 'next/server'
import { auth } from './auth'

export default auth((req) => {
    // Public paths that don't require authentication
    const publicPaths = ['/login', '/register', '/api']

    // Check if path is public
    const isPublicPath = publicPaths.some(path => 
    req.nextUrl.pathname.startsWith(path)
    )

    // Get auth session
    const session = req.auth

    // Redirect unauthenticated users to login
    if (!session && !isPublicPath) {
    return NextResponse.redirect(new URL('/login', req.url))
    }

    // Redirect authenticated users away from login/register
    if (session && isPublicPath) {
    return NextResponse.redirect(new URL('/home', req.url)) 
    }

    if (req.nextUrl.pathname === '/') {
        return NextResponse.redirect(new URL('/home', req.url))
    }

})

export const config = {
 matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
}