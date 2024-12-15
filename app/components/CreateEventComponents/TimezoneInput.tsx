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
  const [timezone] = useState('Europe/Berlin'); // CET timezone

  useEffect(() => {
    // Ensure all dates are converted to CET when form data changes
    if (formData.date) {
        const cetTime = toZonedTime(new Date(formData.date), timezone); // Convert to CET time
        const utcTime = fromZonedTime(cetTime, timezone); // Convert to UTC time

      setFormData((prev) => ({
        ...prev,
        date: utcTime.toISOString(), // Store in UTC
      }));
    }
  }, [formData.date, setFormData, timezone]);

  return (
    <div>
      <label htmlFor="timezone" className="block text-sm font-medium text-gray-700">
        Timezone<span className="text-accent ml-1">*</span>
      </label>
      <input
        type="text"
        id="timezone"
        value="Central European Time (CET)"
        readOnly
        className={`${inputClasses} w-full  bg-gray-100`}
      />
    </div>
  );
}
