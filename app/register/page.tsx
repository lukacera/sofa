"use client"
import { signIn, SignInResponse } from "next-auth/react";
import { useState } from "react";
import { Building2, User, ArrowLeft } from 'lucide-react';
import Link from "next/link";
import { useRouter } from "next/navigation";
import { UserType } from "../types/User";
import { Profile } from "@auth/core/types";

export default function RegisterPage(): JSX.Element {
  const [userType, setUserType] = useState<"company" | "individual" | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleGoogleRegister = async () => {
    try {
      setIsLoading(true);
      // First get Google profile data without redirecting
      const result = await signIn('google', { 
        redirect: false,
      }) as SignInResponse & {
        profile?: Profile
      };
      
      if (result?.error) {
        console.error('OAuth error:', result.error);
        return;
      }

      if (!result?.ok) {
        throw new Error('Failed to get Google profile');
      }

      const body: Partial<UserType> = {
        email: result.profile?.email ?? '',
        name: result.profile?.name ?? '',
        image: result.profile?.picture ?? '',
        type: userType ?? 'individual'
      }

      // Create user through API
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: body ? JSON.stringify(body) : null,
      });

      if (!response.ok) {
        const error = await response.json();
        if (error.error === 'User already exists') {
          router.push('/login?error=account-exists');
          return;
        }
        throw new Error('Failed to create account');
      }

      // If everything succeeded, redirect to home
      router.push('/home');
    } catch (error) {
      console.error('Registration error:', error);
      // Handle error appropriately
    } finally {
      setIsLoading(false);
    }
  };
  if (!userType) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-main/30 to-main/50 p-6">
        <div className="bg-mainWhite p-10 rounded-3xl shadow-2xl w-full max-w-4xl transform transition-all">
          <div className="text-center space-y-6 mb-12">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-secondary to-secondary/70 text-transparent bg-clip-text">
              Join Sofa AI
            </h2>
            <p className="text-gray-600 text-lg">Choose how you want to experience our platform</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <button
              onClick={() => setUserType("company")}
              className="group relative overflow-hidden p-8 rounded-2xl transition-all duration-300
                       hover:shadow-xl bg-white border-2 border-transparent
                       hover:border-secondary/20"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 to-transparent 
                            opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative z-10">
                <div className="w-20 h-20 rounded-2xl bg-secondary/10 flex items-center 
                              justify-center mb-6 group-hover:bg-secondary/20 
                              transition-colors duration-300 mx-auto">
                  <Building2 className="w-10 h-10 text-secondary" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-800">Company Account</h3>
                <p className="text-gray-600 leading-relaxed">
                  Perfect for businesses and organizations looking to create and manage events.
                  Unlock powerful tools for event organization.
                </p>
              </div>
            </button>

            <button
              onClick={() => setUserType("individual")}
              className="group relative overflow-hidden p-8 rounded-2xl transition-all duration-300
                       hover:shadow-xl bg-white border-2 border-transparent
                       hover:border-secondary/20"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 to-transparent 
                            opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative z-10">
                <div className="w-20 h-20 rounded-2xl bg-secondary/10 flex items-center 
                              justify-center mb-6 group-hover:bg-secondary/20 
                              transition-colors duration-300 mx-auto">
                  <User className="w-10 h-10 text-secondary" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-800">Personal Account</h3>
                <p className="text-gray-600 leading-relaxed">
                  Discover and participate in exciting events around you.
                  Connect with your community and explore new experiences.
                </p>
              </div>
            </button>
          </div>

          <div className="mt-12 text-center">
            <p className="text-gray-600">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-secondary font-semibold hover:text-secondary/80 
                         transition-colors duration-200"
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-main/30 to-main/50 p-6">
      <div className="bg-mainWhite p-8 rounded-3xl shadow-2xl w-full max-w-md transform transition-all">
        <button
          onClick={() => setUserType(null)}
          className="group flex items-center gap-2 text-gray-500 hover:text-secondary 
                   transition-colors duration-200 mb-8"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" />
          <span className="text-sm font-medium">Choose different account type</span>
        </button>

        <div className="text-center space-y-4 mb-8">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-secondary to-secondary/70 
                       text-transparent bg-clip-text">
            {userType === "company" ? "Company Registration" : "Personal Registration"}
          </h2>
          <p className="text-gray-600">
            {userType === "company" 
              ? "Create your business account to start organizing events"
              : "Join our community to discover amazing events"}
          </p>
        </div>

        <button
          onClick={() => handleGoogleRegister()}
          type="button"
          className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-xl
                   bg-mainDarker text-mainWhite hover:bg-secondary transition-all
                   duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
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
          Continue with Google
        </button>

        <div className="mt-8 text-center">
          <p className="text-gray-600">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-secondary font-semibold hover:text-secondary/80 
                       transition-colors duration-200"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}