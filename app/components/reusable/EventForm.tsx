import React, { FormEvent } from 'react'
import { ErrorDisplay } from '../CreateEventComponents/ErrorDisplay';
import ImageUpload from '../CreateEventComponents/ImageUpload';
import EnhancedDescriptionInput from '../CreateEventComponents/EnchacedDescriptionInput';
import { LocationInput } from '../CreateEventComponents/LocationInput';
import { APIProvider } from '@vis.gl/react-google-maps';
import { EventFormData } from '@/app/types/EventForm';
import BasicInformation from '@/app/(companyOnlyPages)/create-event/components/BasicInformation';
import { TagInput } from '../CreateEventComponents/TagsInput';
  
interface EventFormProps {
    formData: EventFormData;
    setFormData: React.Dispatch<React.SetStateAction<EventFormData>>;
    error: string | null;
    setError: React.Dispatch<React.SetStateAction<string | null>>;
    isCreating: boolean;
    setIsCreating: React.Dispatch<React.SetStateAction<boolean>>;
    setIsDrafting: React.Dispatch<React.SetStateAction<boolean>>;
    dateValue: string;
    timeValue: string;
    inputClasses: string;
    textareaClasses: string;
    Buttons: React.ComponentType;
    onSubmit: (e: FormEvent<HTMLFormElement>) => void;
}
  
export default function EventForm({
    formData,
    setFormData,
    error,
    setError,
    dateValue,
    timeValue,
    inputClasses,
    textareaClasses,
    Buttons,
    onSubmit
}: EventFormProps) {
    return (
      <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
          <form onSubmit={onSubmit} className="bg-white p-6 space-y-10"
          >
            <BasicInformation 
              formData={formData} 
              setFormData={setFormData} 
              inputClasses={inputClasses} 
              dateValue={dateValue} 
              timeValue={timeValue}
            />
  
            <div className='flex flex-col gap-4'>
              <h2 className="block text-sm font-medium text-gray-700">
                Tags<span className="text-accent ml-1">*</span>
              </h2>
              <TagInput setFormData={setFormData} tags={formData.tags}/>
            </div>
  
            <div className="space-y-6">
              <h2 className="text-xl text-center font-semibold text-black pb-2">
                Location
              </h2>
              
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">
                  Search Location<span className="text-accent ml-1">*</span>
                  <LocationInput 
                    formData={formData}
                    setFormData={setFormData}
                    inputClasses={inputClasses}
                  />
                </label>
  
                {formData.location.address && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="font-semibold">Selected Location</h3>
                        <button
                          type="button"
                          onClick={() => setFormData(prev => ({
                            ...prev,
                            location: {
                              city: '',
                              country: '',
                              address: ''
                            }
                          }))}
                          className="text-sm text-red-500 hover:text-red-700 transition-colors"
                        >
                          Clear location
                        </button>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm"><span className="font-medium">Address:</span> {formData.location.address}</p>
                        <p className="text-sm"><span className="font-medium">City:</span> {formData.location.city}</p>
                        <p className="text-sm"><span className="font-medium">Country:</span> {formData.location.country}</p>
                      </div>
                    </div>
                  )}
              </div>
            </div>
  
            <EnhancedDescriptionInput
              formData={formData}
              setFormData={setFormData}
              textareaClasses={textareaClasses}
            />
  
            <ImageUpload 
              formData={formData} 
              inputClasses={inputClasses}
              setFormData={setFormData}
            />
            <ErrorDisplay
              error={error} 
              onDismiss={() => setError(null)}
            />
            <Buttons />
          </form>
      </APIProvider>
    );
}
