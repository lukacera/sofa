import React from 'react';
import { Calendar, Users, FileEdit, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';
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

interface AIInsightsResponse {
 pros: string[];
 cons: string[];
}

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
   totalAttendees
 } = await getHostedEvents(session?.user?.email as string);

 const { pros, cons } = await getAIInsights(session?.user?.email as string);

 return (
    <main className="px-8 mt-10">
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
              <Calendar size={30} className="text-blue-600" />
            </div>
          </div>

          <div className="border border-gray-200 bg-white p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-600 text-sm">Draft Events</p>
                <h3 className="text-3xl font-semibold mt-1">{stats.draftEventsCount}</h3>
              </div>
              <FileEdit size={30} className="text-gray-600" />
            </div>
          </div>

          <div className="border border-gray-200 bg-white p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Attendees</p>
                <h3 className="text-3xl font-semibold mt-1">{totalAttendees}</h3>
              </div>
              <Users size={30} className="text-green-600" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
  <div className="col-span-2 flex flex-col">
    {/* Upcoming Events Container */}
    <div className="border border-gray-200 bg-white mb-8 flex-1">
      <div className="border-b border-gray-200 p-4">
        <h2 className="text-lg font-semibold">
          Upcoming Events
        </h2>
      </div>
      <div className="p-4 overflow-y-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left text-sm text-gray-600">
              <th className="pb-3">Event Name</th>
              <th className="pb-3">Date</th>
              <th className="pb-3">Registered</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {upcomingEvents.length > 0 ? (
              upcomingEvents.map((event: EventType) => (
                <tr key={event._id} className="border-t border-gray-100">
                  <td className="py-3">{event.title}</td>
                  <td>{new Date(event.date).toLocaleDateString()}</td>
                  <td>{event.attendees.length}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="py-6 text-center text-gray-500">
                  No upcoming events scheduled
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>

    {/* Recent Events Container */}
    <div className="border border-gray-200 bg-white flex-1">
      <div className="border-b border-gray-200 p-4">
        <h2 className="text-lg font-semibold">
          Recent Events you hosted
        </h2>
      </div>
      <div className="p-4 overflow-y-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left text-sm text-gray-600">
              <th className="pb-3">Event Name</th>
              <th className="pb-3">Date</th>
              <th className="pb-3">Attendees</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {pastEvents.length > 0 ? (
              pastEvents.map((event: EventType) => (
                <tr key={event._id} className="border-t border-gray-100">
                  <td className="py-3">{event.title}</td>
                  <td>{new Date(event.date).toLocaleDateString()}</td>
                  <td>{event.attendees.length}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="py-6 text-center text-gray-500">
                  No past events to display yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  </div>

  {/* AI Insights */}
  <div className="border border-gray-200 bg-white h-full">
    <div className="border-b border-gray-200 p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">AI Insights</h2>
        <TrendingUp size={30} className="text-blue-600" />
      </div>
    </div>
    <div className="p-4 space-y-6">
      {/* Pros */}
      <div>
        <h3 className="font-medium mb-3">Strengths</h3>
        <ul className="space-y-4">
          {pros.length > 0 ? (
            pros.map((insight, index) => (
              <li key={index} className="flex items-start gap-3 text-sm">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span>{insight}</span>
              </li>
            ))
          ) : (
            <li className="text-gray-500 text-center py-2">No strengths analyzed yet</li>
          )}
        </ul>
      </div>
      
      {/* Cons */}
      <div>
        <h3 className="font-medium mb-3">Areas for Improvement</h3>
        <ul className="space-y-4">
          {cons.length > 0 ? (
            cons.map((insight, index) => (
              <li key={index} className="flex items-start gap-3 text-sm">
                <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <span>{insight}</span>
              </li>
            ))
          ) : (
            <li className="text-gray-500 text-center py-2">No improvements suggested yet</li>
          )}
        </ul>
      </div>
    </div>
  </div>
      </div>
    </div>

      <div className="max-w-[80%] mx-auto mt-12">
        <h2 className="text-xl font-semibold mb-2">Top 3 Events by Attendance</h2>
        <p className="text-gray-600 mb-6">
          Your most successful events based on attendee count. 
          {pastEvents.length > 0 ? (
            <span>
              These events attracted
              <span className='font-bold mx-1'>
                {pastEvents
                  .sort((a, b) => b.attendees.length - a.attendees.length)
                  .slice(0, 3)
                  .reduce((sum, event) => sum + event.attendees.length, 0)
                }
              </span> 
              attendees in total.
            </span>
          ) : null}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pastEvents.length > 0 ? (
            pastEvents
              .sort((a, b) => b.attendees.length - a.attendees.length)
              .slice(0, 3)
              .map((event) => (
                <EventCard key={event._id} event={event} />
              ))
          ) : (
            <div className="col-span-3 text-center text-gray-500 py-8">
              No past events to display in top rankings yet
            </div>
          )}
        </div>
      </div>

      {/* Upcoming Events Section */}
      <div className="max-w-[80%] mx-auto mt-12 mb-12">
        <h2 className="text-xl font-semibold mb-2">Upcoming Events</h2>
        <p className="text-gray-600 mb-6">
          {upcomingEvents.length > 0 ? (
            <>
              You have {upcomingEvents.length} upcoming events with {
                upcomingEvents.reduce((sum, event) => sum + event.attendees.length, 0)
              } registered attendees so far.
            </>
          ) : (
            "You don't have any upcoming events scheduled."
          )}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {upcomingEvents.length > 0 ? (
            upcomingEvents.map((event) => (
              <EventCard key={event._id} event={event} />
            ))
          ) : (
            <div className="col-span-3 text-center text-gray-500 py-8">
              No upcoming events scheduled yet
            </div>
          )}
        </div>
      </div>
    </main>
 );
}