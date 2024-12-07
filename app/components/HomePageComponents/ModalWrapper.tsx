"use client";

import { useState } from 'react';
import EventsModal from './EventsModal';
import { EventType } from '@/app/types/Event';
import { ChevronRight } from 'lucide-react';

interface ModalWrapperProps {
  events: EventType[];
  title: string;
}

export default function ModalWrapper({ events, title }: ModalWrapperProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="text-sm text-blue-600 hover:text-blue-700 flex items-center"
      >
        View all <ChevronRight className="h-4 w-4 ml-1" />
      </button>

      <EventsModal
        title={title}
        events={events}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
}