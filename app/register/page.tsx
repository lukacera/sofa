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
        type: userType ?? 'individual',
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
      <div className="min-h-screen flex items-center justify-center bg-main/40">
        <div className="bg-mainWhite p-8 rounded-2xl shadow-xl w-full max-w-2xl 
        space-y-6">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold text-secondary">Join Sofa AI</h2>
            <p className="text-gray-600">Choose how you want to experience our platform</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => setUserType("company")}
              className="p-6 rounded-xl border-2 border-transparent hover:border-secondary/20
                       hover:shadow-lg transition-all duration-200"
            >
              <div className="w-16 h-16 rounded-xl bg-secondary/10 flex items-center 
                            justify-center mb-4 mx-auto">
                <Building2 className="w-8 h-8 text-secondary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Company Account</h3>
              <p className="text-sm text-gray-600">
                Perfect for businesses looking to create and manage events
              </p>
            </button>

            <button
              onClick={() => setUserType("individual")}
              className="p-6 rounded-xl border-2 border-transparent hover:border-secondary/20
                       hover:shadow-lg transition-all duration-200"
            >
              <div className="w-16 h-16 rounded-xl bg-secondary/10 flex items-center 
                            justify-center mb-4 mx-auto">
                <User className="w-8 h-8 text-secondary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Personal Account</h3>
              <p className="text-sm text-gray-600">
                Discover and participate in exciting events around you
              </p>
            </button>
          </div>

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

  return (
    <div className="min-h-screen flex items-center justify-center bg-main/40">
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