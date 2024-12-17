import React, { useState, useRef, useEffect } from 'react';
import { X } from 'lucide-react';
import { timezoneAbbreviations } from '@/app/lib/timezones';

export const TimezoneInput: React.FC<{
  selectedTimezone: string;
  setSelectedTimezone: (timezone: string) => void;
}> = ({ selectedTimezone, setSelectedTimezone }) => {
  
  // State for managing the dropdown
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Handle clicks outside the dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter timezones based on search query
  const filteredTimezones = Object.entries(timezoneAbbreviations).filter(([key, label]) =>
    (label as string).toLowerCase().includes(searchQuery.toLowerCase()) ||
    key.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleTimezoneSelect = (timezone: string) => {
    setSelectedTimezone(timezone);
    setIsOpen(false);
  };

  console.log(selectedTimezone)
  return (
    <div className="relative flex flex-col justify-end w-full" ref={dropdownRef}>
      <label htmlFor="timezone" className="block text-sm font-medium text-gray-700 mb-3">
        Timezone<span className="text-accent ml-1">*</span>
      </label>
      
      <div 
        className="px-4 py-2 bg-white rounded-t-lg border cursor-pointer flex justify-between items-center w-full"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{timezoneAbbreviations[selectedTimezone]}</span>
        {isOpen && <X className="w-4 h-4 text-gray-500" onClick={(e) => {
          e.stopPropagation();
          setIsOpen(false);
        }} />}
      </div>
      
      {isOpen && (
        <div className="absolute top-20 z-50 w-72 max-h-64 overflow-y-auto bg-white border-2 border-black/30 rounded-b-lg shadow-lg">
          <div className="sticky top-0 bg-white p-2 border-b">
            <input
              type="text"
              placeholder="Search timezone..."
              className="w-full px-3 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          
          {filteredTimezones.map(([key, label]) => (
            <div
              key={key}
              className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${
                selectedTimezone === key ? 'bg-gray-100' : ''
              }`}
              onClick={() => handleTimezoneSelect(key)}
            >
              <div className="font-medium">{label as string}</div>
              <div className="text-sm text-gray-500">{key}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TimezoneInput;