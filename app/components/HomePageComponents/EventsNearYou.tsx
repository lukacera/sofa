import { baseURL } from '@/app/constants/apiURL'
import { EventType } from "@/app/types/Event"
import { EventsSlideshow } from './EventsSlideshow'
import { EventCard } from './EventCard'

async function getEventsNearby(): Promise<{ events: EventType[] }> {
  try {
    const response = await fetch(`${baseURL}/events`, {
      cache: 'no-store' // or { next: { revalidate: 60 } } for ISR
    })
    
    if (!response.ok) {
      throw new Error('Failed to fetch events')
    }
    
    return response.json()
  } catch (error) {
    console.error('Error fetching nearby events:', error)
    return { events: [] }
  }
}

export async function EventsNearYou() {
  const { events } = await getEventsNearby()
  
  return (
    <div className='flex flex-col items-center mt-20 gap-6'>
      <h2 className='font-bold text-2xl mb-5'>
        Events near you this month
      </h2>
      {events.length <= 6 ? (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-8 w-full'>
          {events.map((event) => (
            <EventCard key={event._id!} event={event} className='max-h-[20rem]'/>
          ))}
        </div>
      ) : (
        <EventsSlideshow events={events} />
      )}
    </div>
  )
}