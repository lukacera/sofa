import { signOut, useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import React, { useState, useRef, useEffect } from 'react'
import { LogOut, Home, Calendar, Menu, User, X } from "lucide-react"
import { usePathname } from 'next/navigation'

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { data: session, status } = useSession() // Add status from useSession
  const menuRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()
  const isLoading = status === 'loading' // Check if session is loading

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const navLinks = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Events', href: '/events', icon: Calendar },
  ]

  return (
    <div className='px-6 md:px-10 py-5 border-b bg-mainDarker'>
      <div className='flex justify-between items-center'>
        {/* Logo */}
        <Link href="/">
          <h1 className='font-bold text-2xl'>Sofa AI</h1>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className='hidden md:flex items-center gap-8'>
          {navLinks.map((link) => {
            const Icon = link.icon
            const isActive = pathname === link.href
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`flex items-center gap-2 text-lg 
                  ${isActive && 'border-b border-black'}`}
              >
                <Icon size={24} />
                {link.name}
              </Link>
            )
          })}
        </nav>

        {/* Desktop User Menu - Only show when loading is complete */}
        {!isLoading && (
          <>
            {session ? (
              <div className='hidden md:flex items-center gap-3'>
                <Image
                  src={session.user?.image ?? "/default-avatar.png"}
                  alt='User Image'
                  width={35}
                  height={35}
                  className='rounded-full cursor-pointer hover:ring-2 hover:ring-white/50 transition-all'
                  onClick={() => setMenuOpen(!menuOpen)}
                />
              </div>
            ) : (
              <Link 
                href='/login' 
                className='text-white hover:text-gray-200 transition-colors'
              >
                Sign In
              </Link>
            )}
          </>
        )}

        {/* Loading placeholder - Show while session is loading */}
        {isLoading && (
          <div className='hidden md:block w-8 h-8 rounded-full bg-gray-600/20 animate-pulse'></div>
        )}

        {/* Mobile Menu Button */}
        <button 
          className='md:hidden text-white'
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Mobile Menu & Desktop Dropdown */}
        {menuOpen && !isLoading && (
          <div 
            ref={menuRef}
            className='absolute top-0 right-0 mt-16 w-full md:w-64 bg-white rounded-b-lg md:rounded-lg shadow-xl z-50 
              transform origin-top-right transition-all'
          >
            {session && (
              <div className='p-4 border-b'>
                <div className='flex items-center gap-3'>
                  <Image
                    src={session.user?.image ?? "/default-avatar.png"}
                    alt='User Image'
                    width={40}
                    height={40}
                    className='rounded-full'
                  />
                  <div className='flex flex-col'>
                    <span className='font-medium'>{session.user?.name}</span>
                    <span className='text-sm text-gray-500'>{session.user?.email}</span>
                  </div>
                </div>
              </div>
            )}
            
            <div className='py-2'>
              <div className='flex md:hidden flex-col'>
                {navLinks.map((link) => {
                  const Icon = link.icon
                  return (
                    <div key={link.name}>
                      <Link
                        href={link.href}
                        className='flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors'
                      >
                        <Icon size={18} />
                        {link.name}
                      </Link>
                      <div className='my-1 border-t border-gray-100' />
                    </div>
                  )
                })}
              </div>
              {/* Profile Link */}
              {session && (
                <>
                  <Link
                    href="/profile"
                    className='flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors'
                    onClick={() => setMenuOpen(false)}
                  >
                    <User size={18} />
                    My Profile
                  </Link>
                  
                  {/* Divider */}
                  <div className='my-1 border-t border-gray-100' />
                  
                  {/* Sign Out Button */}
                  <button 
                    onClick={() => signOut({callbackUrl: "/login"})}
                    className='flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 
                      hover:bg-gray-100 transition-colors'
                  >
                    <LogOut size={18} />
                    Sign Out
                  </button>
                </>
              )}

              {/* Sign In Link for Mobile */}
              {!session && (
                <Link
                  href='/login'
                  className='flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
                  onClick={() => setMenuOpen(false)}
                >
                  <User size={18} />
                  Sign In
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}