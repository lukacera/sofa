"use client"
import { signOut, useSession } from 'next-auth/react'
import Link from 'next/link'
import React, { useState } from 'react'
import { LogOut, Home, Calendar, Menu, User, X, Plus, ChevronDown } from "lucide-react"
import { usePathname } from 'next/navigation'
import { CldImage } from 'next-cloudinary'

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [calendarOpen, setCalendarOpen] = useState(false)
  const { data: session, status } = useSession()
  const pathname = usePathname()
  const isLoading = status === "loading"

  const navLinks = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Events', href: '/events', icon: Calendar },
    { name: 'Calendar', href: '/my-calendar', icon: Calendar }
  ]

  return (
    <header className="fixed w-full z-50 bg-secondary shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold bg-gradient-to-r from-white to-gray-100 text-transparent bg-clip-text 
              hover:opacity-80 transition-opacity">
              Sofa AI
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => {
              const Icon = link.icon
              const isActive = pathname === link.href
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium
                    ${isActive 
                      ? 'text-white bg-primary/40' 
                      : 'text-gray-200 hover:text-white hover:bg-primary/20'
                    } transition-all duration-200`}
                >
                  <Icon size={18} />
                  <span>{link.name}</span>
                </Link>
              )
            })}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {!isLoading && (
              <>
                {session?.user.role === 'company' && (
                  <Link 
                    href='/create-event'
                    className="flex items-center space-x-2 px-4 py-2 bg-accent rounded-full text-sm font-medium
                      text-white hover:bg-accent/90 transition-all duration-200 transform hover:scale-105
                      active:scale-95 shadow-md hover:shadow-lg"
                  >
                    <Plus size={16} />
                    <span>Create Event</span>
                  </Link>
                )}

                {session ? (
                  <div className="relative">
                    <button
                      onClick={() => setMenuOpen(!menuOpen)}
                      className="flex items-center space-x-2 focus:outline-none"
                    >
                      <CldImage
                        src={session.user?.image ?? "https://res.cloudinary.com/dluypaeie/image/upload/v1732538732/Avatars_Circles_Glyph_Style_nrein3.jpg"}
                        alt="Profile"
                        width={40}
                        height={40}
                        className="rounded-full ring-2 ring-white/30 hover:ring-white/50 transition-all"
                      />
                      <ChevronDown className={`w-4 h-4 text-white transition-transform duration-200 
                        ${menuOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Dropdown Menu */}
                    {menuOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-50
                        ring-1 ring-black ring-opacity-5">
                        <div className="px-4 py-2 border-b">
                          <p className="text-sm font-medium text-gray-900">{session.user?.name}</p>
                          <p className="text-xs text-gray-500">{session.user?.email}</p>
                        </div>
                        
                        <Link
                          href="/profile"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setMenuOpen(false)}
                        >
                          Profile
                        </Link>
                        
                        <button
                          onClick={() => signOut({ callbackUrl: "/login" })}
                          className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                        >
                          Sign out
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    href="/login"
                    className="text-white hover:text-gray-200 transition-colors text-sm font-medium"
                  >
                    Sign In
                  </Link>
                )}
              </>
            )}

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 rounded-md text-gray-200 hover:text-white hover:bg-primary/20
                focus:outline-none"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon
              const isActive = pathname === link.href
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium
                    ${isActive 
                      ? 'text-white bg-primary/40' 
                      : 'text-gray-200 hover:text-white hover:bg-primary/20'
                    } transition-all duration-200`}
                  onClick={() => setMenuOpen(false)}
                >
                  <Icon size={20} />
                  <span>{link.name}</span>
                </Link>
              )
            })}
          </div>
        </div>
      )}
    </header>
  )
}