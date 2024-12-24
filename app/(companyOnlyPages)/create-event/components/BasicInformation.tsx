import { TimePicker } from '@/app/components/CreateEventComponents/TimePicker';
import TimezoneInput from '@/app/components/CreateEventComponents/TimezoneInput';
import { EventFormData } from '@/app/types/EventForm';
import React, { useRef } from 'react'

interface Props {
    formData: EventFormData
    setFormData: (data: EventFormData) => void;
    inputClasses: string;
    timeValue: string;
    dateValue: string;
}

const RequiredStar = () => (
    <span className="text-accent ml-1">*</span>
);

export default function BasicInformation ({formData, setFormData, inputClasses, dateValue, timeValue}: Props) {
    // Get today's date in YYYY-MM-DD format
    const getTodayString = () => {
      const today = new Date();
      return today.toISOString().split('T')[0];
    };
    
    // Handle date and time changes
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
  
    // Handle capacity input changes with validation
    const handleCapacityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      if (value === '') {
        setFormData({ ...formData, capacity: 100 }); // Reset to default
        return;
      }
      
      const numValue = parseInt(value);
      if (isNaN(numValue)) return;
      
      const cappedValue = Math.min(Math.max(numValue, 1), 10000);
      setFormData({ ...formData, capacity: cappedValue });
    };

    const dateRef = useRef<HTMLInputElement>(null);

    return (
    <div className='space-y-10'>
        <h2 className="text-xl font-semibold text-black text-center">Basic Information</h2>
        
        <div className="space-y-4">
            <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Event Title<RequiredStar />
            </label>
            <input
                type="text"
                id="title"
                value={formData.title || ''} 
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className={`${inputClasses} w-full`}
                placeholder="Enter event title"
                required
            />
            </div>
        </div>

        <div className='flex flex-col gap-4'>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex-1">
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

            <div className="flex-1">
                <label htmlFor="capacity" className="block text-sm font-medium text-gray-700">
                Capacity<RequiredStar />
                </label>
                <input
                type="number"
                id="capacity"
                min="1"
                max="10000"
                value={formData.capacity ?? 0}
                onChange={handleCapacityChange}
                className={`${inputClasses} w-full`}
                placeholder="Enter event capacity"
                required
                />
            </div>

            <div className="flex-1">
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
        <TimezoneInput selectedTimezone={formData.timezone} 
            setSelectedTimezone={(timezone) => setFormData({ ...formData, timezone })}
        />
    </div>
 )
}
