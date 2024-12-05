import React from 'react'
import { EventCard } from './EventCard';
import { EventType } from '@/app/types/Event';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

type CompProps = {
  nextEvents: EventType[];
};

export default async function MyComponent({ nextEvents }: CompProps) {

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
