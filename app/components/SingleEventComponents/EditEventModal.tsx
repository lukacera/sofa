import React, { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import { EventType } from '@/app/types/Event';
import { EventFormData } from '@/app/types/EventForm';
import { toZonedTime, fromZonedTime } from 'date-fns-tz';
import EventForm from '../reusable/EventForm';

interface EditEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: EventType;
}

export default function EditEventModal({ isOpen, onClose, event }: EditEventModalProps) {
  const [formData, setFormData] = useState<EventFormData>({
    title: event.title,
    description: event.description,
    date: fromZonedTime(new Date(event.date), event.timezone).toISOString(),
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
    organizer: event.organizer._id ?? '',
    timezone: event.timezone
  });
  
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

  const handleUpdate = async (e: React.FormEvent<HTMLButtonElement>) => {
    try {
      e.preventDefault();
      setIsUpdating(true);
      setError(null);

      const localDate = new Date(dateValue + 'T' + timeValue);
      const utcTime = toZonedTime(localDate, formData.timezone!);

      const response = await fetch(`/api/events/${event._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          ...formData,
          status: 'draft',
          date: utcTime.toISOString()
        })
      });

      if (!response.ok) throw new Error('Failed to publish event');

      onClose();
      window.location.reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to publish event');
    } finally {
      setIsUpdating(false);
    }
  };

  const handlePublish = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPublishing(true);
    setError(null);
  
    try {
      if (event.status === 'published') {
        if (!formData.title?.trim()) {
          throw new Error('Event title is required');
        }
  
        if (!formData.description?.trim() || formData.description.length < 100) {
          throw new Error('Description must be at least 100 characters');
        }
  
        if (!formData.location.address || !formData.location.city || !formData.location.country) {
          throw new Error('Complete location information is required');
        }
  
        if (!formData.tags?.length) {
          throw new Error('At least one tag is required');
        }
  
        if (!formData.capacity || formData.capacity < 1) {
          throw new Error('Valid capacity is required');
        }
  
        if (!formData.date) {
          throw new Error('Event date is required');
        }
  
        const eventDate = new Date(dateValue + 'T' + timeValue);
        const now = new Date();
        if (eventDate < now) {
          throw new Error('Event date must be in the future');
        }
      }

      const localDate = new Date(dateValue + 'T' + timeValue);
      const utcTime = toZonedTime(localDate, formData.timezone!);
  
      const dataToUpdate = {
        ...formData,
        date: utcTime.toISOString(),
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
      // window.location.reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update event');
    } finally {
      setIsPublishing(false);
    }
  };
  
  if (!isOpen) return null;

  const inputClasses = `mt-1 block p-3
  border-b border-gray-200 focus:border-black focus:ring-0 focus:outline-none`;
  const textareaClasses = `mt-2 w-full rounded-md border-gray-300 border
  shadow-sm focus:border-blue-500 focus:ring-blue-500 p-4`;

  const SaveButtons = () => {
    return (
      <div className="flex justify-end gap-3 p-6">
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
    )
  }

  return (
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
        <EventForm
          Buttons={SaveButtons}
          dateValue={dateValue}
          error={error}
          formData={formData}
          inputClasses={inputClasses}
          isCreating={isPublishing}
          setError={setError}
          setFormData={setFormData}
          setIsCreating={setIsPublishing}
          setIsDrafting={setIsUpdating}
          textareaClasses={textareaClasses}
          timeValue={timeValue}
          onSubmit={handlePublish}
          setDateValue={setDateValue}
        />
      </div>
    </div>
  );
}