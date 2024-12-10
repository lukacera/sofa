import React, { useState, useRef, useEffect } from 'react';
import { X } from 'lucide-react';

export const TimePicker: React.FC<{
  timeValue: string;
  handleDateChange: (date: string, time: string) => void;
  dateValue: string;
}> = ({dateValue, handleDateChange, timeValue}) => {

  const [selectedTime, setSelectedTime] = useState('12:30');
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const timeSlots = Array.from({ length: 24 }, (_, hour) => {
    return [0, 30].map(minute => (
      `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
    ));
  }).flat();

  useEffect(() => {
    setSelectedTime(timeValue);
  }, [timeValue]);
 
  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    handleDateChange(dateValue, time);
    setIsOpen(false);
  };
 
  return (
    <div className="relative flex flex-col justify-end w-full" ref={dropdownRef}>
      <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-3">
        Time<span className="text-accent ml-1">*</span>
      </label>
      <div 
        className="px-4 py-2 bg-white rounded-t-lg border cursor-pointer flex justify-between items-center w-full"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{selectedTime}</span>
        {isOpen && <X className="w-4 h-4 text-gray-500 absolute right-2" onClick={() => setIsOpen(false)} />}
      </div>
      
      {isOpen && (
        <div className="absolute top-20 z-50 w-48 max-h-64 overflow-y-auto bg-white border-2 border-black/30 rounded-b-lg shadow-lg">
          {timeSlots.map((time) => (
            <div
              key={time}
              className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${selectedTime === time ? 'bg-gray-100' : ''}`}
              onClick={() => handleTimeSelect(time)}
            >
              {time}
            </div>
          ))}
        </div>
      )}
    </div>
  );
 };