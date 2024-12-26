"use client"
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { Loader2, CalendarX, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { EventType } from '@/app/types/Event'
import { EventCard } from '../HomePageComponents/EventCard'

interface EventListProps {
  type: 'hosted' | 'attended' | 'drafts'
  gridCols?: number
  showHeader?: boolean
}

export const EventList = ({ type, gridCols = 1, showHeader = true }: EventListProps) => {
  const { data: session } = useSession()
  const [events, setEvents] = useState<EventType[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const isHosted = type === 'hosted'
  const isAttended = type === 'attended'
  const title = isHosted ? 'Your created events' : isAttended ? 'Events you have registered for' : 'Your Drafts'

  const emptyMessage = isHosted ? "You haven't created any events yet" : 
  isAttended ? "You haven't attended any events yet" : "You haven't created any drafts yet"

  const endpoint = isHosted ? 'hostedEvents' : isAttended ? 'attendedEvents' : 'drafts'

  useEffect(() => {
    async function fetchEvents() {
      if (!session?.user?.email) return

      try {
        const response = await fetch(`/api/users/${endpoint}/${session.user.email}`)
        if (!response.ok) {
          throw new Error('Failed to fetch events')
        }
        const data = await response.json()
        setEvents(data.data || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load events')
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [session?.user?.email, endpoint])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center mt-20">
        <Loader2 className="h-8 w-8 animate-spin text-secondary" />
        <p className="mt-2 text-gray-600">Loading your events...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center mt-20">
        <AlertCircle className="h-8 w-8 text-red-500" />
        <p className="mt-2 text-gray-600">Error loading events: {error}</p>
      </div>
    )
  }

  if (events.length === 0) {
    // First, determine if we should show any action button
    const shouldShowButton = isHosted || isAttended;
    
    // Determine the button text and link based on the conditions
    const buttonConfig = {
      text: isHosted ? 'Create Event' : isAttended ? 'Explore Events' : '',
      href: isHosted ? '/create-event' : isAttended ? '/events' : ''
    };
  
    return (
      <div className="flex flex-col items-center justify-center mt-20">
        <CalendarX className="h-8 w-8 text-gray-400" />
        <p className="mt-2 text-gray-600">{emptyMessage}</p>
        
        {/* Only render the button if we should show it */}
        {shouldShowButton && (
          <Link 
            href={buttonConfig.href}
            className="mt-4 px-4 py-2 bg-secondary text-white rounded-xl 
                     hover:bg-secondary/80 transition-colors"
          >
            {buttonConfig.text}
          </Link>
        )}
      </div>
    );
  }

  return (
    <div className="mt-10">
      {showHeader && <h2 className="text-xl font-semibold mb-6">{title}</h2>}
      <div className={`grid grid-cols-1 lg:grid-cols-${gridCols} gap-6`}>
        {events.map(event => <EventCard className="h-[20rem]" event={event} key={event._id} />)}
      </div>
    </div>
  )
}