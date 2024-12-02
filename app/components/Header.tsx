"use client"
import { signOut, useSession } from "next-auth/react"
import Link from "next/link"
import React, { useState } from "react"
import { Home, Calendar, Menu, X, Plus, ChevronDown, ChartNoAxesColumnIncreasing } from "lucide-react"
import { usePathname } from "next/navigation"
import { CldImage } from "next-cloudinary"

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { data: session, status } = useSession()
  const pathname = usePathname()
  const isLoading = status === "loading"

  console.log(session)
  const navLinks = [
    { name: "Home", href: "/home", icon: Home },
    { name: "Events", href: "/events", icon: Calendar },
    {
      name: session?.user.role === "individual" ? "Calendar" : "Analytics",
      href: session?.user.role === "individual" ? "my-calendar" : "analytics",
      icon: session?.user.role === "individual" ? Calendar : ChartNoAxesColumnIncreasing,
    },
  ]

  return (
    <header className="bg-secondary shadow-lg w-full">
      <div className="max-w-[90%] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16">
          {/* Logo - Fixed Width */}
          <div className="w-[140px]">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-2xl font-bold bg-gradient-to-r from-white to-gray-100 text-transparent bg-clip-text 
                hover:opacity-80 transition-opacity">
                Sofa AI
              </span>
            </Link>
          </div>

          {/* Desktop Navigation - Centered */}
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

          {/* Right Side Actions - Fixed Width */}
          <div className="w-[140px] flex items-center justify-end space-x-4">
            {!isLoading && (
              <>
                {session && (
                  <div className="relative">
                    {/* Profile Image & Dropdown Button */}
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
                      <ChevronDown
                        className={`w-4 h-4 text-white transition-transform duration-200 ${menuOpen ? "rotate-180" : ""}`}
                      />
                    </button>

                    {/* "Create" Button Positioned Absolute */}
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

                    {/* Dropdown Menu */}
                    {menuOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-50 ring-1 ring-black ring-opacity-5">
                        <div className="px-4 py-2 border-b">
                          <p className="text-sm font-medium text-gray-900">{session.user?.name}</p>
                          <p className="text-xs text-gray-500">{session.user?.email}</p>
                          <p className="text-xs text-gray-500 mt-2 text-center
                          font-semibold">
                            {session.user?.role.charAt(0).toUpperCase() 
                            + session.user.role.slice(1)} profile
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
