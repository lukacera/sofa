import React, { useState, useRef, useEffect } from 'react';
import { X, AlertCircle, Loader2 } from 'lucide-react';
import { TimePicker } from '@/app/components/CreateEventComponents/TimePicker';
import { TagInput } from '@/app/components/CreateEventComponents/TagsInput';
import { EventType } from '@/app/types/Event';
import { EventFormData } from '@/app/types/EventForm';
import { CldUploadButton, CloudinaryUploadWidgetInfo, CloudinaryUploadWidgetResults  } from 'next-cloudinary';
import Image from 'next/image';
import { LocationInput } from '../CreateEventComponents/LocationInput';
import { UserType } from '@/app/types/User';
import { APIProvider } from '@vis.gl/react-google-maps';

interface EditEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: EventType;
}

export default function EditEventModal({ isOpen, onClose, event }: EditEventModalProps) {
  const [formData, setFormData] = useState<EventFormData>({
    title: event.title,
    description: event.description,
    date: new Date(event.date).toISOString(),
    location: {
      city: event.location.city,
      country: event.location.country,
      address: event.location.address
    },
    capacity: event.capacity,
    type: event.type,
    tags: event.tags || [],
    status: event.status,
    imagePreview: event.image,
    image: new File([], ''),
    organizer: event.organizer._id ?? ''
  });
  console.log(formData)
  const handleImageUpload = async (results: CloudinaryUploadWidgetResults) => {
    try {
      if (results.info instanceof Object) {
        const info = results.info as CloudinaryUploadWidgetInfo;
        setFormData(prev => ({
          ...prev,
          imagePreview: info.secure_url
        }));
      }
    } catch (err) {
      console.error('Error handling image upload:', err);
    }
  };

  const [dateValue, setDateValue] = useState(new Date(event.date).toISOString().split('T')[0]);
  const [timeValue, setTimeValue] = useState(
    new Date(event.date).toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    })
  );

  const [isPublishing, setIsPublishing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const dateRef = useRef<HTMLInputElement>(null);

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

  const handlePublish = async (e: React.FormEvent<HTMLFormElement>) => {
   
    try {
      e.preventDefault();
      setIsPublishing(true);
      setError(null);
      if (!formData.tags?.length) {
        setError("Please add at least one tag");
        return;
      }
      // Simple PATCH request to update status
      const response = await fetch(`/api/events/${event._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          ...formData,
          status: 'published'
         })
      });

      if (!response.ok) throw new Error('Failed to publish event');

      onClose();
      window.location.reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to publish event');
    } finally {
      setIsPublishing(false);
    }
  };

  // Handle updating event details
  const handleUpdate = async (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsUpdating(true);
    setError(null);
  
    try {
      const dataToUpdate = {
        ...formData,
        date: new Date(dateValue + 'T' + timeValue).toISOString(),
        image: formData.imagePreview
      };
  
      const response = await fetch(`/api/events/${event._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToUpdate)
      });
  
      if (!response.ok) throw new Error('Failed to update event');
  
      onClose();
      window.location.reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update event');
    } finally {
      setIsUpdating(false);
    }
  };

  if (!isOpen) return null;

  const RequiredStar = () => (
    <span className="text-accent ml-1">*</span>
  );

  const inputClasses = `mt-1 block p-3
  border-b border-gray-200 focus:border-black focus:ring-0 focus:outline-none`;
  const textareaClasses = `mt-2 w-full rounded-md border-gray-300 border
  shadow-sm focus:border-blue-500 focus:ring-blue-500 p-4`;

  return (
    <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b sticky top-0 bg-white z-10">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Edit Event</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>
          <form onSubmit={handlePublish}
           className="p-6 space-y-8">
            {/* Basic Information */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-black text-center">Basic Information</h2>
      
              <div className="space-y-4">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Event Title<RequiredStar />
                  </label>
                  <input
                    type="text"
                    value={formData.title ?? ""}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className={`${inputClasses} w-full`}
                    required
                  />
                </div>
                {/* Type, Date, Time */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                      Event Type<RequiredStar />
                    </label>
                    <select
                      id="type"
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value as EventFormData['type'] })}
                      className={`${inputClasses} w-full pb-4 cursor-pointer`}
                    >
                      <option value="conference">Conference</option>
                      <option value="workshop">Workshop</option>
                      <option value="meetup">Meetup</option>
                      <option value="seminar">Seminar</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="capacity" className="block text-sm font-medium text-gray-700">
                      Capacity<RequiredStar />
                    </label>
                    <input
                      type="number"
                      id="capacity"
                      min="1"
                      max="10000"
                      value={formData.capacity ?? 100}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value === '') {
                          setFormData({ ...formData, capacity: 100 }); // Reset to default
                          return;
                        }
      
                        const numValue = parseInt(value);
                        if (isNaN(numValue)) return;
      
                        const cappedValue = Math.min(Math.max(numValue, 1), 10000);
                        setFormData({ ...formData, capacity: cappedValue });
                      }}
                      className={`${inputClasses} w-full`}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                      Date<RequiredStar />
                    </label>
                    <div
                      onClick={() => dateRef.current?.showPicker()}
                      className="relative"
                    >
                      <input
                        type="date"
                        id="date"
                        ref={dateRef}
                        value={dateValue}
                        min={getTodayString()}
                        onChange={(e) => {
                          const selectedDate = new Date(e.target.value);
                          const today = new Date();
                          today.setHours(0, 0, 0, 0);
      
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
                  <TimePicker
                    dateValue={dateValue}
                    handleDateChange={handleDateChange}
                    timeValue={timeValue}
                  />
                </div>
              </div>
            </div>
            {/* Tags */}
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">
                Tags<RequiredStar />
              </label>
              <TagInput setFormData={setFormData} tags={formData.tags || []} />
            </div>
            {/* Location */}
{/* Location */}
<div className="space-y-6">
  <h2 className="text-xl text-center font-semibold text-black pb-2">
    Location
  </h2>

  <div className="space-y-4 relative">
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
          <h3 className="font-medium text-sm">Selected Location</h3>
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
</div>            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Description<RequiredStar />
              </label>
              <textarea
                value={formData.description ?? ""}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                minLength={100}
                maxLength={1000}
                className={textareaClasses}
                required
              />
              <p className={`text-sm mt-1
                ${formData.description && (formData.description.length < 100 || formData.description.length === 1000) ?
                'text-red-500' : 'text-gray-500'}`}>
                {formData.description ?
                  `${formData.description.length} / 1000 characters ${formData.description.length < 100 ?
                    `(${100 - formData.description.length} more needed)` : ''}` :
                  '0 / 1000 characters (100 more needed)'}
              </p>
            </div>
            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Event Image
              </label>
              <CldUploadButton
                uploadPreset="sofa ai"
                onSuccess={handleImageUpload}
                className="w-full p-3 border-2 border-dashed rounded-lg text-center hover:bg-gray-50 transition-colors"
              >
                <div className="flex flex-col items-center gap-2">
                  <Image
                    src={formData.imagePreview ?? ""}
                    alt="Event preview"
                    height={128}
                    width={128}
                    className="object-cover rounded-lg mb-2"
                  />
                  <span className="text-sm text-gray-600">
                    Click to upload new image
                  </span>
                </div>
              </CldUploadButton>
            </div>
            {error && (
            <div className="mx-6 mt-4 flex items-center gap-2 text-red-500 bg-red-50 p-3 rounded-lg">
              <AlertCircle className="w-5 h-5" />
              <p>{error}</p>
            </div>
          )}
            {/* Save Buttons */}
            <div className="flex justify-end gap-3 pt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-500 hover:text-gray-700 transition-colors text-sm"
                disabled={isPublishing || isUpdating}
              >
                Cancel
              </button>
              <button
                type={event.status === 'draft' ? 'button' : 'submit'}
                disabled={isUpdating}
                onClick={handleUpdate}
                className="px-4 py-2 bg-primaryDarker text-white rounded-lg hover:bg-primaryDarker/80
                transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2
                text-sm"
                >
                {isUpdating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  'Update Event'
                )}
              </button>
              {event.status === 'draft' && (
                <button
                  type="submit"
                  disabled={isPublishing}
                  className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/80 text-sm
                  transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isPublishing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Publishing...
                    </>
                  ) : (
                    'Publish Event'
                  )}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </APIProvider>
  );
}