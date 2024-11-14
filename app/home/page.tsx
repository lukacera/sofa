import React from 'react'
import Header from '../components/Header'
import { connectToDB } from '../utils/connectWithDB'

const SingleEvent = () => {
  return (
    <div className='p-5 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300'>
      <h3 className='font-bold text-xl'>
        Hackaton, Barcelona
      </h3>
      <p className=''>
        12th of August
      </p>
    </div>
  )
}

export default function page() {
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
              <button className='border p-2 border-transparent rounded-lg bg-secondaryDarker/50 
              font-medium'>
                Check the calendar
              </button>
          </section>
          <section className='mt-20'>
            <h2 className='font-bold text-2xl mb-5'>
              Your upcoming events
            </h2>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'>
              <SingleEvent />
              <SingleEvent />
              <SingleEvent />
            </div>
          </section>
          <section className='mt-20'>
            <h2 className='font-bold text-2xl mb-5'>
              Most popular events today
            </h2>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'>
              <SingleEvent />
              <SingleEvent />
              <SingleEvent />
            </div>
          </section>
          <section className='mt-20'>
            <h2 className='font-bold text-2xl mb-5'>
              You might like
            </h2>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'>
              <SingleEvent />
              <SingleEvent />
              <SingleEvent />
            </div>
          </section>
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
