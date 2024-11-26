"use client"
import { signIn } from "next-auth/react"
import Link from "next/link"
import { useState, FormEvent } from "react"
import { useRouter } from "next/navigation"

export default function LoginPage(): JSX.Element {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError("Invalid email or password")
      } else {
        router.push("/home")
      }
    } catch (error) {
      console.error("An error occurred:", error)
      setError("Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary/40">
      <div className="bg-mainWhite p-8 rounded-2xl shadow-xl w-full max-w-md space-y-6">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold text-secondary">Welcome back to Sofa AI</h2>
          <p>Sign in to continue to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
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
              placeholder="Enter your password"
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
                     bg-secondary text-mainWhite hover:bg-primaryDarker transition-colors
                     duration-200 shadow-md hover:shadow-lg disabled:opacity-50 
                     disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="w-6 h-6 border-2 border-white border-t-transparent 
                            rounded-full animate-spin"/>
            ) : (
              "Sign in"
            )}
          </button>
        </form>

        <div className="text-center text-sm text-gray-600">
          <p>Don&apos;t have an account yet?{" "}
            <Link
              href="/register"
              className="text-secondary hover:text-secondary/80"
            >
              Sign up here
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}