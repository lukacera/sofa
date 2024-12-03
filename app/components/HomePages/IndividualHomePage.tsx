import React from 'react'
import NextEventsUser from '../HomePageComponents/NextEventsUser';
import { EventsNearYou } from '../HomePageComponents/EventsNearYou';
import { TopicsGrid } from '../HomePageComponents/TopicsGrid';
import { Calendar } from 'lucide-react';
import Link from 'next/link';
import { auth } from '@/auth';

export default async function IndividualHomePage() {
    
    const session = await auth();
    return (
      <main className="text-center w-[75%] mx-auto">
        <section
          className="p-10 bg-gradient-to-r from-primaryDarker/30 
        to-secondary rounded-lg flex justify-between"
        >
          <div className="flex flex-col items-start gap-2">
            <h2 className="font-bold text-2xl">
              Welcome back, {session?.user?.name}!
            </h2>
            <span>
              You have <span className="font-bold">3</span> events to attend this month! 🎉
            </span>
          </div>
            <Link href={"/my-calendar"}
            className="border p-2 border-transparent rounded-lg 
            font-bold text-black flex items-center gap-2 bg-white 
            transition-colors duration-300 hover:bg-primary 
            hover:text-white hover:border-secondary"
            >
            <Calendar size={24} />
            <span>My Calendar</span>
            </Link>
        </section>

        <NextEventsUser />
        <EventsNearYou />

        <section className="flex flex-col gap-10 mt-20">
          <div className="flex flex-col items-center gap-5">
            <h2 className="font-bold text-2xl mb-5">Topics you might like</h2>
            <TopicsGrid />
          </div>
          <div className="flex flex-col items-center mt-20 gap-6">
            <EventsNearYou />
          </div>
        </section>
      </main>
  );
}
