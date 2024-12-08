"use client";

import { useState } from "react";
import { MapPin, ArrowRight } from "lucide-react";

export default function CitySearch() {
  const [city, setCity] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleCityChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCity(value);

    if (value.length < 2) {
      setSuggestions([]); // Clear suggestions if input is too short
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/cities?query=${value}`);
      if (response.ok) {
        const data: { cities: string[] } = await response.json();
        setSuggestions(data.cities);
      } else {
        console.error("Failed to fetch cities");
      }
    } catch (error) {
      console.error("Error fetching cities:", error);
    } finally {
      setLoading(false);
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
          <input
            type="text"
            id="cityInput"
            value={city}
            onChange={handleCityChange}
            placeholder="Enter city name..."
            className="w-full px-5 py-3 border-2 border-gray-200 rounded-xl text-lg placeholder:text-gray-400 hover:border-gray-300"
          />
          {loading && <div className="absolute right-3 top-1/2 -translate-y-1/2">Loading...</div>}
          {city && (
            <button className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-secondary rounded-lg text-white hover:bg-secondary/90 transition-all duration-200">
              <ArrowRight size={20} />
            </button>
          )}
        </div>
        {/* Display city suggestions */}
        {suggestions.length > 0 && (
          <ul className="mt-4 bg-white border border-gray-200 rounded-lg shadow-md w-80">
            {suggestions.map((suggestion) => (
              <li key={suggestion} className="p-2 hover:bg-gray-100 cursor-pointer">
                {suggestion}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
