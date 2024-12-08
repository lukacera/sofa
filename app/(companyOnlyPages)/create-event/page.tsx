"use client";
import React, { useState, FormEvent, useRef, useEffect } from 'react';
import { TimePicker } from '@/app/components/CreateEventComponents/TimePicker';
import { useSession } from 'next-auth/react';
import ImageUpload from '@/app/components/CreateEventComponents/ImageUpload';
import { EventFormData } from '@/app/types/EventForm';
import { TagInput } from '@/app/components/CreateEventComponents/TagsInput';
import { useRouter } from 'next/navigation';
import { SaveButtons } from '@/app/components/CreateEventComponents/SaveButtons';
import { APIProvider, useMapsLibrary } from '@vis.gl/react-google-maps';

const LocationInput = ({ formData, setFormData, inputClasses }: {
 formData: EventFormData;
 setFormData: React.Dispatch<React.SetStateAction<EventFormData>>;
 inputClasses: string;
}) => {
 const places = useMapsLibrary('places');
 const inputRef = useRef<HTMLInputElement>(null);
 const [display, setDisplay] = useState('');

 useEffect(() => {
   if (!places || !inputRef.current) return;

   const autocomplete = new places.Autocomplete(inputRef.current, {
     fields: ['address_components', 'formatted_address'],
     types: ['address']
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

export default function CreateEventForm() {
 const {data: session, status} = useSession()
 const router = useRouter();

 const now = new Date();
 const minutes = now.getMinutes();
 const roundedMinutes = Math.ceil(minutes / 30) * 30;
 now.setMinutes(roundedMinutes);
 now.setSeconds(0);
 now.setMilliseconds(0);

 const [formData, setFormData] = useState<EventFormData>({
   title: null,
   description: null,
   location: {
     address: null,
     city: null,
     country: null
   },
   date: now.toISOString(),
   capacity: 100,
   image: new File([], 'image'),
   type: 'conference',
   organizer: '',
   status: 'published',
   tags: [],
   imagePreview: null
 });

 const [dateValue, setDateValue] = useState(new Date().toISOString().split('T')[0])  
 const [timeValue, setTimeValue] = useState('13:00')
 
 useEffect(() => {
   if (status === 'authenticated' && session?.user?.id) {
     setFormData(prev => ({
       ...prev,
       organizer: session.user.id
     }));
   }
 }, [status, session?.user?.id]);
 
 useEffect(() => {
   if (formData.date) {
     const date = new Date(formData.date)
     setDateValue(date.toISOString().split('T')[0])
     setTimeValue(date.toLocaleTimeString('en-US', { 
       hour: '2-digit', 
       minute: '2-digit',
       hour12: false 
     }))
   }
 }, [formData.date])

 const getTodayString = () => {
   const today = new Date();
   return today.toISOString().split('T')[0];
 };
 
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

 const [isSubmitting, setIsSubmitting] = useState(false);
 const [error, setError] = useState<string | null>(null);

 const handleSubmit = async (e: FormEvent<HTMLFormElement>, status: 'draft' | 'published' | 'cancelled' | 'finished') => {
   e.preventDefault();
   setIsSubmitting(true);
   setError(null);
 
   try {
     const formDataToSend = new FormData();
     formDataToSend.append('image', formData.image as Blob);
     
     const restOfData = {
       ...formData,
       status: status,
       image: undefined
     };
     formDataToSend.append('data', JSON.stringify(restOfData));
 
     const response = await fetch('/api/events', {
       method: 'POST',
       body: formDataToSend
     });
 
     if (!response.ok) {
       throw new Error(`Error: ${response}`);
     }
   } catch (err) {
     setError(err instanceof Error ? err.message : 'Failed to create event');
     console.error('Failed to create event:', err);
   } finally {
     router.push('/profile');
     setIsSubmitting(false);
   }
 };

 const RequiredStar = () => (
   <span className="text-accent ml-1">*</span>
 );

 const dateRef = useRef<HTMLInputElement>(null)

 const inputClasses = `mt-1 block p-3
   border-b border-gray-200 focus:border-black focus:ring-0 focus:outline-none`
 const textareaClasses = `mt-2 w-full rounded-md border-gray-300 border
   shadow-sm focus:border-blue-500 focus:ring-blue-500 p-4`;

 return (
   <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
     <div className="w-[60%] mx-auto py-8 px-4 sm:px-6 lg:px-8">
       <div className="mb-8">
         <h1 className="text-3xl font-bold text-black">Create New Event</h1>
         <p className="mt-2 text-sm text-gray-600">
           Fill in the details below to create your event. Fields marked with <span className="text-accent">*</span> are required.
         </p>
       </div>

       <form onSubmit={(e) => handleSubmit(e, formData.status)}
       className="bg-white p-6 rounded-xl shadow-sm space-y-10">
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
             <div className="flex flex-col md:flex-row gap-4">
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
                 <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                   Date<RequiredStar />
                 </label>
                 <div 
                 onClick={() => dateRef.current?.showPicker()}
                 className="relative">
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

               <TimePicker dateValue={dateValue} handleDateChange={handleDateChange}
               timeValue={timeValue}/>
             </div>
           </div>
         </div>

         <div className='flex flex-col gap-4'>
           <h2 className="block text-sm font-medium text-gray-700">
             Tags<RequiredStar />
           </h2>
           <TagInput setFormData={setFormData} tags={formData.tags}/>
         </div>

         <div className="space-y-6">
           <h2 className="text-xl text-center font-semibold text-black pb-2">
             Location
           </h2>
           
           <div className="space-y-4">
             <label className="block text-sm font-medium text-gray-700">
               Search Location<RequiredStar />
               <LocationInput 
                 formData={formData}
                 setFormData={setFormData}
                 inputClasses={inputClasses}
               />
             </label>

             {formData.location.address && (
               <div className="mt-4 p-4 bg-gray-50 rounded-lg space-y-2">
                 <p className="text-sm"><span className="font-medium">Address:</span> {formData.location.address}</p>
                 <p className="text-sm"><span className="font-medium">City:</span> {formData.location.city}</p>
                 <p className="text-sm"><span className="font-medium">Country:</span> {formData.location.country}</p>
               </div>
             )}
           </div>
         </div>

         <div>
           <label htmlFor="description" className="block text-sm font-medium text-gray-700">
             Description<RequiredStar />
           </label>
           <textarea
             id="description"
             value={formData.description || ''}
             onChange={(e) => setFormData({ ...formData, description: e.target.value })}
             rows={4}
             minLength={100}
             maxLength={1000}
             className={textareaClasses}
             placeholder="Describe your event (minimum 100 characters and max 1000)"
             required
           />
           <p className={`text-sm mt-1 
             ${formData.description && (formData.description.length < 100 || formData.description.length === 1000) ? 
             'text-red-500' : 'text-gray-500'}`}>
             {formData.description ? 
               `${formData.description.length} / 1000 characters ${formData.description.length < 100 ? 
               `(${100 - formData.description.length} more needed)` : ''}` : 
               '0 / 1000 characters (100 more needed)'}
           </p>
         </div>

         <ImageUpload formData={formData} inputClasses={inputClasses}
         setFormData={setFormData}/>

         <SaveButtons 
           isSubmitting={isSubmitting}
           onSave={(status, e) => handleSubmit(e as FormEvent<HTMLFormElement>, status)}
         />
       </form>
     </div>
   </APIProvider>
 );
}