import React from 'react';

interface SaveOptionsProps {
  isSubmitting: boolean;
  onSave: (status: "draft" | "published") => void;
}

export function SaveButtons({ isSubmitting, onSave }: SaveOptionsProps) {
  return (
    <div className="flex justify-end space-x-4">
      <button
        type="button"
        disabled={isSubmitting}
        onClick={() => onSave('draft')}
        className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium 
        text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 
        focus:ring-offset-2 focus:ring-blue-500"
      >
        Save as Draft
      </button>
      <button
        type="submit"
        disabled={isSubmitting}
        onClick={() => onSave('published')}
        className="px-4 py-2 border border-transparent rounded-md shadow-sm 
        text-sm font-medium text-white bg-primaryDarker hover:bg-primaryDarker/70"
      >
        {isSubmitting ? 'Creating...' : 'Create Event'}
      </button>
    </div>
  );
}
