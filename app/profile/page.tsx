import React from 'react'
import Header from '../components/Header'
import { Calendar, ShieldAlert, Settings } from 'lucide-react'
import EditProfile from '../components/MyProfileComponents/EditProfile'
import { auth } from '@/auth'

export default async function page() {
  const session = await auth()

  return (
    <div>
      <Header />
      <main className='w-[70%] mx-auto mt-20'>
        <h1 className='font-bold text-3xl'>Profile Settings</h1>
        <div className='flex gap-20'>
          <ul className='mt-10 space-y-4 text-nowrap'>
            <li className='flex items-center gap-2 text-gray-700 font-bold cursor-pointer'>
              <Settings size={20} />
              Personal Information
            </li>
            <li className='flex items-center gap-2 text-gray-700 cursor-pointer'>
              <Calendar size={20} />
              {session?.user.role === "company" ? "Hosted Events" : "Attended Events"}            </li>
            <li className='flex items-center gap-2 text-gray-700 cursor-pointer'>
              <ShieldAlert size={20} />
              Account Security
            </li>
          </ul>
          <EditProfile />
        </div>
      </main>
    </div>
  )
}