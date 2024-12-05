"use client"
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Clock, Heart, Bookmark, MapPin, TagIcon, Users } from 'lucide-react';
import { CldImage } from 'next-cloudinary';
import { AIAnalysis } from '@/app/components/SingleEventComponents/AiAnalysis';
import ConfirmationModal from '@/app/components/SingleEventComponents/EventRegistrationConfirmation';
import { baseURL } from '@/app/constants/apiURL';
import { EventType } from '@/app/types/Event';
import { useSession } from 'next-auth/react';

export default function EventPage() {
  
  const params = useParams();
  const {data: session} = useSession();
  const [event, setEvent] = useState<EventType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const amIRegistered = event?.attendees?.some((attendee) => attendee._id === session?.user.id);

  useEffect(() => {
    async function fetchEvent() {
      try {
        const response = await fetch(`${baseURL}/events/${params.id}`);
        const data = await response.json();
        if (!response.ok) throw new Error('Failed to fetch event');
        setEvent(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error fetching event');
      } finally {
        setLoading(false);
      }
    }

    if (params.id) {
      fetchEvent();
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="flex-grow flex flex-col items-center justify-center gap-2">
        <div className="text-2xl font-semibold text-gray-700">Event not found</div>
        <p className="text-gray-500">The event you&apos;re looking for doesn&apos;t exist or has been removed.</p>
      </div>
    );
  }

  return (
    <main className="w-[75%] mx-auto px-4 sm:px-6 lg:px-8 mt-10">
      <section>
        <div className="grid lg:grid-cols-[40%_50%] gap-6">
          {/* Left Column */}
          <div className="flex flex-col h-full">
            {/* Title and Actions */}
            <div className="space-y-4">
              <div className="flex justify-between items-start gap-3">
                <h1 className="text-3xl font-bold text-gray-900 
                leading-tight max-w-[80%] break-words">
                  {event.title}
                </h1>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => setIsLiked(!isLiked)}
                    className={`flex items-center justify-center p-2 rounded-full transition-all duration-300 hover:scale-105 ${
                      isLiked 
                        ? 'bg-rose-100 text-rose-500 shadow-rose-100/50 shadow-sm' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <Heart size={18} className={`${isLiked ? 'fill-current' : ''} transition-all duration-300`} />
                  </button>
                  <button
                    onClick={() => setIsSaved(!isSaved)}
                    className={`flex items-center justify-center p-2 rounded-full transition-all duration-300 hover:scale-105 ${
                      isSaved 
                        ? 'bg-blue-100 text-blue-500 shadow-blue-100/50 shadow-sm' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <Bookmark size={18} className={`${isSaved ? 'fill-current' : ''} transition-all duration-300`} />
                  </button>
                </div>
              </div>

              {/* Organizer */}
              <div className="flex items-center gap-3 p-2">
                <div className="relative w-10 aspect-square rounded-full overflow-hidden ring-1 ring-gray-200">
                  <CldImage
                    alt={`${event.organizer.name} profile`}
                    src={event.organizer.image || event.image}
                    fill
                    priority
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Organized by</p>
                  <h3 className="font-medium text-gray-900">{event.organizer.name}</h3>
                </div>
              </div>

              {/* Date and Location */}
              <div>
                <div className="flex items-center gap-2 p-2">
                  <Clock size={18} className="text-gray-500" />
                  <div>
                    <p className="text-xs text-gray-500">Date and time</p>
                    <time className="font-medium text-gray-900 text-sm">
                      {new Date(event.date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: 'numeric',
                        minute: 'numeric',
                      })}
                    </time>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 p-2">
                  <MapPin size={18} className="text-gray-500" />
                  <div>
                    <p className="text-xs text-gray-500">Location</p>
                    <p className="font-medium text-gray-900 text-sm">
                      {event.location.city}, {event.location.country}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 my-2">
              {event.tags?.map((tag, i) => (
                <div
                  key={i}
                  className="flex items-center gap-1.5 bg-secondary/10 text-secondary px-3 py-1 rounded-lg
                  transition-all duration-300 hover:bg-secondary hover:text-white cursor-pointer"
                >
                  <TagIcon size={12} />
                  <span className="text-xs font-medium">{tag}</span>
                </div>
              ))}
            </div>

            {/* AI Analysis */}
            <div className="flex-grow">
              <AIAnalysis text={event.aiAnalysis} />
            </div>
          </div>

          {/* Right Column */}
          <div className="flex flex-col h-full gap-5">
            {/* Image Container */}
            <div className="relative flex-grow">
              <div className="absolute inset-0 w-[95%] ml-auto">
                <div className="relative h-full w-full rounded-xl overflow-hidden shadow-md">
                  <CldImage
                    alt={`${event.title} cover image`}
                    src={event.image}
                    fill
                    priority
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
              </div>
            </div>

            {/* Attendees Section */}
            <div className="flex justify-center gap-2 mt-4">
              <div className="flex -space-x-2 overflow-hidden">
                {event.attendees?.slice(0, 5).map((attendee, i) => (
                  <div
                    key={i}
                    className="relative w-8 h-8 rounded-full ring-2 ring-white"
                  >
                    <CldImage
                      alt={`${attendee.name} profile`}
                      src={attendee.image || event.image}
                      fill
                      className="rounded-full object-cover"
                    />
                  </div>
                ))}
              </div>
              {event.attendees?.length > 5 && (
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 ring-2 ring-white">
                  <span className="text-xs font-medium text-gray-600">
                    +{event.attendees.length - 5}
                  </span>
                </div>
              )}
              <div className="flex items-center gap-2 text-gray-600">
                <Users size={16} />
                <span className="text-sm font-medium">
                {event.attendees?.length 
                  ? `${event.attendees.length} ${[1,0].includes(event.attendees.length) ? "person" : "people"} attending` 
                  : 'No one has registered for this event yet'}
                </span>
              </div>
            </div>
            
          </div>          
        </div>

        {/* About Section */}
        <p className="text-gray-600 leading-relaxed text-lg mt-10 break-words">
          {event.description}
        </p>
      </section>
      
              
      {/* Modal */}
      {event && session && session.user.role === "individual" && (
        <div className="mt-16 flex flex-col items-center justify-center">
          {amIRegistered ? (
            <div className="flex flex-col items-center gap-3">
              <div className="text-2xl font-bold mb-2">You&apos;re registered for this event!</div>
              <button
                onClick={() => setShowModal(true)}
                className="flex items-center gap-2 bg-secondary 
                hover:bg-secondary/90 text-white px-8 py-4 rounded-xl font-semibold 
                transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Unregister
              </button>
            </div>
          ) : (
            <>
              <h3 className="text-2xl font-bold text-gray-900 mb-5">Ready to join this event?</h3>
              <button
                onClick={() => setShowModal(true)}
                className="flex items-center gap-2 bg-secondary hover:bg-secondary/90 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Register Now
              </button>
              <p className="mt-4 text-sm text-gray-500">
                {event.capacity - (event.attendees?.length || 0)} spots remaining
              </p>
              <ConfirmationModal
                event={event}
                isOpen={showModal}
                onClose={() => setShowModal(false)}
              />
            </>
          )}
        </div>
      )}
    </main>
  );
}