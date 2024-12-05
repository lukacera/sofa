"use client";
import React, { useState, FormEvent, useRef, useEffect } from 'react';
import { TimePicker } from '@/app/components/CreateEventComponents/TimePicker';
import { useSession } from 'next-auth/react';
import ImageUpload from '@/app/components/CreateEventComponents/ImageUpload';
import { EventFormData } from '@/app/types/EventForm';
import { TagInput } from '@/app/components/CreateEventComponents/TagsInput';
import { useRouter } from 'next/navigation';

const CreateEventForm = () => {

  const {data: session, status} = useSession()
  const router = useRouter();

  const now = new Date();
  const minutes = now.getMinutes();
  const roundedMinutes = Math.ceil(minutes / 30) * 30;
  now.setMinutes(roundedMinutes);
  now.setSeconds(0);
  now.setMilliseconds(0);

  const [formData, setFormData] = useState<EventFormData>({
    title: '',
    description: '',
    location: {
      address: '',
      city: '',
      country: ''
    },
    date: now.toISOString(),
    capacity: 100,
    image: new File([], 'image'),
    type: 'conference',
    organizer: '',
    status: 'published',
    tags: []
  })

  const [dateValue, setDateValue] = useState(new Date().toISOString().split('T')[0])  
  const [timeValue, setTimeValue] = useState('13:00')
  
  useEffect(() => {
    if (status === 'authenticated' && session?.user?.id) {
      setFormData(prev => ({
        ...prev,
        organizer: session.user.id
      }));
    }
  }, [status, session?.user?.id]);
  
  useEffect(() => {
    if (formData.date) {
      const date = new Date(formData.date)
      setDateValue(date.toISOString().split('T')[0])
      setTimeValue(date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
      }))
    }
  }, [formData.date])

  const getTodayString = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };
  
  const handleDateChange = (date: string, time: string) => {
    const [hours, minutes] = time.split(':');
    const [year, month, day] = date.split('-');
    const dateObj = new Date(
      parseInt(year),
      parseInt(month) - 1,
      parseInt(day),
      parseInt(hours),
      parseInt(minutes)
    );
    setFormData({ ...formData, date: dateObj.toISOString() });
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
  
    try {
      const formDataToSend = new FormData();
      
      // Append the file separately
      formDataToSend.append('image', formData.image as Blob);
      
      const restOfData = {
        ...formData,
        image: undefined // Remove image from the rest of the data
      };
      formDataToSend.append('data', JSON.stringify(restOfData));
  
      const response = await fetch('/api/events', {
        method: 'POST',
        body: formDataToSend
      });
  
      if (!response.ok) {
        throw new Error(`Error: ${response}`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create event');
      console.error('Failed to create event:', err);
    } finally {
      router.push('/profile');
      setIsSubmitting(false);
    }
  };

  const RequiredStar = () => (
    <span className="text-accent ml-1">*</span>
  );

  const dateRef = useRef<HTMLInputElement>(null)

  const inputClasses = `mt-1 block p-3
  border-b border-gray-200 focus:border-black focus:ring-0 focus:outline-none`
  const textareaClasses = `mt-2 w-full rounded-md border-gray-300 border
  shadow-sm focus:border-blue-500 focus:ring-blue-500 p-4`;

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-black">Create New Event</h1>
        <p className="mt-2 text-sm text-gray-600">
          Fill in the details below to create your event. Fields marked with <span className="text-accent">*</span> are required.
        </p>
      </div>

      <form onSubmit={handleSubmit} 
      className="bg-white p-6 rounded-xl shadow-sm space-y-10">
        
        {/* Basic Information */}
        <div className='space-y-10'>
          <h2 className="text-xl font-semibold text-black text-center">Basic Information</h2>
          
          <div className="space-y-4">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm 
              font-medium text-gray-700 ">
                Event Title<RequiredStar />
              </label>
              <input
                type="text"
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className={`${inputClasses} w-full`}
                placeholder="Enter event title"
                required
              />
            </div>
          </div>

          {/* Date, Time, and Event Type */}
          <div className='flex flex-col gap-4'>
            <div className="flex flex-col md:flex-row gap-4">
              {/* Event Type */}
              <div className="flex-1">
                <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                  Event Type<RequiredStar />
                </label>
                <select
                  id="type"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as EventFormData['type'] })}
                  className={`${inputClasses} w-full pb-4 cursor-pointer`} // pb-4 to match the height of input
                >
                  <option value="conference">Conference</option>
                  <option value="workshop">Workshop</option>
                  <option value="meetup">Meetup</option>
                  <option value="seminar">Seminar</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Date */}
              <div className="flex-1">
                <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                  Date<RequiredStar />
                </label>
                <div 
                onClick={() => dateRef.current?.showPicker()}
                className="relative">
                  <input
                    type="date"
                    id="date"
                    ref={dateRef}
                    value={dateValue}
                    min={getTodayString()}
                    onChange={(e) => {
                      // Add validation before handling the date change
                      const selectedDate = new Date(e.target.value);
                      const today = new Date();
                      today.setHours(0, 0, 0, 0); // Reset time part for accurate date comparison
                      
                      if (selectedDate < today) {
                        alert("Please select a future date.");
                        handleDateChange(getTodayString(), timeValue);
                        return;
                      }
                      
                      handleDateChange(e.target.value, timeValue);
                    }}
                    className={`${inputClasses} w-full cursor-pointer`}
                    required
                  />
                </div>
              </div>

              <TimePicker dateValue={dateValue} handleDateChange={handleDateChange}
              timeValue={timeValue}/>
            </div>
          </div>
        </div>

          {/* Tags */}
          <div className='flex flex-col gap-4'>
            <h2 className="block text-sm font-medium text-gray-700">
              Tags<RequiredStar />
            </h2>
            <TagInput setFormData={setFormData} tags={formData.tags}/>
          </div>


        {/* Location */}
        <div className="space-y-6">
          <h2 className="text-xl text-center font-semibold text-black pb-2">
            Location
          </h2>
          
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">
              City<RequiredStar />
              <input
                type="text"
                value={formData.location.city}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  location: { ...formData.location, city: e.target.value }
                })}
                placeholder="e.g. Barcelona"
                className={`${inputClasses} w-full`}
              />
            </label>

            <label className="block text-sm font-medium text-gray-700">
              Country<RequiredStar />
              <input
                type="text"
                value={formData.location.country}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  location: { ...formData.location, country: e.target.value }
                })}
                placeholder="e.g. Spain"
                className={`${inputClasses} w-full`}
              />
            </label>

            <label className="block text-sm font-medium text-gray-700">
              Address<RequiredStar />
              <input
                type="text"
                value={formData.location.address}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  location: { ...formData.location, address: e.target.value }
                })}
                placeholder="e.g. 123 Main Street"
                className={`${inputClasses} w-full`}
              />
            </label>
          </div>
        </div>
        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description<RequiredStar />
          </label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={4}
            minLength={100}
            maxLength={1000}
            className={textareaClasses}
            placeholder="Describe your event (minimum 100 characters and max 1000)"
            required
          />
          <p className={`text-sm mt-1 
            ${formData.description.length < 100 || formData.description.length === 1000 ? 
            'text-red-500' : 'text-gray-500'}`}>
            {formData.description.length} / 1000 characters {formData.description.length < 100 && `(${100 - formData.description.length} more needed)`}
          </p>
        </div>

        <ImageUpload formData={formData} inputClasses={inputClasses}
        setFormData={setFormData}/>

        {/* Submit Button */}
        <div className="pt-6">
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              disabled={isSubmitting}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Save as Draft
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primaryDarker hover:bg-primaryDarker/70"
            >
              Create Event
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateEventForm;