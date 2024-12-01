"use client"
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { Loader2, CalendarX, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { EventType } from '@/app/types/Event'
import { EventCard } from '../HomePageComponents/EventCard'

interface EventListProps {
  type: 'hosted' | 'attended'
  gridCols?: number
  showHeader?: boolean
}

export const EventList = ({ type, gridCols = 1, showHeader = true }: EventListProps) => {
  const { data: session } = useSession()
  const [events, setEvents] = useState<EventType[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const isHosted = type === 'hosted'
  const title = isHosted ? 'Your hosted events' : 'Your Attended Events'
  const emptyMessage = isHosted 
    ? "You haven't hosted any events yet"
    : "You haven't attended any events yet"
  const endpoint = isHosted ? 'hostedEvents' : 'attendedEvents'

  useEffect(() => {
    async function fetchEvents() {
      if (!session?.user?.email) return

      try {
        const response = await fetch(`/api/users/${endpoint}/${session.user.email}`)
        if (!response.ok) {
          throw new Error('Failed to fetch events')
        }

        const data = await response.json()
        setEvents(data.events || [])
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
        <Loader2 className="w-8 h-8 text-secondary animate-spin" />
        <p className="mt-2 text-gray-600">Loading your events...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center mt-20">
        <AlertCircle className="w-8 h-8 text-red-500" />
        <p className="mt-2 text-gray-600">Error loading events: {error}</p>
      </div>
    )
  }

  if (events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center mt-20">
        <CalendarX className="w-8 h-8 text-gray-400" />
        <p className="mt-2 text-gray-600">{emptyMessage}</p>
        <Link 
          href="/events" 
          className="mt-4 px-4 py-2 bg-secondary text-white rounded-xl hover:bg-secondary/80 transition-colors"
        >
          Browse Events
        </Link>
      </div>
    )
  }

  const renderEvent = (event: EventType) => {
    if (isHosted) {
      return <EventCard event={event} key={event._id} />
    }

    return (
      <Link 
        href={`/events/${event._id}`}
        key={event._id} 
        className="block bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100"
      >
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-medium text-lg text-gray-900">
              {event.title}
            </h3>
            <p className="text-gray-500 mt-1">
              {new Date(event.date).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
            <p className="text-gray-500 mt-1">
              {event.location}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500 mt-1">
              {event.status === 'published' ? 'Active' : 'Draft'}
            </p>
          </div>
        </div>
        <p className="text-gray-600 mt-3 line-clamp-2">
          {event.description}
        </p>
      </Link>
    )
  }

  return (
    <div className="mt-10">
      {showHeader && <h2 className="text-xl font-semibold mb-6">{title}</h2>}
      <div className={`grid grid-cols-${gridCols} gap-6`}>
        {events.map(renderEvent)}
      </div>
    </div>
  )
}