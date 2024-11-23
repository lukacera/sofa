"use client"
import { signIn } from 'next-auth/react';
import Link from 'next/link';

export default function AccountNotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-main/40 p-4">
      <div className="bg-mainWhite p-8 rounded-2xl shadow-xl w-full max-w-md space-y-8">
        <div className="text-center space-y-6">
          <div className="w-20 h-20 bg-yellow-100/50 rounded-full flex items-center justify-center mx-auto">
            <svg 
              className="w-10 h-10 text-yellow-600" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
              />
            </svg>
          </div>
          
          <div>
            <h2 className="text-3xl font-bold text-secondary mb-3">
              Account Not Found
            </h2>
            
            <p className="text-gray-600">
              We couldn&apos;t find an account associated with your Google email. 
              Would you like to create a new account or try a different login method?
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <Link
            href="/register"
            className="block w-full bg-mainDarker text-mainWhite py-4 px-6 rounded-xl
                     hover:bg-secondary transition-colors duration-200 shadow-md 
                     hover:shadow-lg text-center font-medium"
          >
            Create New Account
          </Link>

          <button
            onClick={() => signIn('google', { 
              callbackUrl: '/',
              prompt: "none"
            })}
            className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-xl
                     border border-gray-200 hover:bg-gray-50 transition-colors
                     duration-200 text-gray-700"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Try Different Google Account
          </button>

          <Link
            href="/login"
            className="block w-full text-center py-4 text-gray-600 hover:text-secondary
                     transition-colors duration-200 font-bold"
          >
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}