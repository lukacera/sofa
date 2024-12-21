"use client"
import { signOut, useSession } from "next-auth/react"
import Link from "next/link"
import React, { useState } from "react"
import { Home, Calendar, Menu, X, Plus, ChevronDown, MicVocal } from "lucide-react"
import { usePathname } from "next/navigation"
import { CldImage } from "next-cloudinary"

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { data: session, status } = useSession()
  const pathname = usePathname()
  const isLoading = status === "loading"
  
  const navLinks = [
    { name: "Home", href: "/home", icon: Home },
    { name: "Events", href: "/events", icon: MicVocal },
    ...(session?.user.role === "individual" ? [{
      name: "Calendar",
      href: "my-calendar", 
      icon: Calendar
    }] : [])
  ]

  return (
    <header className="bg-secondary w-full ">
      <div className="max-w-[90%] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="w-[140px]">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-2xl font-bold bg-gradient-to-r from-white to-gray-100 text-transparent bg-clip-text 
                hover:opacity-80 transition-opacity">
                Sofa AI
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex flex-1 items-center justify-center">
            <div className="flex items-center space-x-8">
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
            </div>
          </nav>

          {/* Desktop Profile & Mobile Menu Toggle */}
          <div className="w-[140px] flex items-center justify-end space-x-4">
            {isLoading ? (
              <div className="flex items-center space-x-4 relative">
                <div className="md:block hidden absolute top-1 -left-44 w-[10rem] h-9 bg-accent/40 animate-pulse rounded-lg"></div>
                <div className="w-10 h-10 rounded-full bg-gray-300/60 animate-pulse md:block hidden"></div>
                <div className="w-4 h-4 bg-gray-300/60 animate-pulse md:block hidden"></div>
              </div>
            ) : (
              <>
                {/* Desktop Profile */}
                {session && (
                  <div className="relative hidden md:block">
                    <button
                      onClick={() => setMenuOpen(!menuOpen)}
                      className="flex items-center space-x-2 focus:outline-none w-full"
                    >
                      <div className="w-10 aspect-square rounded-full relative">
                        <CldImage
                          src={session.user?.image ?? "https://res.cloudinary.com/dluypaeie/image/upload/v1732538732/Avatars_Circles_Glyph_Style_nrein3.jpg"}
                          alt="Profile"
                          fill
                          className="rounded-full ring-2 ring-white/30 
                          hover:ring-white/50 transition-all object-cover"
                        />
                      </div>
                      <ChevronDown
                        className={`w-4 h-4 text-white transition-transform 
                          duration-200 ${menuOpen ? "rotate-180" : ""}
                        `}
                      />
                    </button>

                    {session.user.role === "company" && (
                      <Link 
                        href="/create-event"
                        className="absolute top-1 right-24 px-3 p-2 bg-accent 
                        rounded-lg text-sm font-medium text-white 
                        hover:bg-accent/90 transition-all duration-200 
                        flex items-center gap-1 w-[10rem]"
                      >
                        <Plus size={14} />
                        <span>Create new event</span>
                      </Link>
                    )}

                    {menuOpen && (
                      <div className="absolute right-0 mt-2 w-48 
                      bg-white rounded-lg shadow-xl py-1 z-50 ring-black ring-opacity-5">
                        <div className="px-4 py-2 border-b">
                          <p className="text-sm font-medium text-gray-900">{session.user?.name}</p>
                          <p className="text-xs text-gray-500">{session.user?.email}</p>
                          <p className="text-xs text-gray-500 mt-2 text-center font-semibold">
                            {session.user?.role.charAt(0).toUpperCase() + session.user.role.slice(1)} profile
                          </p>
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
                )}

                {!session && (
                  <Link
                    href="/login"
                    className="text-white hover:text-gray-200 transition-colors text-sm font-medium hidden md:block"
                  >
                    Sign In
                  </Link>
                )}

                {/* Mobile Menu Button */}
                <button
                  className="md:hidden p-2 rounded-md text-gray-200 hover:text-white hover:bg-primary/20
                    focus:outline-none"
                  onClick={() => setMenuOpen(!menuOpen)}
                >
                  {menuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-secondary border-primary/20 shadow-xl">
          {session && (
            <div className="px-4 py-3 border-b border-primary/20">
              <div className="px-4 py-2">
                <p className="text-sm font-medium text-white">{session.user?.name}</p>
                <p className="text-xs text-gray-300">{session.user?.email}</p>
                <p className="text-xs text-gray-300 mt-2 text-center font-semibold">
                  {session.user?.role.charAt(0).toUpperCase() + session.user.role.slice(1)} profile
                </p>
              </div>
              
            </div>
          )}

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
            <Link
                href="/profile"
                className="block px-4 py-2 text-base text-gray-200 
                hover:text-white hover:bg-primary/20 rounded-md"
                onClick={() => setMenuOpen(false)}
              >
                Profile
              </Link>
              {session?.user.role === "company" && (
                <Link
                  href="/create-event"
                  className="block px-4 py-2 text-base
                  text-gray-200 hover:text-white hover:bg-primary/20 rounded-md"
                  onClick={() => setMenuOpen(false)}
                >
                  Create new event
                </Link>
              )}
              <button
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="block w-full text-left px-4 py-2 text-base 
                text-red-400 hover:text-red-300 hover:bg-primary/20 rounded-md"
              >
                Sign out
              </button>
            {!session && (
              <Link
                href="/login"
                className="flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium
                  text-gray-200 hover:text-white hover:bg-primary/20 transition-all duration-200"
                onClick={() => setMenuOpen(false)}
              >
                <span>Sign In</span>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  )
}