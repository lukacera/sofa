'use client'

import { useState } from 'react'
import { EventType } from "@/app/types/Event"
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { EventCard } from './EventCard'

type SlideshowProps = {
  events: EventType[]
}

export function EventsSlideshow({ events }: SlideshowProps) {
  const [currentPage, setCurrentPage] = useState(0)
  const eventsPerPage = 6
  const totalPages = Math.ceil(events.length / eventsPerPage)

  const handleNext = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages)
  }

  const handlePrev = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages)
  }

  const getCurrentEvents = () => {
    const start = currentPage * eventsPerPage
    return events.slice(start, start + eventsPerPage)
  }

  return (
    <div className='relative w-full'>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-8 w-full'>
        {getCurrentEvents().map((event) => (
          <EventCard key={event._id!} event={event} className='max-h-[20rem]'/>
        ))}
      </div>
      
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
      <div className="flex justify-center gap-2 mt-8">
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
    </div>
  )
}