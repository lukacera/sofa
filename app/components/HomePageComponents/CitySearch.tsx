"use client";

import { useState } from "react";
import { MapPin, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

const Spinner = () => (
  <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600" />
);

export default function CitySearch() {
  const router = useRouter();
  const [city, setCity] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleCityChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCity(value);
    
    if (!value.trim()) {
      setSuggestions([]);
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

  const handleSuggestionClick = (suggestion: string) => {
    setCity(suggestion);
    setSuggestions([]);
    router.push(`/events?city=${encodeURIComponent(suggestion)}`);
  };

  const handleSubmit = () => {
    if (city) {
      router.push(`/events?city=${encodeURIComponent(city)}`);
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
            className="w-full px-5 py-3 border-2 border-gray-200 rounded-xl text-lg placeholder:text-gray-400 hover:border-gray-300 focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20"
          />
          {loading ? (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <Spinner />
            </div>
          ) : (
            city && (
              <button 
                onClick={handleSubmit}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-secondary rounded-lg text-white hover:bg-secondary/90 transition-all duration-200"
              >
                <ArrowRight size={20} />
              </button>
            )
          )}
          
          {/* Display city suggestions */}
          {suggestions.length > 0 && (
            <ul className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto z-50">
              {suggestions
              .slice(0, 3)
              .map((suggestion) => (
                <li 
                  key={suggestion} 
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="px-4 py-2 hover:bg-gray-50 cursor-pointer transition-colors duration-150 first:rounded-t-lg last:rounded-b-lg border-b last:border-b-0 border-gray-100"
                >
                  <div className="flex items-center gap-2">
                    <MapPin size={16} className="text-gray-400" />
                    <span>{suggestion}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}