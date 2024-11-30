"use client"
import React, { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { EventType } from '@/app/types/Event';
import { AlertCircle, Calendar } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Header from '@/app/components/Header';

interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end?: string;
  url?: string;
  backgroundColor?: string;
  borderColor?: string;
}

const EventsCalendar = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);

  const { data: session, status } = useSession();
  
  useEffect(() => {
    if (status === 'authenticated') {
      setEmail(session?.user.email);
    }
  }, [status, session?.user.email]);

  useEffect(() => {
    async function fetchUserEvents() {
      try {
        if (!email) return;
        const response = await fetch(`/api/users/${email}`);
        if (!response.ok) throw new Error('Failed to fetch events');
        
        const data = await response.json();
        
        const calendarEvents = data.user.eventsAttending.map((event: EventType) => ({
          id: event._id,
          title: event.title,
          start: new Date(event.date).toISOString(),
          url: `/events/${event._id}`,
          backgroundColor: '#7C3AED',
          borderColor: '#7C3AED'
        }));

        setEvents(calendarEvents);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load events');
      } finally {
        setLoading(false);
      }
    }

    fetchUserEvents();
  }, [session?.user, email]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center h-[calc(100vh-4rem)] text-red-500 gap-2">
          <AlertCircle className="w-5 h-5" />
          <span>{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        {/* Calendar Header */}
        <div className="mb-8 space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">Your Event Calendar</h1>
          <p className="text-gray-600">Manage and view all your upcoming events</p>
        </div>
        
        {/* Calendar Container */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6">
            <style>
              {`
                .fc {
                  font-family: inherit;
                }
                
                .fc .fc-toolbar.fc-header-toolbar {
                  margin-bottom: 2em;
                }
                
                .fc .fc-button {
                  background-color: #fff;
                  border: 1px solid #e5e7eb;
                  color: #374151;
                  padding: 0.5rem 1rem;
                  font-weight: 500;
                  border-radius: 0.5rem;
                  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
                  transition: all 0.2s;
                }
                
                .fc .fc-button:hover {
                  background-color: #f9fafb;
                  border-color: #d1d5db;
                }
                
                .fc .fc-button-primary:not(:disabled).fc-button-active,
                .fc .fc-button-primary:not(:disabled):active {
                  background-color: #7C3AED;
                  border-color: #7C3AED;
                  color: #fff;
                }
                
                .fc-theme-standard td, 
                .fc-theme-standard th {
                  border-color: #f3f4f6;
                }
                
                .fc .fc-daygrid-day.fc-day-today {
                  background-color: #f3f4f6;
                }
                
                .fc-event {
                  border-radius: 4px;
                  padding: 2px 4px;
                  font-size: 0.875rem;
                  border: none;
                  transition: transform 0.2s;
                }
                
                .fc-event:hover {
                  transform: translateY(-1px);
                }
                
                .fc .fc-toolbar-title {
                  font-size: 1.5rem;
                  font-weight: 600;
                  color: #111827;
                }
                
                .fc .fc-col-header-cell {
                  padding: 0.75rem 0;
                  background-color: #f9fafb;
                  font-weight: 600;
                  color: #4b5563;
                }
                
                .fc .fc-daygrid-day-number {
                  color: #374151;
                  padding: 0.5rem;
                  font-size: 0.875rem;
                }
                
                @media (max-width: 640px) {
                  .fc .fc-toolbar {
                    flex-direction: column;
                    gap: 1rem;
                  }
                }
              `}
            </style>
            <FullCalendar
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              headerToolbar={{
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay'
              }}
              events={events}
              eventClick={(info) => {
                info.jsEvent.preventDefault();
                if (info.event.url) {
                  window.location.href = info.event.url;
                }
              }}
              height="auto"
              eventTimeFormat={{
                hour: '2-digit',
                minute: '2-digit',
                meridiem: false
              }}
              slotMinTime="08:00:00"
              slotMaxTime="20:00:00"
              editable={false}
              selectable={true}
              selectMirror={true}
              dayMaxEvents={true}
              views={{
                dayGrid: {
                  dayMaxEvents: 3,
                },
                timeGrid: {
                  dayMaxEvents: true,
                }
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventsCalendar;