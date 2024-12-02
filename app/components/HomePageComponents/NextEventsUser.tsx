import React from 'react'
import { EventCard } from './EventCard';
import { headers } from 'next/headers';
import { EventType } from '@/app/types/Event';
import { auth } from '@/auth';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

async function getUpcomingEvents(email: string): Promise<EventType[]> {
    const headersList = headers();
    const host = (await headersList).get('host');
    const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
    
    const url = `${protocol}://${host}/api/users/upcomingEvents/${email}`;
    
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
  
    if (!response.ok) {
      throw new Error('Failed to fetch upcoming events');
    }
  
    const data: {
      message: string;
      events: EventType[]
    } = await response.json();
  
    const { events } = data;
    return events
}

export default async function NextEventsUser() {

    const session = await auth();

    const nextEvents = await getUpcomingEvents(session?.user?.email ?? "");

    return (
    <section className="mt-20">
        <div className="flex flex-col items-center gap-5">
        <h2 className="font-bold text-2xl mb-5">Your upcoming events</h2>
        {nextEvents.length > 0 ? (
            <div className="grid grid-cols-3 gap-10 w-full">
            {nextEvents.length === 1 && <div></div>}
            {nextEvents.map((event) => (
              <EventCard key={event._id!} event={event} />
            ))}
           </div>
           
        ) :
        <span className="flex items-center gap-3">
            You have no upcoming events. 
            <Link href="/events" className="px-3 py-2 rounded-lg bg-accent
            text-mainWhite flex">
                <span>Explore events</span>
                <ArrowRight size={24} />
            </Link>
        </span>
        }
        
        </div>
    </section>
  )
}
