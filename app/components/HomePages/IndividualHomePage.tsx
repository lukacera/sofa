import React from 'react'
import NextEventsUser from '../HomePageComponents/NextEventsUser';
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
  return events;
}

export default async function IndividualHomePage() {
    const session = await auth();
    const nextEvents = await getUpcomingEvents(session?.user.email ?? "");

    return (
      <main className="text-center">
        {/* Hero Section */}
        <section className="p-4 sm:p-6 md:p-10 md:pt-20 bg-secondary text-white">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row items-center sm:items-start 
              sm:justify-between gap-6 sm:gap-4">
              {/* Welcome Text */}
              <div className="flex flex-col items-center sm:items-start gap-2 w-full sm:w-auto">
                <h2 className="font-bold text-2xl sm:text-3xl break-words max-w-full">
                  Welcome back, {session?.user?.name}!
                </h2>
                <p className="text-base sm:text-lg">
                  {nextEvents.length > 0 ? (
                    <span>
                      You have
                      <span className="font-bold mx-2">{nextEvents.length}</span>
                      {nextEvents.length === 1 ? "event" : "events"} to attend this month! 🎉
                    </span>
                  ) : (
                    <span>You have no upcoming events.</span>
                  )}
                </p>
              </div>

              {/* Calendar Link */}
              <Link 
                href="/my-calendar"
                className="inline-flex items-center gap-3 px-4 py-2.5 bg-white text-black rounded-lg 
                shadow-sm hover:shadow-md 
                font-medium ring-1 ring-white/10 hover:ring-2 hover:ring-primary/20
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <Calendar className="w-5 h-5" />
                <span>View Calendar</span>
              </Link>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="w-full px-4 sm:px-6 md:px-8 max-w-[90rem] mx-auto">
          <div className="py-6 sm:py-8 md:py-10">
            {/* City Search */}
            <div className="max-w-2xl mx-auto">
              <CitySearch />
            </div>

            {/* Next Events Section */}
            <div className="w-full">
              <NextEventsUser nextEvents={nextEvents}/>
            </div>

            {/* Topics Grid Section */}
            <section className="mt-40">
              <div className="flex flex-col items-center gap-4 sm:gap-6 md:gap-8">
                <h2 className="font-semibold text-xl sm:text-2xl text-center px-4">
                  You might be interested in events with these tags
                </h2>
                <div className="w-full">
                  <TopicsGrid />
                </div>
              </div>
            </section>
          </div>
        </section>
      </main>
    );
}