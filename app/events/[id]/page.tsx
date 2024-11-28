// app/events/[id]/page.tsx
"use client"

import { useParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import Header from '@/app/components/Header'
import { BookmarkPlus, Clock, Heart, MapPin, TagIcon } from 'lucide-react'
import { CldImage } from 'next-cloudinary'
import TicketSection from '@/app/components/SingleEventComponents/TicketSection'
import { AIAnalysis } from '@/app/components/SingleEventComponents/AiAnalysis'
import { baseURL } from '@/app/constants/apiURL'

interface Event {
  id: string
  title: string
  companyName: string
  date: string
  location: string
  tags: string[]
  imageUrl: string
  description: string
}

export default function EventPage() {
  const params = useParams()
  const [event, setEvent] = useState<Event | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchEvent() {
      try {
        const response = await fetch(`${baseURL}/events/${params.id}`)
        const data = await response.json()
        console.log(data)
        if (!response.ok) throw new Error('Failed to fetch event')
        setEvent(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error fetching event')
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchEvent()
    }
  }, [params.id])

  if (!event) return <div className="min-h-screen flex items-center justify-center">Event not found</div>

  return (
    <div className='min-h-screen max-w-screen'>
      <Header />
      <main className='px-40 w-full h-full'>
        <section className='w-full h-full mt-20'>
          <div className='w-full grid grid-cols-[35%_65%] gap-20'>
            <div className='flex flex-col gap-7'>
              <div className='flex flex-col gap-3'>
                <h1 className='text-4xl font-bold'>
                  {event.title}
                </h1>
                <div className='flex items-center gap-2'>
                  <div className='w-4 aspect-square rounded-full bg-primary'></div>
                  <h3>{event.companyName}</h3>
                </div>

                <div className='flex items-center gap-2'>
                  <div className='flex items-center gap-2 text-sm'>
                    <Clock size={18}/>
                    {event.date}
                  </div>
                  <div className='flex items-center gap-2 text-sm'>
                    <MapPin size={16} className="flex-shrink-0" />
                    <span>{event.location}</span>
                  </div>
                </div>
              </div>

              <div className='flex flex-wrap gap-2'>
                {event.tags.map((tag, i) => (
                  <div key={i} className='flex items-center gap-2 text-white px-3 py-1 rounded-lg bg-secondary'>
                    <TagIcon size={15}/>
                    <h3 className='text-sm'>{tag}</h3>
                  </div>
                ))}
              </div>

              <AIAnalysis />

              <div className='flex items-center gap-4'>
                {/* Like and Save buttons remain unchanged */}
              </div>
            </div>

            <div>
              <div className='w-full h-[27rem] relative rounded-2xl overflow-hidden shadow-lg'>
                <CldImage
                  alt={`${event.title} cover image`}
                  src={event.imageUrl}
                  fill
                  priority
                />
              </div>
            </div>
          </div>

          <div className='mt-16 mb-20'>
            <h2 className='text-2xl font-semibold mb-6 text-center'>
              About This Event
            </h2>
            <div className='space-y-4'>
              <p className='text-gray-700 leading-relaxed'>
                {event.description}
              </p>
            </div>
          </div>
        </section>
        <TicketSection />
      </main>
    </div>
  )
}