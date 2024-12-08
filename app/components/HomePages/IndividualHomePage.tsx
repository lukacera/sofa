import React from 'react'
import NextEventsUser from '../HomePageComponents/NextEventsUser';
import { EventsNearYou } from '../HomePageComponents/EventsNearYou';
import { TopicsGrid } from '../HomePageComponents/TopicsGrid';
import { Calendar } from 'lucide-react';
import Link from 'next/link';
import { auth } from '@/auth';
import { EventType } from '@/app/types/Event';
import { headers } from 'next/headers';
import CitySearch from '../HomePageComponents/CitySearch';

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
    return [];
  }

  const data: {
    message: string;
    events: EventType[]
  } = await response.json();

  const { events } = data;
  return events
}

export default async function IndividualHomePage() {
    const session = await auth();
    const nextEvents = await getUpcomingEvents(session?.user.email ?? "");

    return (
      <main className="text-center mx-auto">
        <section className="p-10 pt-20 bg-secondary text-white">
          <div className='w-[95%] mx-auto flex justify-between'>
            <div className="flex flex-col items-start gap-2">
              <h2 className="font-bold text-3xl">
                Welcome back, {session?.user?.name}!
              </h2>
              {nextEvents.length > 0  ?
                <span className='text-lg'>
                  You have
                  <span className="font-bold mx-2">{nextEvents.length}</span>
                  {nextEvents.length === 1 ? "event" : "events"} to attend this month! 🎉
                </span>
                :
                <span>
                  You have no upcoming events.
                </span>
              }
            </div>
            <Link href={"/my-calendar"}
              className="border p-2 border-transparent rounded-lg
              font-bold text-black flex items-center gap-2 bg-white
              transition-colors duration-300 hover:bg-primary
              hover:text-white hover:border-secondary">
              <Calendar size={24} />
              <span>My Calendar</span>
            </Link>
          </div>
        </section>

        {/* New City Input Section */}
        <section className='w-[75%] mx-auto'>
          <CitySearch />
          <NextEventsUser nextEvents={nextEvents}/>
          <EventsNearYou />
          <section className="flex flex-col gap-10 mt-20">
            <div className="flex flex-col items-center gap-5">
              <h2 className="font-bold text-2xl mb-5">Topics you might like</h2>
              <TopicsGrid />
            </div>
          </section>
        </section>
      </main>
    );
}