"use client"
import { Calendar, MapPin, Users } from "lucide-react";
import { CldImage } from "next-cloudinary";
import Link from "next/link";
import { EventType } from "@/app/types/Event"

export const EventCard: React.FC<{ event: EventType }> = ({ event }) => {
    return (
      <Link 
        href={`/event/${event.id}`}
        className="group block overflow-hidden rounded-xl 
        bg-white shadow-md transition-all duration-300 hover:shadow-xl"
      >
        <div className="relative">
          <div className="relative aspect-square overflow-hidden">
            <CldImage
              alt={event.title}
              src={"c8u6st0xrabw2yht5dsi"}
              width={500}
              height={200}
              crop="fill"
              gravity="auto"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/40" />
          </div>
          
          <div className="space-y-3 p-5">
            <h3 className="text-xl text-left font-bold text-gray-900 group-hover:text-blue-600">
              {event.title}
            </h3>
            <div className="flex items-center gap-1 text-gray-500 text-xs">
              <MapPin size={16} className="flex-shrink-0" />
              <span>{event.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 text-gray-600">
                <Calendar size={16} className="flex-shrink-0" />
                <span className="text-sm">{event.date.toDateString()}</span>
              </div>
              
              <div className="h-1 w-1 rounded-full bg-black" />
              
              <div className="flex items-center gap-2 text-gray-600">
                <Users size={16} className="flex-shrink-0" />
                <span className="text-sm">{event.currentAttendees}/{event.maxAttendees}</span>
              </div>
            </div>        
          </div>
        </div>
      </Link>
    );
  };
  