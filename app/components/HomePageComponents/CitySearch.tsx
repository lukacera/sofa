"use client";

import { useEffect, useRef, useState } from "react";
import { MapPin, ArrowRight } from "lucide-react";
import { APIProvider, useMapsLibrary } from "@vis.gl/react-google-maps";
import { EventFormData } from "@/app/types/EventForm";

const LocationInput = ({ setFormData, inputClasses }: {
  formData: Partial<EventFormData>;
  setFormData: React.Dispatch<React.SetStateAction<Partial<EventFormData>>>;
  inputClasses: string;
 }) => {
  const places = useMapsLibrary('places');
  const inputRef = useRef<HTMLInputElement>(null);
  const [display, setDisplay] = useState('');
 
  useEffect(() => {
    if (!places || !inputRef.current) return;
 
    const autocomplete = new places.Autocomplete(inputRef.current, {
      fields: ['address_components', 'formatted_address'],
      types: ['(cities)']
    });
 
    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      let city = '', country = '', address = '';
 
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
      placeholder="Search for a location..."
      className={`${inputClasses} w-full`}
    />
  );
 };
function CitySearchInner() {
  const [formData, setFormData] = useState<Partial<EventFormData>>({
    location: { city: "", country: "", address: "" },
  });

  const handleSubmit = () => {
    if (formData.location?.city) {
      window.location.href = `/events?city=${encodeURIComponent(formData.location.city)}`;      
    }
  };

  return (
    <section className="py-6">
      <div className="flex flex-col items-center justify-center gap-5">
        <div className="flex items-center gap-3 px-4 py-2 rounded-lg">
          <MapPin size={24} />
          <label htmlFor="cityInput" className="text-lg font-semibold text-black">
            I am interested in events in this city:
          </label>
        </div>
        <div className="relative w-80">
          <LocationInput
            formData={formData}
            setFormData={setFormData}
            inputClasses="border-2 border-gray-200 rounded-xl px-5 py-3 text-lg placeholder:text-gray-400 hover:border-gray-300 focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20"
          />
          {formData.location?.city && (
            <button
              onClick={handleSubmit}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-secondary rounded-lg text-white hover:bg-secondary/90 transition-all duration-200"
            >
              <ArrowRight size={20} />
            </button>
          )}
        </div>
      </div>
    </section>
  );
}

export default function CitySearch() {
  return (
    <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
      <CitySearchInner />
    </APIProvider>
  );
}
