import React from 'react'
import Header from '../components/Header'
import EditProfile from '../components/MyProfileComponents/EditProfile'
import { auth } from '@/auth'
import ProfileTabSelector from '../components/MyProfileComponents/ProfileTabSelector'

export default async function page() {

  return (
    <div>
      <Header />
      <main className='w-[70%] mx-auto mt-20'>
        <h1 className='font-bold text-3xl'>Profile Settings</h1>
        <div className='flex gap-20'>
          <ProfileTabSelector />
          <EditProfile />
        </div>
      </main>
    </div>
  )
}