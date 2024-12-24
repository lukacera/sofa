"use client";
import React, { useState, FormEvent, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import ImageUpload from '@/app/components/CreateEventComponents/ImageUpload';
import { EventFormData } from '@/app/types/EventForm';
import { TagInput } from '@/app/components/CreateEventComponents/TagsInput';
import { useRouter } from 'next/navigation';
import { SaveButtons } from '@/app/components/CreateEventComponents/SaveButtons';
import { APIProvider } from '@vis.gl/react-google-maps';
import EnhancedDescriptionInput from '@/app/components/CreateEventComponents/EnchacedDescriptionInput';
import { ErrorDisplay } from '@/app/components/CreateEventComponents/ErrorDisplay';
import { LocationInput } from '@/app/components/CreateEventComponents/LocationInput';
import { handleSubmit } from './utils/handleSubmit';
import BasicInformation from './components/BasicInformation';

export default function CreateEventForm() {
  const {data: session, status} = useSession();
  const router = useRouter();

  const now = new Date();
  const minutes = now.getMinutes();
  const roundedMinutes = Math.ceil(minutes / 30) * 30;
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

  // Separate state for date and time inputs
  const [dateValue, setDateValue] = useState(new Date().toISOString().split('T')[0]);
  const [timeValue, setTimeValue] = useState('13:00');
  
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
    if (formData.date) {
      const date = new Date(formData.date);
      setDateValue(date.toISOString().split('T')[0]);
      setTimeValue(date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
      }));
    }
  }, [formData.date]);

  // Form submission state and handler
  const [error, setError] = useState<string | null>(null);

  const RequiredStar = () => (
    <span className="text-accent ml-1">*</span>
  );

  const inputClasses = `mt-1 block p-3
    border-b border-gray-200 focus:border-black focus:ring-0 focus:outline-none`;
  const textareaClasses = `mt-2 w-full rounded-md border-gray-300 border
    shadow-sm focus:border-blue-500 focus:ring-blue-500 p-4`;

  return (
    <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
      <div className="w-[90%] md:w-[75%] mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-black">Create New Event</h1>
          <p className="mt-2 text-sm text-gray-600">
            Fill in the details below to create your event. Fields marked with <span className="text-accent">*</span> are required.
          </p>
        </div>

        <form onSubmit={(e) => 
        handleSubmit(e, formData.status, formData, setError, setIsCreating,setIsDrafting, isCreating, isDrafting, router)}
        className="bg-white p-6 rounded-xl shadow-sm space-y-10">
          
          <BasicInformation 
            formData={formData} 
            setFormData={setFormData} 
            inputClasses={inputClasses} 
            dateValue={dateValue} 
            timeValue={timeValue}
          />

          <div className='flex flex-col gap-4'>
            <h2 className="block text-sm font-medium text-gray-700">
              Tags<RequiredStar />
            </h2>
            <TagInput setFormData={setFormData} tags={formData.tags}/>
          </div>

          <div className="space-y-6">
            <h2 className="text-xl text-center font-semibold text-black pb-2">
              Location
            </h2>
            
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">
                Search Location<RequiredStar />
                <LocationInput 
                  formData={formData}
                  setFormData={setFormData}
                  inputClasses={inputClasses}
                />
              </label>

              {formData.location.address && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-semibold">Selected Location</h3>
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({
                          ...prev,
                          location: {
                            city: '',
                            country: '',
                            address: ''
                          }
                        }))}
                        className="text-sm text-red-500 hover:text-red-700 transition-colors"
                      >
                        Clear location
                      </button>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm"><span className="font-medium">Address:</span> {formData.location.address}</p>
                      <p className="text-sm"><span className="font-medium">City:</span> {formData.location.city}</p>
                      <p className="text-sm"><span className="font-medium">Country:</span> {formData.location.country}</p>
                    </div>
                  </div>
                )}
            </div>
          </div>

          <EnhancedDescriptionInput
            formData={formData}
            setFormData={setFormData}
            textareaClasses={textareaClasses}
          />

          <ImageUpload 
            formData={formData} 
            inputClasses={inputClasses}
            setFormData={setFormData}
          />
          <ErrorDisplay 
            error={error} 
            onDismiss={() => setError(null)}
          />
          <SaveButtons 
            isCreating={isCreating}
            isDrafting={isDrafting}
            onSave={(status, e) => 
              handleSubmit(e as FormEvent<HTMLFormElement>, formData.status, formData, setError, setIsCreating,setIsDrafting, isCreating, isDrafting, router)}
          />
        </form>
      </div>
    </APIProvider>
  );
}