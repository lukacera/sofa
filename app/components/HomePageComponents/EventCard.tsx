"use client"
import { Calendar, MapPin, Users } from "lucide-react";
import { CldImage } from "next-cloudinary";
import Link from "next/link";
import { EventType } from "@/app/types/Event"


interface EventCardProps {
  event: EventType
  className?: string
}

export function EventCard({ event, className = '' }: EventCardProps) {


  const isFinished = new Date(event.date) < new Date();

  return (
    <Link 
      href={`/events/${event._id}`}
      className={`group rounded-lg shadow-xl border w-full`}
    >
      <div className="relative">
        {isFinished && event.status !== "draft" && (
          <div className="absolute top-2 right-2 z-10 bg-accent text-white px-2 py-1 rounded-md 
          text-sm font-semibold">
            Finished
          </div>
        )}
        {event.status === "draft" && (
          <div className="absolute top-2 right-2 z-10 bg-secondary text-white px-2 py-1 rounded-md 
          text-sm font-semibold">
            Draft
          </div>
        )}
        <div className={`relative aspect-square overflow-hidden w-full ${className}`}>
          <CldImage
            alt={event.title}
            src={event.image}
            fill={true}
            className="object-cover rounded-t-lg"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/40" />
        </div>
        
        <div className="space-y-3 p-5">
          <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 truncate">
            {event.title}
          </h3>
          <div className="flex items-center gap-1 text-gray-500 text-sm">
            <MapPin size={16} className="flex-shrink-0" />
            <span className="truncate">{event.location.city}</span>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1 text-gray-600">
              <Calendar size={16} className="flex-shrink-0" />
              <span className="text-sm truncate">{new Date(event.date).toDateString()}</span>
            </div>
            
            <div className="h-1 w-1 rounded-full bg-black flex-shrink-0" />
            
            <div className="flex items-center gap-2 text-gray-600">
              <Users size={16} className="flex-shrink-0" />
              <span className="text-sm truncate">
                {event.attendees.length} / {event.capacity}
              </span>
            </div>
          </div>        
        </div>
      </div>
    </Link>
  );
};