"use client"
import React from 'react'
import Header from '../components/Header'
import { Calendar, ShieldAlert, Settings } from 'lucide-react'
import EditProfile from '../components/MyProfileComponents/EditProfile'

export default function page() {
  return (
    <div>
      <Header />
      <main className='w-[60%] mx-auto mt-20'>
        <h1 className='font-bold text-3xl'>My profile</h1>
        <div className='flex gap-20'>
          <ul className='mt-10 space-y-4 text-nowrap'>
            <li className='flex items-center gap-2 text-gray-700 font-bold cursor-pointer'>
              <Settings size={20} />
              Edit my profile
            </li>
            <li className='flex items-center gap-2 text-gray-700 cursor-pointer'>
              <Calendar size={20} />
              Attended events
            </li>
            <li className='flex items-center gap-2 text-gray-700 cursor-pointer'>
              <ShieldAlert size={20} />
              Security
            </li>
          </ul>
          <EditProfile />
        </div>
      </main>
    </div>
  )
}