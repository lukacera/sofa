"use client"

import React from 'react'
import Header from '../components/Header'
import { CldImage } from 'next-cloudinary'
import { Calendar, MapPin, Users } from 'lucide-react'
import Link from 'next/link'
import { TopicsGrid } from '../components/HomePageComponents/TopicsGrid'

interface SingleEventProps {
  imageUrl: string;
}

const SingleEvent: React.FC<SingleEventProps> = ({ imageUrl }) => {
  return (
    <Link 
      href={`/event`}
      className="group block overflow-hidden rounded-xl 
      bg-white shadow-md transition-all duration-300 hover:shadow-xl"
    >
      <div className="relative">
        {/* Image container with overlay */}
        <div className="relative aspect-square overflow-hidden">
          <CldImage
            alt="Sample image"
            src={imageUrl}
            width={300}
            height={300}
            crop="fill"
            gravity="auto"
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/40" />
        </div>
        
        {/* Content section */}
        <div className="space-y-3 p-5">
          <h3 className="text-xl text-left 
          font-bold text-gray-900 group-hover:text-blue-600">
            Hackaton, Barcelona
          </h3>
          <div className="flex items-center gap-1 text-gray-500 text-xs">
            <MapPin size={16} className="flex-shrink-0" />
            <span>Barcelona, Spain</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-gray-600">
              <Calendar size={16} className="flex-shrink-0" />
              <span className="text-sm">12th of August</span>
            </div>
            
            {/* Divider dot */}
            <div className="h-1 w-1 rounded-full bg-black" />
            
            <div className="flex items-center gap-2 text-gray-600">
              <Users size={16} className="flex-shrink-0" />
              <span className="text-sm">125/500</span>
            </div>
          </div>        
        </div>
      </div>
    </Link>
  );
};

export default function Page() {
  return (
    <div className='max-w-screen bg-mainWhite'>
      <Header />
      <main className='text-center p-20'>
        <section className='p-10 bg-gradient-to-r from-primaryDarker/30 
        to-secondary rounded-lg flex justify-between'>
          <div className='flex flex-col items-start gap-2'>
            <h2 className='font-bold text-2xl'>
              Welcome back, Luka!
            </h2>
            <span>
              You have <span className='font-bold'>3</span> events to attend this month! 🎉
            </span>
          </div>
          <button className='border p-2 border-transparent rounded-lg 
          font-bold text-black flex items-center gap-2 bg-white'>
            <Calendar size={24} />
            <span>My Calendar</span>
          </button>
        </section>

        <section className='mt-20'>
          <div className='flex flex-col items-center gap-5'>
            <h2 className='font-bold text-2xl mb-5'>
              Your upcoming events
            </h2>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'>
              <SingleEvent imageUrl="cld-sample" />
              <SingleEvent imageUrl="cld-sample-2" />
              <SingleEvent imageUrl="cld-sample-3" />
            </div>
          </div>
        </section>

        <section className='flex flex-col gap-10 mt-20'>
          <div className='flex flex-col items-center gap-5'>
            <h2 className='font-bold text-2xl mb-5'>
              Topics you might like
            </h2>
            <TopicsGrid />
          </div>
          <div className='flex flex-col items-center'>
            <h2 className='font-bold text-2xl mb-5'>
              You might like
            </h2>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'>
              <SingleEvent imageUrl="cld-sample-3" />
              <SingleEvent imageUrl="cld-sample-4" />
              <SingleEvent imageUrl="cld-sample-5" />
            </div>
          </div>
        </section>
        
        <Link 
          href="/events"
          className="group relative mt-12 mx-auto block w-fit overflow-hidden"
        >
          <div className="relative flex items-center justify-center gap-2 rounded-xl 
            bg-secondaryDarker px-8 py-3.5 transition-all duration-300 
            group-hover:bg-opacity-90">
            <span className="font-bold text-xl text-white">
              Discover More Events
            </span>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5 text-white transition-transform duration-300 
                group-hover:translate-x-1" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M13 7l5 5m0 0l-5 5m5-5H6" 
              />
            </svg>
          </div>
        </Link>

        <section className='mt-20'>
          <h2 className='font-bold text-2xl mb-5'>
            Near you
          </h2>
        </section>
      </main>
    </div>
  )
}