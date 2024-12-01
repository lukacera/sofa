"use client"
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { Loader2, CalendarX, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { EventType } from '@/app/types/Event'
import { EventCard } from '../HomePageComponents/EventCard'

export default function HostedEvents() {
    const { data: session } = useSession()
    const [events, setEvents] = useState<EventType[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        async function fetchEvents() {
            if (!session?.user?.email) return

            try {
                const response = await fetch(`/api/users/hostedEvents/${session.user.email}`)
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
    }, [session?.user?.email])

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
                <p className="mt-2 text-gray-600">You haven&apos;t attended any events yet</p>
                <Link 
                    href="/events" 
                    className="mt-4 px-4 py-2 bg-secondary text-white rounded-xl hover:bg-secondary/80 transition-colors"
                >
                    Browse Events
                </Link>
            </div>
        )
    }

    return (
        <div className="mt-10">
            <h2 className="text-xl font-semibold mb-6">Your hosted events</h2>
            <div className="grid grid-cols-2 gap-6">
                {events.map((event) => (
                    <EventCard event={event} key={event._id}/>
                ))}
            </div>
        </div>
    )
}