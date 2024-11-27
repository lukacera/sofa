"use client";
import React, { useState, FormEvent, useRef } from 'react';
import Header from '@/app/components/Header';
import { TicketsForm } from '@/app/components/CreateEventComponents/TicketsForm';

interface Ticket {
  name: string;
  price: number;
  benefits: string[];
  total: number;
}
interface EventFormData {
  title: string;
  description: string;
  date: string;
  time: string;
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
    date: '',
    time: '',
    location: '',
    capacity: 100,
    price: 0,
    imageUrl: '',
    type: 'conference',
    tickets: [   // Initialize with one empty ticket
      {
        name: '',
        price: 0,
        benefits: [''],  // Start with one empty benefit
        total: 0
      }
    ]
  });

  const RequiredStar = () => (
    <span className="text-accent ml-1">*</span>
  );

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  const dateRef = useRef<HTMLInputElement>(null)
  const timeRef = useRef<HTMLInputElement>(null)

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
          <h1 className="text-3xl font-bold text-gray-900">Create New Event</h1>
          <p className="mt-2 text-sm text-gray-600">
            Fill in the details below to create your event. Fields marked with <span className="text-accent">*</span> are required.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8 bg-white p-6 rounded-xl shadow-sm">
          {/* Basic Information */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Basic Information</h2>
            
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
                  className={textareaClasses}
                  placeholder="Describe your event"
                  required
                />
              </div>

            {/* Date, Time, and Event Type */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 pb-2">Date, Time, and Type</h2>
              
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
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className={`${inputClasses} w-full`}
                      required
                    />
                  </div>
                </div>

                {/* Time */}
                <div className="flex-1">
                  <label htmlFor="time" className="block text-sm font-medium text-gray-700">
                    Time<RequiredStar />
                  </label>
                  <div 
                  onClick={() => timeRef.current?.showPicker()}
                  className="relative">
                    <input
                      type="time"
                      id="time"
                      ref={timeRef}
                      value={formData.time}
                      onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                      className={`${inputClasses} w-full pl-10`}
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900 pb-2">Location</h2>
            <label htmlFor="venueName" className="block text-sm font-medium text-gray-700">
              Make it in this format please: CITY, COUNTRY<RequiredStar />
              <input type="text" className={`${inputClasses} w-full`} />
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
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Save as Draft
              </button>
              <button
                type="submit"
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