"use client"
import { signIn } from "next-auth/react";
import { useState, FormEvent, ChangeEvent } from "react";

export default function LoginPage(): JSX.Element {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleEmailSignIn = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await signIn("credentials", {
        email,
        password,
        redirect: true,
        callbackUrl: "/home",
      });
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Setter => set the value of the input field, whichever is passed in the setter function
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>, setter: (value: string) => void): void => {
    setter(e.target.value);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-main/40">
      <div className="bg-mainWhite p-8 rounded-2xl shadow-xl w-full max-w-md space-y-6">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold text-secondary">Welcome back to Sofa AI</h2>
          <p>Sign in to continue to your account</p>
        </div>

        <form onSubmit={handleEmailSignIn} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium">
              Email address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => handleInputChange(e, setEmail)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 
                      focus:ring-secondary focus:border-secondary"
              placeholder="Enter your email"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => handleInputChange(e, setPassword)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 
                         focus:ring-secondary focus:border-secondary"
              placeholder="Enter your password"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                type="checkbox"
                className="h-4 w-4 text-secondary focus:ring-secondary border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm">
                Remember me
              </label>
            </div>
            <button 
              type="button" 
              className="text-sm text-secondary hover:text-secondary/80"
              onClick={() => signIn('credentials', { callbackUrl: '/forgot-password' })}
            >
              Forgot password?
            </button>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center px-6 py-3 rounded-xl
                     bg-mainDarker text-mainWhite hover:bg-secondary transition-colors
                     duration-200 shadow-md hover:shadow-lg disabled:opacity-50"
          >
            {isLoading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-mainWhite">Or continue with</span>
          </div>
        </div>

        <button
          onClick={() => signIn('google', { callbackUrl: "/home" })}
          type="button"
          className="w-full flex items-center justify-center gap-3 px-6 py-3 rounded-xl
                     bg-mainDarker text-mainWhite hover:bg-secondary transition-colors
                     duration-200 shadow-md hover:shadow-lg"
        >
          <svg className="h-6 w-6" viewBox="0 0 24 24">
            <path
              fill="#fff"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#fff"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#fff"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#fff"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Sign in with Google
        </button>

        <p className="text-center text-sm">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
}