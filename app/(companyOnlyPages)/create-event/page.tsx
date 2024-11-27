"use client";
import React, { useState, FormEvent, useRef, useEffect } from 'react';
import Header from '@/app/components/Header';
import { TicketsForm } from '@/app/components/CreateEventComponents/TicketsForm';
import { TimePicker } from '@/app/components/CreateEventComponents/TimePicker';

interface Ticket {
  name: string;
  price: number;
  benefits: string[];
  total: number;
}
interface EventFormData {
  title: string;
  description: string;
  datetime: string;
  location: string;
  capacity: number;
  price: number;
  imageUrl: string;
  type: 'conference' | 'workshop' | 'meetup' | 'seminar' | 'other';
  tickets: Ticket[];
}

const CreateEventForm = () => {
  const [formData, setFormData] = useState<EventFormData>({
    title: '',
    description: '',
    datetime: '',
    location: '',
    capacity: 100,
    price: 0,
    imageUrl: '',
    type: 'conference',
    tickets: [   // Initialize with one empty ticket
      {
        name: '',
        price: 0,
        benefits: [''], 
        total: 0
      }
    ]
  });
  const [dateValue, setDateValue] = useState(new Date().toISOString().split('T')[0])  
  const [timeValue, setTimeValue] = useState('')
  
  useEffect(() => {
    if (formData.datetime) {
      const date = new Date(formData.datetime)
      console.log(date)
      setDateValue(date.toISOString().split('T')[0])
      setTimeValue(date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
      }))
    }
  }, [formData.datetime])

  const handleDateTimeChange = (date: string, time: string) => {
    const [hours, minutes] = time.split(':');
    console.log(date)
    const dateObj = new Date(date);
    dateObj.setHours(parseInt(hours), parseInt(minutes));
    console.log(dateObj)
    setFormData({ ...formData, datetime: dateObj.toISOString() });
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  console.log(formData)
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      console.log(formData)
      const response = await fetch('/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        console.log('Error creating event:', data);
        throw new Error(`Error: ${response}`);
      }

      const data = await response.json();
      console.log('Event created successfully:', data);
  
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create event');
      console.error('Failed to create event:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const RequiredStar = () => (
    <span className="text-accent ml-1">*</span>
  );

  const dateRef = useRef<HTMLInputElement>(null)

  const inputClasses = `mt-1 block p-3 cursor-pointer
  border-b border-gray-200 focus:border-b-black focus:ring-0 focus:outline-none`
  const textareaClasses = `mt-2 w-full rounded-md border-gray-300 border
  shadow-sm focus:border-blue-500 focus:ring-blue-500 p-4`;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-black">Create New Event</h1>
          <p className="mt-2 text-sm text-gray-600">
            Fill in the details below to create your event. Fields marked with <span className="text-accent">*</span> are required.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8 bg-white p-6 rounded-xl shadow-sm">
          {/* Basic Information */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-black text-center">Basic Information</h2>
            
            <div className="space-y-4">
              {/* Title */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
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
            {/* Date, Time, and Event Type */}
            <div className="space-y-6">
              <h2 className="text-xl text-center font-semibold text-black pb-2">
                Date, Time, and Type
              </h2>
              
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
                    className={`${inputClasses} w-full pb-4`} // pb-4 to match the height of input
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
                      onChange={(e) => handleDateTimeChange(e.target.value, timeValue)}
                      className={`${inputClasses} w-full`}
                      required
                    />
                  </div>
                </div>

                <TimePicker dateValue={dateValue} handleDateTimeChange={handleDateTimeChange}
                timeValue={timeValue}/>
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="space-y-6">
            <h2 className="text-xl text-center font-semibold text-black pb-2">
              Location
            </h2>
            <label htmlFor="venueName" className="block text-sm 
            font-medium text-gray-700">
              Make it in this format please: CITY, COUNTRY<RequiredStar />
              <input type="text" 
              placeholder='e.g. Lagos, Nigeria'
              className={`${inputClasses} w-full`} />
            </label>
          </div>

          {/* Capacity and Price */}
          <TicketsForm RequiredStar={RequiredStar}
          formData={formData} inputClasses={inputClasses}
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
    </div>
  );
};

export default CreateEventForm;