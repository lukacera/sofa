import React from 'react';
import { Calendar, Users, FileEdit, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';
import { auth } from '@/auth';
import { EventCard } from '../HomePageComponents/EventCard';
import { EventType } from '@/app/types/Event';
import { EventsTable } from '../HomePageComponents/EventsTable';

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

interface AIInsightsResponse {
 pros: string[];
 cons: string[];
}

async function getHostedEvents(email: string): Promise<HostedEventsResponse> {
 try {
   const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/eventsStats/${email}`, {
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

const getAIInsights = async (email: string): Promise<AIInsightsResponse> => {
 try {
   const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/aiInsights/${email}`);
   
   if (!response.ok) {
     throw new Error('Failed to fetch hosted events');
   }
   
   const data: AIInsightsResponse = await response.json();
   return data
 } catch (error) {
   console.error('Error fetching hosted events:', error);
   return {
     pros: [],
     cons: []
   };
 }
}

export default async function CompanyDashboard() {
  const session = await auth();
  const {
    upcomingEvents,
    pastEvents,
    stats,
    totalAttendees,
    draftEvents
  } = await getHostedEvents(session?.user?.email as string);

  const { pros, cons } = await getAIInsights(session?.user?.email as string);

  return (
    <div className="min-h-screen">
      <main className="px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900">
              Welcome back, {session?.user?.name}
            </h1>
            <p className="mt-2 text-gray-600">
              Here&apos;s what&apos;s happening with your events
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Past Events</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stats.pastEventsCount}</p>
                </div>
                <div className="h-12 w-12 bg-blue-50 rounded-full flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Draft Events</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stats.draftEventsCount}</p>
                </div>
                <div className="h-12 w-12 bg-gray-100 rounded-full flex items-center justify-center">
                  <FileEdit className="h-6 w-6 text-gray-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Attendees</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{totalAttendees}</p>
                </div>
                <div className="h-12 w-12 bg-green-50 rounded-full flex items-center justify-center">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Events Tables Section */}
            <div className="lg:col-span-2 space-y-8">
              {/* Upcoming Events Table */}
              <EventsTable title='Upcoming events' events={upcomingEvents}/>
              <EventsTable title='Recent events' events={pastEvents}/>
            </div>

            {/* AI Insights Section */}
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">AI Insights</h2>
                <TrendingUp className="h-5 w-5 text-blue-600" />
              </div>
              <div className="p-6 space-y-6">
                {/* Strengths */}
                <div>
                  <h3 className="font-medium text-gray-900 mb-4">Strengths</h3>
                  <ul className="space-y-4">
                    {pros.length > 0 ? (
                      pros.map((insight, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-gray-600">{insight}</span>
                        </li>
                      ))
                    ) : (
                      <li className="text-sm text-gray-500 text-center py-2">
                        No strengths analyzed yet
                      </li>
                    )}
                  </ul>
                </div>

                {/* Areas for Improvement */}
                <div>
                  <h3 className="font-medium text-gray-900 mb-4">Areas for Improvement</h3>
                  <ul className="space-y-4">
                    {cons.length > 0 ? (
                      cons.map((insight, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-gray-600">{insight}</span>
                        </li>
                      ))
                    ) : (
                      <li className="text-sm text-gray-500 text-center py-2">
                        No improvements suggested yet
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Top Events Section */}
          <div className="mt-12">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Top Events</h2>
                <p className="mt-1 text-gray-600">
                  Your most successful events based on attendance
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pastEvents.length > 0 ? (
                pastEvents
                  .sort((a, b) => b.attendees.length - a.attendees.length)
                  .slice(0, 3)
                  .map((event) => (
                    <EventCard key={event._id} event={event} />
                  ))
              ) : (
                <div className="col-span-3 text-center py-12 bg-white rounded-lg border border-gray-200">
                  <p className="text-gray-500">No past events to display in top rankings yet</p>
                </div>
              )}
            </div>
          </div>
          <div className="mt-12">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Draft Events</h2>
                <p className="mt-1 text-gray-600">
                  Your draft events that you started but haven&apos;t published yet
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {draftEvents.length > 0 ? (
                draftEvents
                  .sort((a, b) => b.attendees.length - a.attendees.length)
                  .slice(0, 3)
                  .map((event) => (
                    <EventCard key={event._id} event={event} />
                  ))
              ) : (
                <div className="col-span-3 text-center py-12 bg-white rounded-lg border border-gray-200">
                  <p className="text-gray-500">No past events to display in top rankings yet</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}