import { baseURL } from '@/app/constants/apiURL';
import { EventCard } from './EventCard';
import { EventType } from "@/app/types/Event"

async function getEventsNearby() {
  try {
    const response = await fetch(`${baseURL}/events`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch events');
    }
    
    return response.json();
  } catch (error) {
    console.error('Error fetching nearby events:', error);
    return [];
  }
}

export async function EventsNearYou() {
  const events: {events: EventType[]} = await getEventsNearby();
  
  return (
    <div className='flex flex-col items-center mt-20 gap-6'>
      <h2 className='font-bold text-2xl mb-5'>
        Events near you
      </h2>
      <div className='grid grid-cols-3 gap-10 w-full'>
        {events.events.map((event) => (
          <EventCard key={event._id!} event={event} />
        ))}
      </div>
    </div>
  );
}