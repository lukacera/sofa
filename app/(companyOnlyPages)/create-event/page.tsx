"use client";
import React, { useState, FormEvent, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { EventFormData } from '@/app/types/EventForm';
import { useRouter } from 'next/navigation';
import { handleSubmit } from './utils/handleSubmit';
import EventForm from '@/app/components/reusable/EventForm';
import { SaveButtons } from '@/app/components/CreateEventComponents/SaveButtons';

export default function CreateEventForm() {
  const {data: session, status} = useSession();
  const router = useRouter();

  const now = new Date();
  const minutes = now.getMinutes();
  const roundedMinutes = Math.ceil(minutes / 30) * 90 ;
  now.setMinutes(roundedMinutes);
  now.setSeconds(0);
  now.setMilliseconds(0);

  // Initialize form state
  const [formData, setFormData] = useState<EventFormData>({
    title: null,
    description: null,
    location: {
      address: null,
      city: null,
      country: null
    },
    date: now.toISOString(),
    capacity: 100,
    image: new File([], 'image'),
    type: 'conference',
    organizer: '',
    status: 'published',
    tags: [],
    imagePreview: null,
    timezone: 'Europe/Berlin'
  });

  const [isCreating, setIsCreating] = useState(false);
  const [isDrafting, setIsDrafting] = useState(false);

  const [dateValue, setDateValue] = useState(new Date().toISOString().split('T')[0]);
  const formattedTime = now
  .toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  })
  .padStart(5, '0'); // Ensure format "HH:mm"

  const [timeValue, setTimeValue] = useState(formattedTime);  

  // Update organizer when session is available
  useEffect(() => {
    if (status === 'authenticated' && session?.user?.id) {
      setFormData(prev => ({
        ...prev,
        organizer: session.user.id
      }));
    }
  }, [status, session?.user?.id]);
  
  // Sync date/time values with form data
  useEffect(() => {
    const date = new Date(formData.date);
    
    // Ensure the time is properly parsed as well
    const [hours, minutes] = timeValue.split(':').map(Number);
    
    date.setHours(hours, minutes, 0, 0); // Set hours and minutes explicitly
    
    setDateValue(date.toISOString().split('T')[0]);
    setTimeValue(date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    }));
  }, [formData.date, timeValue]);

  useEffect(() => {
    console.log(formData.date)
  }, [formData.date])

  // Form submission state and handler
  const [error, setError] = useState<string | null>(null);

  const inputClasses = `mt-1 block p-3
    border-b border-gray-200 focus:border-black focus:ring-0 focus:outline-none`;
  const textareaClasses = `mt-2 w-full rounded-md border-gray-300 border
    shadow-sm focus:border-blue-500 focus:ring-blue-500 p-4`;

  const Buttons: React.FC = () => <SaveButtons 
  setIsCreating={setIsCreating}
  setIsDrafting={setIsDrafting}
  isCreating={isCreating}
  isDrafting={isDrafting}
  setFormData={setFormData}
   onSave={(status, e) => 
   handleSubmit({
      e: e as FormEvent<HTMLFormElement>,
      formData: formData,
      status: status,
      setError: setError,
      setIsCreating: setIsCreating,
      router: router,
      setIsDrafting: setIsDrafting,
    })
  } 
/>

  return (
    <div className='w-[90%] md:w-[75%] mx-auto'>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-black">Create New Event</h1>
        <p className="mt-2 text-sm text-gray-600">
          Fill in the details below to create your event. Fields marked with <span className="text-accent">*</span> are required.
        </p>
      </div>
      <EventForm Buttons={Buttons} dateValue={dateValue}
      error={error} formData={formData} inputClasses={inputClasses}
      isCreating={isCreating} setError={setError} setFormData={setFormData}
      setIsCreating={setIsCreating} setIsDrafting={setIsDrafting} textareaClasses={textareaClasses}
      timeValue={timeValue} 
      onSubmit={(e) => handleSubmit({
        e: e as FormEvent<HTMLFormElement>,
        formData: formData,
        status: "published",
        setError: setError,
        setIsCreating: setIsCreating,
        router: router,
        setIsDrafting: setIsDrafting,
      })}/>
    </div>
  )
}