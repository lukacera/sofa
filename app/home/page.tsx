"use client"
import React from 'react'
import Header from '../components/Header'
import { CldImage } from 'next-cloudinary'
import { Calendar } from 'lucide-react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'

const SingleEvent = () => {
  return (
    <Link href={`/event`} 
    className='p-5 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300'>
      <CldImage
      alt="Sample image"
      src="cld-sample-2" // Use this sample image or upload your own via the Media Explorer
      width="500" // Transform the image: auto-crop to square aspect_ratio
      height="500"
      crop={{
        type: 'auto',
        source: true
      }}
    />
      <h3 className='font-bold text-xl'>
        Hackaton, Barcelona
      </h3>
      <p className=''>
        12th of August
      </p>
    </Link>
  )
}

export default function Page() {
  
  const { data: session } = useSession()

  console.log(session)
  return (
    <div className='max-w-screen bg-mainWhite'>
        <Header />
        <main className='text-center p-20'>
          <section className='p-10 bg-gradient-to-r from-main to-secondary rounded-lg
          flex justify-between'>
              <div className='flex flex-col items-start gap-2'>
                <h2 className='font-bold text-2xl'>
                  Welcome back, Luka!
                </h2>
                <span>
                  You have 3 events to attend this month! 🎉
                </span>
              </div>
              <button className='border p-2 border-transparent rounded-lg 
              font-bold text-black flex items-center gap-2 bg-white'>
                <Calendar size={24} />
                <span>My Calendar</span>
              </button>
          </section>
          <section className='mt-20'>
            <div className='flex flex-col items-center'>
              <h2 className='font-bold text-2xl mb-5'>
                Your upcoming events
              </h2>
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'>
                <SingleEvent />
                <SingleEvent />
                <SingleEvent />
              </div>
            </div>
          </section>
          <section className='grid grid-cols-2 gap-10 mt-20'>
            <div className='flex flex-col items-center'>
              <h2 className='font-bold text-2xl mb-5'>
                Most popular events today
              </h2>
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'>
                <SingleEvent />
                <SingleEvent />
                <SingleEvent />
              </div>
            </div>
            <div className='flex flex-col items-center'>
              <h2 className='font-bold text-2xl mb-5'>
                You might like
              </h2>
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'>
                <SingleEvent />
                <SingleEvent />
                <SingleEvent />
              </div>
            </div>
          </section>
          
          <button className='bg-secondaryDarker text-mainWhite py-3 font-bold rounded-xl
          grid place-items-center w-[40%] mx-auto mt-12 text-2xl'>
            Check out all events
          </button>

          <section className='mt-20'>
            <h2 className='font-bold text-2xl mb-5'>
              Near you
            </h2>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'>
              <SingleEvent />
              <SingleEvent />
              <SingleEvent />
            </div>
          </section>
        </main>
    </div>
  )
}
