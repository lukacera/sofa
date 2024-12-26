import React, { Dispatch, FormEvent, SetStateAction } from 'react';
import { EventFormData } from '@/app/types/EventForm';
interface SaveOptionsProps {
  isDrafting: boolean;
  isCreating: boolean;
  setIsDrafting: Dispatch<SetStateAction<boolean>>;
  setIsCreating: Dispatch<SetStateAction<boolean>>;
  onSave: (status: 'draft' | 'published', e: FormEvent) => void;
  setFormData: Dispatch<SetStateAction<EventFormData>>;
}

export function SaveButtons({ 
  isCreating, 
  isDrafting, 
  onSave, 
  setFormData, 
  setIsCreating, 
  setIsDrafting 
}: SaveOptionsProps) {

  const handleClick = (status: 'draft' | 'published', e: FormEvent) => {
    e.preventDefault();
    setFormData((prev) => ({ ...prev, status }));
    if (status === 'draft') {
      setIsDrafting(true);
    } else {
      setIsCreating(true);
    }
    onSave(status, e);
  };

  return (
    <div className="flex justify-center sm:justify-end space-x-4">
      <button
        type="button"
        disabled={isDrafting || isCreating}
        onClick={(e) => handleClick('draft', e)}
        className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium 
        text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 
        focus:ring-offset-2 focus:ring-blue-500"
      >
        {isDrafting ? 'Saving as a draft...' : 'Save as draft'}
        </button>
      <button
        type="submit"
        disabled={isCreating || isDrafting}
        onClick={(e) => handleClick('published', e)}
        className="px-4 py-2 border border-transparent rounded-md shadow-sm 
        text-sm font-medium text-white bg-primaryDarker hover:bg-primaryDarker/70"
      >
        {isCreating ? 'Creating...' : 'Create Event'}
      </button>
    </div>
  );
}