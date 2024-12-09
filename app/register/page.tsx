"use client"
import { useState, FormEvent } from "react"
import Link from "next/link"
import { Building2, User, ArrowLeft } from 'lucide-react'
import { UserType } from "../types/User"
import { signIn } from "next-auth/react"

export default function RegisterPage(): JSX.Element {
  const [userType, setUserType] = useState<"company" | "individual" | null>(null)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [name, setName] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")
    
    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long")
      return
    }

    setIsLoading(true)

    try {
      const body: Partial<UserType> = {
        email,
        name,
        role: userType ?? 'individual',
        password
      }

      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      })

      if (!response.ok) {
        const error = await response.json()
        if (error.error === 'User already exists') {
          setError('An account with this email already exists')
          return
        }
        throw new Error('Failed to create account')
      }

      // Automatically sign in the user
      await signIn("credentials", {
        email,
        password,
        redirectTo: "/home"
      })
    } catch (error) {
      console.error('Registration error:', error)
      setError('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (!userType) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-primary/40">
        <div className="relative bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-2xl w-full max-w-2xl mx-4">
          {/* Subtle decorative elements */}
  
          <div className="relative text-center space-y-3 mb-6">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary 
                         bg-clip-text text-transparent">
              Join Sofa AI
            </h2>
            <p className="text-gray-600">Choose your journey with us</p>
          </div>
  
          <div className="relative grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              onClick={() => setUserType("company")}
              className="group p-6 rounded-xl bg-white/50 hover:bg-white transition-all duration-300
                       border border-gray-100 hover:border-secondary/20 hover:shadow-lg
                       transform hover:-translate-y-1"
            >
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-secondary/10 to-secondary/20 
                            flex items-center justify-center mb-4 mx-auto group-hover:scale-110 
                            transition-transform duration-300">
                <Building2 className="w-8 h-8 text-secondary" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-gray-800">Company Account</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Create and manage events
              </p>
            </button>
  
            <button
              onClick={() => setUserType("individual")}
              className="group p-6 rounded-xl bg-white/50 hover:bg-white transition-all duration-300
                       border border-gray-100 hover:border-secondary/20 hover:shadow-lg
                       transform hover:-translate-y-1"
            >
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-secondary/10 to-secondary/20 
                            flex items-center justify-center mb-4 mx-auto group-hover:scale-110 
                            transition-transform duration-300">
                <User className="w-8 h-8 text-secondary" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-gray-800">Personal Account</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Discover amazing events near you
              </p>
            </button>
          </div>
  
          <div className="relative text-center mt-6">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link href="/login" 
                className="text-secondary font-medium hover:text-secondary/80 
                         underline-offset-4 hover:underline transition-all">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    )
  }  
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-primary/40">
      <div className="bg-mainWhite p-8 rounded-2xl shadow-xl w-full max-w-md space-y-6 max-h-[75%]">
        <button
          onClick={() => setUserType(null)}
          className="flex items-center gap-2 text-gray-500 hover:text-secondary 
                   transition-colors duration-200"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to account types</span>
        </button>

        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold text-secondary">Create your account</h2>
          <p className="text-gray-600">
            {userType === "company" 
              ? "Set up your business account" 
              : "Join our community today"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              {userType === "company" ? "Company Name" : "Full Name"}
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none 
                       focus:ring-2 focus:ring-secondary focus:border-transparent"
              placeholder={userType === "company" ? "Enter company name" : "Enter full name"}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none 
                       focus:ring-2 focus:ring-secondary focus:border-transparent"
              placeholder="Enter your email"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none 
                       focus:ring-2 focus:ring-secondary focus:border-transparent"
              placeholder="Create a password"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none 
                       focus:ring-2 focus:ring-secondary focus:border-transparent"
              placeholder="Confirm your password"
            />
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 px-6 py-3 rounded-xl
                     bg-primaryDarker text-mainWhite hover:bg-secondary transition-colors
                     duration-200 shadow-md hover:shadow-lg disabled:opacity-50 
                     disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="w-6 h-6 border-2 border-white border-t-transparent 
              rounded-full animate-spin"/>
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        <div className="text-center text-sm text-gray-600">
          <p>Already have an account?{" "}
            <Link href="/login" className="text-secondary hover:text-secondary/80">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}