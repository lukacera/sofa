import React from 'react';
import { Calendar, Users, FileEdit, TrendingUp, AlertCircle } from 'lucide-react';
import Header from "../../components/Header";
import { auth } from '@/auth';
import { EventCard } from '../HomePageComponents/EventCard';
import { EventType } from '@/app/types/Event';

interface HostedEventsResponse {
  upcomingEvents: EventType[];
  pastEvents: EventType[];
  draftEvents: EventType[];
  totalAttendees: number;
  stats: {
    pastEventsCount: number;
    draftEventsCount: number;
    totalAttendees: number;
  };
}

// Type for our getHostedEvents function
async function getHostedEvents(email: string): Promise<HostedEventsResponse> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/hostedEvents/${email}`, {
      cache: 'no-store'
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch hosted events');
    }
    
    const data: HostedEventsResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching hosted events:', error);
    return {
      upcomingEvents: [],
      pastEvents: [],
      draftEvents: [],
      totalAttendees: 0,
      stats: {
        pastEventsCount: 0,
        draftEventsCount: 0,
        totalAttendees: 0
      }
    };
  }
}

export default async function CompanyDashboard() {
  const session = await auth();
  const {
    upcomingEvents,
    pastEvents,
    stats, 
    totalAttendees
  } = await getHostedEvents(session?.user?.email as string);

  console.log(stats)

  const aiInsights: string[] = [
    "Attendance rates are 23% higher for morning events",
    "Technical workshops have shown better engagement rates",
    "Consider adding networking sessions to increase attendance"
  ];

  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-20 px-8">
        <div className="max-w-[80%] mx-auto">
          <h2 className='font-semibold mb-7 text-3xl'>
            {session?.user?.name} events dashboard
          </h2>
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            <div className="border border-gray-200 bg-white p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Past Events</p>
                  <h3 className="text-3xl font-semibold mt-1">{stats.pastEventsCount}</h3>
                </div>
                <Calendar className="text-blue-600" />
              </div>
            </div>

            <div className="border border-gray-200 bg-white p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Draft Events</p>
                  <h3 className="text-3xl font-semibold mt-1">{stats.draftEventsCount}</h3>
                </div>
                <FileEdit className="text-gray-600" />
              </div>
            </div>

            <div className="border border-gray-200 bg-white p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Total Attendees</p>
                  <h3 className="text-3xl font-semibold mt-1">{totalAttendees}</h3>
                </div>
                <Users className="text-green-600" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="col-span-2 border border-gray-200 bg-white">
              <div className="border-b border-gray-200 p-4">
                <h2 className="text-lg font-semibold">
                  Recent Events you hosted
                </h2>
              </div>
              <div className="p-4">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-sm text-gray-600">
                      <th className="pb-3">Event Name</th>
                      <th className="pb-3">Date</th>
                      <th className="pb-3">Attendees</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {pastEvents.map((event: EventType) => (
                      <tr key={event._id} className="border-t border-gray-100">
                        <td className="py-3">{event.title}</td>
                        <td>{new Date(event.date).toLocaleDateString()}</td>
                        <td>{event.attendees.length}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* AI Insights */}
            <div className="border border-gray-200 bg-white">
              <div className="border-b border-gray-200 p-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold">AI Insights</h2>
                  <TrendingUp className="text-blue-600 w-5 h-5" />
                </div>
              </div>
              <div className="p-4">
                <ul className="space-y-4">
                  {aiInsights.map((insight, index) => (
                    <li key={index} className="flex items-start gap-3 text-sm">
                      <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <span>{insight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="max-w-[80%] mx-auto mt-12">
          <h2 className="text-xl font-semibold mb-2">Top 3 Events by Attendance</h2>
          <p className="text-gray-600 mb-6">
            Your most successful events based on attendee count. These events attracted 
            <span className='font-bold mx-1'>
              {
                pastEvents
                  .sort((a, b) => b.attendees.length - a.attendees.length)
                  .slice(0, 3)
                  .reduce((sum, event) => sum + event.attendees.length, 0)
              }
            </span> 
            attendees in total.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pastEvents
              .sort((a, b) => b.attendees.length - a.attendees.length)
              .slice(0, 3)
              .map((event) => (
                <EventCard key={event._id} event={event} />
              ))}
          </div>
        </div>

        {/* Upcoming Events Section */}
        <div className="max-w-[80%] mx-auto mt-12 mb-12">
          <h2 className="text-xl font-semibold mb-2">Upcoming Events</h2>
          <p className="text-gray-600 mb-6">
            You have {upcomingEvents.length} upcoming events with {
              upcomingEvents.reduce((sum, event) => sum + event.attendees.length, 0)
            } registered attendees so far.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingEvents.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}