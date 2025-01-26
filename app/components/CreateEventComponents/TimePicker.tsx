import React, { useState, useRef, useEffect } from 'react';
import { X, ChevronDown } from 'lucide-react';

export const TimePicker: React.FC<{
  timeValue: string;
  handleDateChange: (date: string, time: string) => void;
  dateValue: string;
  setDateValue: React.Dispatch<React.SetStateAction<string>>;
  timezone: string;
}> = ({dateValue, handleDateChange, timeValue, timezone, setDateValue}) => {
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
    // Get current time in the specified timezone
    const now = new Date();
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
    
    // Get date and time in timezone
    const [formattedDate, formattedTime] = formatter.format(now).split(', ');
    
    // Parse the date into ISO format (YYYY-MM-DD)
    const [month, day, year] = formattedDate.split('/');
    const isoDate = `${year}-${month}-${day}`;
    
    // Round minutes to next 30-min interval
    const [hours, minutes] = formattedTime.split(':').map(Number);
    const roundedMinutes = minutes <= 30 ? 30 : 0;
    const roundedHours = minutes <= 30 ? hours : (hours + 1) % 24;
    
    // If we roll over to next day
    if (hours === 23 && roundedHours === 0) {
      const nextDate = new Date(formattedDate);
      nextDate.setDate(nextDate.getDate() + 1);
      const nextIsoDate = nextDate.toISOString().split('T')[0];
      setDateValue(nextIsoDate);
    } else {
      setDateValue(isoDate);
    }
  
    const roundedTime = `${String(roundedHours).padStart(2, '0')}:${String(roundedMinutes).padStart(2, '0')}`;
    handleDateChange(isoDate, roundedTime);
    setSelectedTime(roundedTime);
  }, [timezone, handleDateChange, setDateValue]);
  
  useEffect(() => {
    setSelectedTime(timeValue);
  }, [timeValue]);

  const isTimeValid = (time: string): boolean => {
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
    
    const now = new Date();
    const currentTime = formatter.format(now);
    return time >= currentTime;
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