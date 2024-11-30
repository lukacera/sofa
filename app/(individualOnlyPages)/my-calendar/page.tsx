"use client"
import React, { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { EventType } from '@/app/types/Event';
import { AlertCircle, Calendar, Loader2 } from 'lucide-react';
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
          backgroundColor: '#457b9d',
          borderColor: '#457b9d'
        }));

        setEvents(calendarEvents);
      } catch (err) {
        console.log(err);
        setError(err instanceof Error ? err.message : 'Failed to load events');
      } finally {
        setLoading(false);
      }
    }

    fetchUserEvents();
  }, [session?.user, email]);

  if (loading) {
    return (
      <div className="min-h-screen bg-mainWhite">
        <Header />
        <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)] gap-4">
          <Loader2 className="w-8 h-8 text-secondary animate-spin" />
          <p className="text-gray-600">Loading your events...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-mainWhite">
        <Header />
        <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)] gap-3">
          <div className="flex items-center gap-2 text-accent">
            <AlertCircle className="w-6 h-6" />
            <span className="font-medium">Error loading calendar</span>
          </div>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-mainWhite">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 pb-12">
        {/* Calendar Header */}
        <div className="mb-8 space-y-2">
          <h1 className="text-3xl font-bold text-primaryDarker">Your Event Calendar</h1>
          <p className="text-gray-600">Track and manage your upcoming events in one place</p>
        </div>
        
        {/* Calendar Container */}
        <div className="bg-white rounded-xl shadow-sm border border-primary/20 overflow-hidden backdrop-blur-sm">
            <div className="p-6">
            <style>
              {`
              .fc {
                font-family: inherit;
                --fc-border-color: #a8dadc20;
                --fc-today-bg-color: #a8dadc10;
              }
              
              .fc .fc-toolbar.fc-header-toolbar {
                margin-bottom: 2em;
                padding: 0 0.5rem;
              }
              
              .fc .fc-toolbar-title {
                font-size: 1.25rem;
                font-weight: 600;
                color: #1d3557;
              }
              
              .fc .fc-button {
                background: white;
                border: 1px solid #a8dadc50;
                color: #457b9d;
                padding: 0.625rem 1rem;
                font-weight: 500;
                border-radius: 0.75rem;
                box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
                transition: all 0.2s ease;
              }
              
              .fc .fc-button:hover {
                background-color: #f8fafc;
                border-
                  color: #1d3557;
                }
                
                .fc .fc-button-primary:not(:disabled).fc-button-active,
                .fc .fc-button-primary:not(:disabled):active {
                  background-color: #457b9d;
                  border-color: #457b9d;
                  color: white;
                }
                
                .fc .fc-col-header-cell {
                  padding: 1rem 0;
                  background-color: #a8dadc10;
                  font-weight: 600;
                  color: #1d3557;
                }
                
                .fc .fc-daygrid-day-number {
                  color: #457b9d;
                  padding: 0.75rem;
                  font-size: 0.875rem;
                  font-weight: 500;
                }
                
                .fc .fc-daygrid-day.fc-day-today {
                  background-color: #a8dadc15;
                }
                
                .fc-event {
                  border-radius: 6px;
                  padding: 3px 6px;
                  font-size: 0.875rem;
                  border: none;
                  transition: all 0.2s ease;
                  cursor: pointer;
                }
                
                .fc-event:hover {
                  transform: translateY(-1px) scale(1.02);
                  box-shadow: 0 3px 8px rgba(0,0,0,0.1);
                }
                
                .fc-v-event {
                  border: none;
                  background-color: #457b9d;
                }
                
                .fc .fc-toolbar-chunk {
                  display: flex;
                  gap: 0.5rem;
                  align-items: center;
                }
                
                .fc .fc-day-other .fc-daygrid-day-number {
                  color: #64748b;
                }
                
                .fc-theme-standard td, 
                .fc-theme-standard th {
                  border-color: #a8dadc20;
                }

                @media (max-width: 640px) {
                  .fc .fc-toolbar {
                    flex-direction: column;
                    gap: 1rem;
                    padding: 0;
                  }
                  
                  .fc .fc-toolbar-title {
                    font-size: 1.125rem;
                  }
                  
                  .fc .fc-button {
                    padding: 0.5rem 0.75rem;
                    font-size: 0.875rem;
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
                meridiem: true
              }}
              slotMinTime="00:00:00"
              slotMaxTime="23:30:00"
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