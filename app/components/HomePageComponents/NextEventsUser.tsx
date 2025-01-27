"use client"

import React, { useState } from 'react'
import { EventCard } from './EventCard'
import { EventType } from '@/app/types/Event'
import Link from 'next/link'
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'

type CompProps = {
  nextEvents: EventType[]
}

// Custom hook for responsive breakpoints
const useMediaQuery = (query: string) => {
  const [matches, setMatches] = useState(false)

  React.useEffect(() => {
    const media = window.matchMedia(query)
    if (media.matches !== matches) {
      setMatches(media.matches)
    }

    const listener = () => setMatches(media.matches)
    media.addEventListener('change', listener)
    return () => media.removeEventListener('change', listener)
  }, [matches, query])

  return matches
}

export default function MyComponent({ nextEvents }: CompProps) {
  // Responsive breakpoints
  const isDesktop = useMediaQuery('(min-width: 1024px)')
  const isTablet = useMediaQuery('(min-width: 768px)')
  
  // Calculate events per page based on screen size
  const getEventsPerPage = () => {
    if (isDesktop) return 3
    if (isTablet) return 2
    return 1
  }

  const [currentPage, setCurrentPage] = useState(0)
  const eventsPerPage = getEventsPerPage()
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

  // Reset current page when screen size changes to prevent empty pages
  React.useEffect(() => {
    setCurrentPage(0)
  }, [eventsPerPage])

  return (
    <section className="mt-10 px-4 md:px-6 lg:px-8">
      <div className="flex flex-col items-center gap-5 max-w-7xl mx-auto">
        <h2 className="font-bold text-xl md:text-2xl mb-3 md:mb-5 text-center">
          Your upcoming events
        </h2>
        
        {nextEvents.length > 0 ? (
          <div className="w-full relative">
            <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-10 w-full`}>
              {(nextEvents.length <= eventsPerPage ? nextEvents : getCurrentEvents()).map((event) => (
                <EventCard 
                  key={event._id!} 
                  event={event} 
                  className="w-full mx-auto" // Add responsive width control to EventCard
                />
              ))}
            </div>
            
            {nextEvents.length > eventsPerPage && (
              <>
                {/* Navigation buttons with responsive positioning */}
                <button
                  onClick={handlePrev}
                  className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-8 lg:-translate-x-12 p-2 rounded-full bg-white shadow-md hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-accent"
                  aria-label="Previous events"
                >
                  <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
                </button>
                <button
                  onClick={handleNext}
                  className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-8 lg:translate-x-12 p-2 rounded-full bg-white shadow-md hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-accent"
                  aria-label="Next events"
                >
                  <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
                </button>
                
                {/* Pagination indicators */}
                <div className="flex justify-center gap-2 mt-4 md:mt-6">
                  {Array.from({ length: totalPages }).map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentPage(index)}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        currentPage === index 
                          ? 'bg-accent w-6 md:w-8' 
                          : 'bg-gray-300 w-2 md:w-3'
                      }`}
                      aria-label={`Go to page ${index + 1}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="flex flex-col md:flex-row items-center gap-3 text-center md:text-left">
            <span>You have no upcoming events.</span>
            <Link
              href="/events"
              className="px-3 py-2 rounded-lg bg-accent text-mainWhite flex items-center gap-2 hover:bg-accent/90 transition-colors"
            >
              <span>Explore events</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}