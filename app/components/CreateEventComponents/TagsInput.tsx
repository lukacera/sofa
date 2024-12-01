"use client"
import { useState, KeyboardEvent } from 'react';
import { X } from 'lucide-react';
import { EventFormData } from '@/app/types/EventForm';

interface TagInputProps {
  tags: string[];
  setFormData: React.Dispatch<React.SetStateAction<EventFormData>>;
}

export const TagInput = ({ tags, setFormData }: TagInputProps) => {
  const [inputValue, setInputValue] = useState('');

  const addTag = (tag: string) => {
    const trimmedTag = tag.trim().toLowerCase();
    if (trimmedTag && !tags.includes(trimmedTag) && tags.length < 5) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, trimmedTag]
      }));
    }
    setInputValue('');
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(inputValue);
    }
    if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
      removeTag(tags[tags.length - 1]);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2 min-h-[2.5rem] p-2 border border-gray-200 rounded-md">
        {tags.map((tag, index) => (
          <span
            key={index}
            className="flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="hover:bg-primary/20 rounded-full p-0.5"
            >
              <X size={14} />
            </button>
          </span>
        ))}
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => {
            if (inputValue) addTag(inputValue);
          }}
          placeholder={tags.length === 0 ? "Add up to 5 tags..." : ""}
          className="flex-1 min-w-[120px] outline-none border-none focus:ring-0"
        />
      </div>
      <p className="text-sm text-gray-500">
        Press Enter or comma to add a tag. Minimum 1 tag. Maximum 5 tags.
      </p>
    </div>
  );
};