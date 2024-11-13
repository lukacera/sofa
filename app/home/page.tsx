import React from 'react'
import Header from '../components/Header'

export default function page() {
  return (
    <div className='min-h-screen w-screen bg-mainWhite'>
        <Header />
        <main>
          <section className='m-20 p-10 bg-gradient-to-r from-main to-secondary rounded-lg
          flex justify-between'>
              <div className='flex flex-col items-start gap-2'>
                <h2 className='font-bold text-2xl'>
                  Welcome back, Luka!
                </h2>
                <span>
                  You have 3 events to attend this month! 🎉
                </span>
              </div>
              <button className='border p-2 border-transparent rounded-lg bg-secondaryDarker/50 text-white
              font-medium'>
                Check the calendar
              </button>
          </section>
        </main>
    </div>
  )
}
