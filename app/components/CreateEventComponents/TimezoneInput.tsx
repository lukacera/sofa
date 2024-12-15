import { timezoneAbbreviations } from '@/app/lib/timezones';
import { EventFormData } from '@/app/types/EventForm';
import { toZonedTime, fromZonedTime } from 'date-fns-tz';
import { useEffect, useState } from 'react';
export function TimezoneInput({
  formData,
  setFormData,
  inputClasses,
}: {
  formData: EventFormData;
  setFormData: React.Dispatch<React.SetStateAction<EventFormData>>;
  inputClasses: string;
}) {
  const [selectedTimezone, setSelectedTimezone] = useState('Europe/Berlin'); // Default to CET

  useEffect(() => {
    // Ensure all dates are converted to the selected timezone and then UTC
    if (formData.date) {
      const zonedTime = toZonedTime(new Date(formData.date), selectedTimezone); // Convert to the selected timezone
      const utcTime = fromZonedTime(zonedTime, selectedTimezone); // Convert to UTC time

      setFormData((prev) => ({
        ...prev,
        date: utcTime.toISOString(), // Store in UTC
      }));
    }
  }, [formData.date, selectedTimezone, setFormData]);

  const handleTimezoneChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTimezone(e.target.value);
  };

  return (
    <div>
      <label htmlFor="timezone" className="block text-sm font-medium text-gray-700">
        Timezone<span className="text-accent ml-1">*</span>
      </label>
      <select
        id="timezone"
        value={selectedTimezone}
        onChange={handleTimezoneChange}
        className={`${inputClasses} w-full`}
      >
        {Object.entries(timezoneAbbreviations).map(([key, label]) => (
          <option key={key} value={key}>
            {label as string}
          </option>
        ))}
      </select>
    </div>
  );
}
