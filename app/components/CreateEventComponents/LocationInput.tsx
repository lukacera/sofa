import { EventFormData } from '@/app/types/EventForm';
import { useMapsLibrary } from '@vis.gl/react-google-maps';
import React, { useEffect, useRef, useState } from 'react'

export const LocationInput = ({ setFormData, inputClasses }: {
  formData: EventFormData;
  setFormData: React.Dispatch<React.SetStateAction<EventFormData>>;
  inputClasses: string;
}) => {
  const places = useMapsLibrary('places');
  const inputRef = useRef<HTMLInputElement>(null);
  const [display, setDisplay] = useState('');

  useEffect(() => {
    // Initialize Google Places Autocomplete when the library is loaded
    if (!places || !inputRef.current) return;

    const autocomplete = new places.Autocomplete(inputRef.current, {
      fields: ['address_components', 'formatted_address'],
      types: ['address']
    });

    // Handle place selection
    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      let city = '', country = '', address = '';

      // Extract address components
      place.address_components?.forEach(component => {
        if (component.types.includes('locality')) {
          city = component.long_name;
        }
        if (component.types.includes('country')) {
          country = component.long_name;
        }
        if (component.types.includes('street_number') || component.types.includes('route')) {
          address = (address ? address + ' ' : '') + component.long_name;
        }
      });

      // Update form data with location details
      setFormData(prev => ({
        ...prev,
        location: { city, country, address }
      }));
      setDisplay(place.formatted_address || '');
    });
  }, [places, setFormData]);

  return (
    <input
      ref={inputRef}
      type="text"
      value={display}
      onChange={(e) => setDisplay(e.target.value)}
      placeholder="Search for a street..."
      className={`${inputClasses} w-full`}
    />
  );
};
