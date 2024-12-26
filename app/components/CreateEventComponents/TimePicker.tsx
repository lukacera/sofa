import React, { useState, useRef, useEffect } from 'react';
import { X, ChevronDown } from 'lucide-react';

export const TimePicker: React.FC<{
  timeValue: string;
  handleDateChange: (date: string, time: string) => void;
  dateValue: string;
  timezone: string;
}> = ({dateValue, handleDateChange, timeValue, timezone}) => {

  const [selectedTime, setSelectedTime] = useState(timeValue);
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

  useEffect(() => {
    setSelectedTime(timeValue);
  }, [timeValue]);

  const isTimeValid = (time: string): boolean => {
    // Create date object in UTC
    const selectedDateTime = new Date(`${dateValue}T${time}:00Z`);
    
    // Convert to the user's timezone
    const userTimezone = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
  
    console.log(userTimezone.format(selectedDateTime));
    // Get current time in the user's timezone
    const now = new Date();
    const currentInTimezone = userTimezone.format(now);
    const currentDateTime = new Date(currentInTimezone);
  
    // Format selected time in the user's timezone
    const selectedInTimezone = userTimezone.format(selectedDateTime);
    const adjustedSelectedDateTime = new Date(selectedInTimezone);
  
    return adjustedSelectedDateTime > currentDateTime;
  };

  const timeSlots = Array.from({ length: 24 }, (_, hour) => {
    return [0, 30].map(minute => (
      `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
    ));
  }).flat();

  const handleTimeSelect = (time: string) => {
    if (!isTimeValid(time)) return;
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
        className={`px-4 py-2 bg-white rounded-t-lg border cursor-pointer flex justify-between items-center w-full hover:border-gray-400 transition-colors ${isOpen ? 'border-gray-400' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{selectedTime}</span>
        <div className="flex items-center">
          {isOpen ? (
            <X className="w-4 h-4 text-gray-500" onClick={(e) => {
              e.stopPropagation();
              setIsOpen(false);
            }} />
          ) : (
            <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          )}
        </div>
      </div>
      
      {isOpen && (
        <div className="absolute top-20 z-50 w-48 max-h-64 overflow-y-auto bg-white border-2 border-black/30 rounded-b-lg shadow-lg">
          {timeSlots.map((time) => {
            const valid = isTimeValid(time);
            return (
              <div
                key={time}
                className={`px-4 py-2 cursor-pointer ${
                  valid 
                    ? `hover:bg-gray-100 ${selectedTime === time ? 'bg-gray-100' : ''}` 
                    : 'text-gray-400 cursor-not-allowed'
                }`}
                onClick={() => valid && handleTimeSelect(time)}
              >
                {time}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};