"use client"

import React, { useState } from 'react'
import { EventCard } from './EventCard'
import { EventType } from '@/app/types/Event'
import Link from 'next/link'
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'

type CompProps = {
  nextEvents: EventType[]
}

export default function MyComponent({ nextEvents }: CompProps) {
  const [currentPage, setCurrentPage] = useState(0)
  const eventsPerPage = 3
  const totalPages = Math.ceil(nextEvents.length / eventsPerPage)

  const handleNext = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages)
  }

  const handlePrev = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages)
  }

  const getCurrentEvents = () => {
    const start = currentPage * eventsPerPage
    return nextEvents.slice(start, start + eventsPerPage)
  }

  return (
    <section className="mt-10">
      <div className="flex flex-col items-center gap-5">
        <h2 className="font-bold text-2xl mb-5">Your upcoming events</h2>
        {nextEvents.length > 0 ? (
          <div className="w-full relative">
            <div className="grid grid-cols-3 gap-10 w-full">
              {nextEvents.length <= 3 && nextEvents.length === 1 && <div></div>}
              {(nextEvents.length <= 3 ? nextEvents : getCurrentEvents()).map((event) => (
                <EventCard key={event._id!} event={event} />
              ))}
            </div>
            
            {nextEvents.length > 3 && (
              <>
                <button
                  onClick={handlePrev}
                  className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 p-2 rounded-full bg-white shadow-md hover:bg-gray-50 transition-colors"
                  aria-label="Previous events"
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  onClick={handleNext}
                  className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 p-2 rounded-full bg-white shadow-md hover:bg-gray-50 transition-colors"
                  aria-label="Next events"
                >
                  <ChevronRight size={24} />
                </button>
                <div className="flex justify-center gap-2 mt-6">
                  {Array.from({ length: totalPages }).map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentPage(index)}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        currentPage === index ? 'bg-accent w-6' : 'bg-gray-300'
                      }`}
                      aria-label={`Go to page ${index + 1}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        ) : (
          <span className="flex items-center gap-3">
            You have no upcoming events.
            <Link
              href="/events"
              className="px-3 py-2 rounded-lg bg-accent text-mainWhite flex items-center gap-2"
            >
              <span>Explore events</span>
              <ArrowRight size={24} />
            </Link>
          </span>
        )}
      </div>
    </section>
  )
}