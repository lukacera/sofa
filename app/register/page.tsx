"use client"
import { signIn } from "next-auth/react";
import { useState, FormEvent, ChangeEvent } from "react";
import { Building2, User } from 'lucide-react';
import Link from "next/link";

export default function RegisterPage(): JSX.Element {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [userType, setUserType] = useState<"company" | "individual" | null>(null);

  const handleRegister = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return;
    }
    
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          password,
          userType, // Include the user type in registration data
        }),
      });

      if (response.ok) {
        await signIn("credentials", {
          email,
          password,
          redirect: true,
          callbackUrl: "/home",
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>, setter: (value: string) => void): void => {
    setter(e.target.value);
  };

  if (!userType) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-main/40">
        <div className="bg-mainWhite p-8 rounded-2xl shadow-xl w-full max-w-2xl">
          <div className="text-center space-y-5 mb-8">
            <h2 className="text-3xl font-bold text-secondary">Choose your account type</h2>
            <p>Select how you want to use Sofa AI</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <button
              onClick={() => setUserType("company")}
              className="p-6 border-2 border-gray-200 rounded-xl hover:border-secondary
                         transition-all duration-200 group flex flex-col items-center text-center"
            >
              <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center 
                            justify-center mb-4 group-hover:bg-secondary/20 transition-colors">
                <Building2 className="w-8 h-8 text-secondary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Company</h3>
              <p className="text-sm text-gray-600">
                I want to organize events for my business or organization
              </p>
            </button>

            <button
              onClick={() => setUserType("individual")}
              className="p-6 border-2 border-gray-200 rounded-xl hover:border-secondary
                         transition-all duration-200 group flex flex-col items-center text-center"
            >
              <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center 
                            justify-center mb-4 group-hover:bg-secondary/20 transition-colors">
                <User className="w-8 h-8 text-secondary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Individual</h3>
              <p className="text-sm text-gray-600">
                I want to see events and activities happening around me
              </p>
            </button>
          </div>

          <div className="mt-8 text-center text-sm text-gray-600">
            <p>Already have an account?{" "}
            <Link
                href="/login"
                className="text-secondary hover:text-secondary/80"
            >
                Sign in
            </Link>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-main/40 p-4">
      <div className="bg-mainWhite p-6 rounded-2xl shadow-xl w-full max-w-md">
        <div className="text-center mb-5 flex flex-col gap-2">
          <h2 className="text-2xl font-bold text-secondary">
            Create your {userType === "company" ? "Company" : "Personal"} Account
          </h2>
          <p className="text-gray-600">Sign up to start organizing amazing events</p>
        </div>
  
        <button
          onClick={() => setUserType(null)}
          className="text-xs text-gray-600 hover:text-secondary flex items-center gap-1 mb-4"
        >
          ← Choose different account type
        </button>
  
        <form onSubmit={handleRegister} className="space-y-5">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1">
              {userType === "company" ? "Company Name" : "Full Name"}
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => handleInputChange(e, setName)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 
                      focus:ring-secondary focus:border-secondary"
              placeholder={userType === "company" ? "Enter company name" : "Enter your full name"}
            />
          </div>
  
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
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
  
          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1">
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
              placeholder="Create a password"
            />
          </div>
  
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => handleInputChange(e, setConfirmPassword)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 
                         focus:ring-secondary focus:border-secondary"
              placeholder="Confirm your password"
            />
          </div>
  
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 rounded-lg bg-mainDarker text-mainWhite 
                     hover:bg-secondary transition-colors duration-200 
                     shadow-md hover:shadow-lg disabled:opacity-50"
          >
            {isLoading ? "Creating account..." : "Create account"}
          </button>
        </form>
  
        {/* Simplified divider */}
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="px-2 bg-mainWhite text-gray-500">Or</span>
          </div>
        </div>
  
        <button
          onClick={() => signIn('google', { callbackUrl: "/home" })}
          type="button"
          className="w-full flex items-center justify-center gap-2 py-2 
          rounded-lg bg-mainDarker text-mainWhite hover:bg-secondary 
          transition-colors duration-200 shadow-md hover:shadow-lg text-sm"
        >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
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
            Sign up with Google
        </button>
  
        {/* Footer text */}
        <div className="text-center mt-4 space-y-2">
          <p>Already have an account?{" "}
            <Link href="/login" className="text-secondary hover:text-secondary/80">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}