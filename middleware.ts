import { NextResponse } from 'next/server'
import { auth } from './auth'

export default auth(async (req) => {
  // Only handle redirects for login/register pages
  const authPages = ['/login', '/register']
  const isAuthPage = authPages.some(path => 
    req.nextUrl.pathname.startsWith(path)
  )
  

  return NextResponse.next()
})