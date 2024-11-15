import { signOut, useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import React, { useState } from 'react'
import { LogOut } from "lucide-react"

export default function Header() {

  const [dropdownOpen, setDropdownOpen] = useState(false)
  const { data: session } = useSession()

  return (
    <div className='px-10 py-5 border-b bg-mainDarker flex justify-between'>
      <h1 className='font-bold text-2xl'>Sofa AI</h1>
      <div className='relative'>
        {session ? (
          <div className='flex items-center'>
            <Image
              src={session.user?.image ?? ""}
              alt='User Image'
              width={35}
              height={35}
              className='rounded-full cursor-pointer'
              onClick={() => setDropdownOpen(!dropdownOpen)}
            />
            {dropdownOpen && (
              <div className='absolute right-0 mt-24 w-48 bg-white 
              rounded-md shadow-xl'>
                <button onClick={() => signOut({redirectTo: "/login"})}  
                className='flex px-4 py-2 group 
                text-sm text-gray-700 gap-2 items-center justify-center font-medium'>
                  <LogOut className='w-6 h-6 text-gray-700' />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link href='/login' className='text-white'>Sign In</Link>
        )}
      </div>
    </div>
  )
}

