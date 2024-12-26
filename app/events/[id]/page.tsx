"use client"
import React, { useState, useEffect } from 'react';
import { notFound, useParams } from 'next/navigation';
import { Clock, MapPin, TagIcon, Users, Pencil, Calendar } from 'lucide-react';
import { CldImage } from 'next-cloudinary';
import { AIAnalysis } from '@/app/components/SingleEventComponents/AiAnalysis';
import ConfirmationModal from '@/app/components/SingleEventComponents/EventRegistrationConfirmation';
import { EventType } from '@/app/types/Event';
import { useSession } from 'next-auth/react';
import AnimatedEditButton from '@/app/components/SingleEventComponents/AnimatedEditButton';
import EditEventModal from '@/app/components/SingleEventComponents/EditEventModal';
import { useRouter } from 'next/navigation';

export default function EventPage() {
 const params = useParams();
 const router = useRouter();

 const {data: session} = useSession();
 
 const [event, setEvent] = useState<EventType | null>(null);
 const [loading, setLoading] = useState(true);
 const [showModal, setShowModal] = useState(false);
 const [isEditModalOpen, setIsEditModalOpen] = useState(false);

 const amIRegistered = event?.attendees?.some((attendee) => attendee._id === session?.user.id);
 const isEventFinished = new Date(event?.date ?? "") < new Date();
 const usersEvent = session?.user.id === event?.organizer._id;
 const isDraft = event?.status === "draft";

 useEffect(() => {
   async function fetchEvent() {
     try {
        const response = await fetch(`/api/events/${params.id}`);
        const data = await response.json();
        if (!response.ok) throw new Error('Failed to fetch event');
        setEvent(data);
     } catch (err) {
        console.error(err);
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
 
 if (!event || (isDraft && session?.user.id !== event.organizer._id)) {
   notFound();
 }

 return (
   <main className="w-[90%] xl:w-[75%] mx-auto mt-10">
     <section>
       <div className="grid lg:grid-cols-[40%_50%] gap-6">
         <div className="flex flex-col h-full">
           {/* Title and Actions */}
           <div className="space-y-4">
             <div className="flex justify-between items-start gap-3">
               <h1 className="text-3xl font-bold text-gray-900 leading-tight max-w-[80%] break-words">
                 {event.title}
               </h1>
               <div className="flex items-center gap-2 flex-shrink-0">
                 {isDraft && usersEvent ? (
                   <button className="bg-secondary text-white px-2 py-1 rounded-md text-sm font-semibold cursor-auto">
                     Draft
                   </button>
                 ) : !isEventFinished && usersEvent && !isDraft ? (
                   <AnimatedEditButton onClick={() => setIsEditModalOpen(true)} />                    
                 ) : isEventFinished ? (
                   <span className='bg-accent text-white px-2 py-1 rounded-md text-sm font-semibold'>
                     Finished
                   </span>
                 ) : null}
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
                <Calendar size={18} className="text-gray-500" />
                <div>
                  <p className="text-xs text-gray-500">Date</p>
                  <span className="font-medium text-gray-900 text-sm">
                    {new Date(event.date).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 p-2">
                <Clock size={18} className="text-gray-500" />
                <div className='space-y-1'>
                  <div>
                    <p className="text-xs text-gray-500">Time</p>
                    <time className="font-medium text-gray-900 text-sm">
                    {new Date(event.date).toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: false,
                      timeZone: event.timezone || 'UTC',
                      timeZoneName: 'long'
                    })}
                    </time>
                  </div>
                  <p className='text-xs flex gap-1 text-gray-500'>
                    <span>In your local time:</span>
                    <span className='font-medium text-gray-900'>
                        {new Date(event.date).toLocaleString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: false
                        })}
                    </span>
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2 p-2">
                <MapPin size={18} className="text-gray-500" />
                <div>
                  <p className="text-xs text-gray-500">Location</p>
                  <p className="font-medium text-gray-900 text-sm">
                    {event.location.city}, {event.location.country}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {event.location.address}
                  </p>
                </div>
              </div>
            </div>
           </div>

           {/* Tags */}
           <div className="flex flex-wrap gap-1.5 my-2">
             {event.tags?.map((tag, i) => (
               <div
                 onClick={() => router.push(`/events?tag=${tag}`)}
                 key={i}
                 className="flex items-center gap-1.5 bg-secondary/10 text-secondary px-3 py-1 rounded-lg
                 transition-all duration-300 hover:bg-secondary hover:text-white cursor-pointer"
               >
                 <TagIcon size={12} />
                 <span className="text-xs font-medium">{tag}</span>
               </div>
             ))}
           </div>

           {/* AI Analysis or Publish CTA */}
           <div className="flex-grow mt-5">
             {event.status === "draft" ? (
               <div className="border-dashed border-gray-200 text-center">
                 <h3 className="font-semibold">
                   This event is currently a draft
                 </h3>
                 <p className="text-gray-600 text-sm mt-1">
                   Publish your event to make it visible to others.
                 </p>
                 <button
                   onClick={() => setIsEditModalOpen(true)}
                   className="bg-accent hover:bg-accent/80 text-mainWhite font-medium py-3 px-4 
                   rounded-lg transition-all duration-300 flex items-center justify-center gap-2 mx-auto
                   text-sm mt-5"
                 >
                   <Pencil size={14} />
                   Open the edit event modal
                 </button>
               </div>
             ) : (
               <AIAnalysis text={event.aiAnalysis} />
             )}
           </div>
         </div>

         {/* Right Column */}
         <div className="flex flex-col gap-5 lg:ml-10">
           {/* Image Container */}
          <div className="w-full h-auto">
            <div className="w-full rounded-2xl overflow-hidden shadow-lg">
              <div className="relative aspect-[3/2]">
                <CldImage
                  alt={`${event.title} cover image`}
                  src={event.image}
                  fill
                  priority
                  className="object-cover transition-transform duration-700 hover:scale-105"
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
     
     {/* Registration Section */}      
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
     <EditEventModal 
       isOpen={isEditModalOpen}
       onClose={() => setIsEditModalOpen(false)}
       event={event}
     />
   </main>
 );
}