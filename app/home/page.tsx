import React from "react";
import Header from "../components/Header";
import { ArrowRight, Calendar } from "lucide-react";
import { TopicsGrid } from "../components/HomePageComponents/TopicsGrid";
import { EventsNearYou } from "../components/HomePageComponents/EventsNearYou";
import { auth } from "@/auth";
import Link from "next/link";
import { headers } from "next/headers";
import { EventType } from "../types/Event";
import { EventCard } from "../components/HomePageComponents/EventCard";

async function getUpcomingEvents(email: string): Promise<EventType[]> {
  const headersList = headers();
  const host = (await headersList).get('host');
  const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
  
  const url = `${protocol}://${host}/api/users/upcomingEvents/${encodeURIComponent(email)}`;
  
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


export default async function Page() {
  
  // Fetch session on the server
  const session = await auth();

  const nextEvents = await getUpcomingEvents(session?.user?.email ?? "");

  console.log("Next events:", nextEvents);
  
  return (
    <div className="max-w-screen bg-mainWhite">
      <Header />
      <main className="text-center p-20">
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
          font-bold text-black flex items-center gap-2 bg-white"
          >
            <Calendar size={24} />
            <span>My Calendar</span>
          </Link>
        </section>

        <section className="mt-20">
          <div className="flex flex-col items-center gap-5">
            <h2 className="font-bold text-2xl mb-5">Your upcoming events</h2>
            {nextEvents.length > 0 ? (
              <div className="flex flex-wrap justify-center gap-5">
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
    </div>
  );
}
