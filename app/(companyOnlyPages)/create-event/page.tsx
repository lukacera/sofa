"use client";
import React, { useState, ChangeEvent, FormEvent } from 'react';
import { Calendar, Clock, MapPin, Users, DollarSign } from 'lucide-react';
import Header from '@/app/components/Header';

interface Location {
  name: string;
  address: string;
}

interface EventFormData {
  title: string;
  description: string;
  date: string;
  time: string;
  location: Location;
  capacity: number;
  price: number;
  imageUrl: string;
  type: 'conference' | 'workshop' | 'meetup' | 'seminar' | 'other';
}

const CreateEventForm = () => {
  const [formData, setFormData] = useState<EventFormData>({
    title: '',
    description: '',
    date: '',
    time: '',
    location: {
      name: '',
      address: ''
    },
    capacity: 100,
    price: 0,
    imageUrl: '',
    type: 'conference'
  });

  const RequiredStar = () => (
    <span className="text-accent ml-1">*</span>
  );

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  const handleLocationChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      location: {
        ...formData.location,
        [id === 'venueName' ? 'name' : 'address']: value
      }
    });
  };

  const inputClasses = `mt-1 block w-full p-3 border-0 
  border-b border-gray-200 focus:border-b-black focus:ring-0 focus:outline-none`
  const textareaClasses = "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-4";

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
            <h2 className="text-xl font-semibold text-gray-900 border-b pb-2">Basic Information</h2>
            
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
                  className={inputClasses}
                  placeholder="Enter event title"
                  required
                />
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

              {/* Event Type */}
              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                  Event Type<RequiredStar />
                </label>
                <select
                  id="type"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as EventFormData['type'] })}
                  className={inputClasses}
                >
                  <option value="conference">Conference</option>
                  <option value="workshop">Workshop</option>
                  <option value="meetup">Meetup</option>
                  <option value="seminar">Seminar</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
          </div>

          {/* Date and Time */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900 border-b pb-2">Date and Time</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                  Date<RequiredStar />
                </label>
                <div className="relative">
                    <input
                        type="date"
                        id="date"
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        className={`${inputClasses} pl-10`} // Add padding to the left for the icon
                        required
                    />
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
              </div>

              <div className="relative">
  <label htmlFor="time" className="block text-sm font-medium text-gray-700">
    Time<RequiredStar />
  </label>
  <input
    type="time"
    id="time"
    value={formData.time}
    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
    className={`${inputClasses} pl-10`} // Add padding to the left for the icon
    required
  />
  <Clock className="absolute left-3 top-7 transform -translate-y-1/2 text-gray-400" />
</div>
            </div>
          </div>

          {/* Location */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900 border-b pb-2">Location</h2>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="venueName" className="block text-sm font-medium text-gray-700">
                  Venue Name<RequiredStar />
                </label>
                <div className="mt-1 relative">
                  <input
                    type="text"
                    id="venueName"
                    value={formData.location.name}
                    onChange={handleLocationChange}
                    className={inputClasses}
                    placeholder="Enter venue name"
                    required
                  />
                  <MapPin className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
              </div>

              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                  Address<RequiredStar />
                </label>
                <input
                  type="text"
                  id="address"
                  value={formData.location.address}
                  onChange={handleLocationChange}
                  className={inputClasses}
                  placeholder="Enter full address"
                  required
                />
              </div>
            </div>
          </div>

          {/* Capacity and Price */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900 border-b pb-2">Capacity and Price</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="capacity" className="block text-sm font-medium text-gray-700">
                  Capacity<RequiredStar />
                </label>
                <div className="mt-1 relative">
                  <input
                    type="number"
                    id="capacity"
                    min="1"
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
                    className={inputClasses}
                    required
                  />
                  <Users className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
              </div>

              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                  Price<RequiredStar />
                </label>
                <div className="mt-1 relative">
                  <input
                    type="number"
                    id="price"
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                    className={inputClasses}
                    required
                  />
                  <DollarSign className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-6 border-t">
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