"use client";

import { useState } from 'react';
import { MapPin, ArrowRight } from 'lucide-react';

export default function CitySearch() {
 const [city, setCity] = useState("");

 return (
   <section className="py-6">
     <div className="flex flex-col items-center justify-center gap-5">
       <div className="flex items-center gap-3 px-4 py-2 rounded-lg">
         <MapPin size={24}/>
         <label htmlFor="cityInput" className="text-lg font-semibold text-black">
           I am interested in events in this city:
         </label>
       </div>
       <div className="relative w-80">
         <input
           type="text"
           id="cityInput"
           value={city}
           onChange={(e) => setCity(e.target.value)}
           placeholder="Enter city name..."
           className="w-full px-5 py-3 border-2 border-gray-200 rounded-xl
            text-lg placeholder:text-gray-400 hover:border-gray-300"
         />
         {city && (
           <button className="absolute right-3 top-1/2 -translate-y-1/2
             p-2 bg-secondary rounded-lg text-white hover:bg-secondary/90
             transition-all duration-200">
             <ArrowRight size={20} />
           </button>
         )}
       </div>
     </div>
   </section>
 );
}