import { EventFormData } from "@/app/types/EventForm";
import { toZonedTime } from "date-fns-tz";
import { FormEvent } from "react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

interface SubmitProps {
  e: FormEvent<HTMLFormElement>;
  status: 'draft' | 'published' | 'cancelled' | 'finished';
  formData: EventFormData;
  setError: (error: string | null) => void;
  setIsCreating: (isCreating: boolean) => void;
  setIsDrafting: (isDrafting: boolean) => void;
  router: AppRouterInstance;
}

export const handleSubmit = async (props: SubmitProps) => {

    const { e, status, formData, setError, setIsCreating, setIsDrafting, router } = props; 
    e.preventDefault();
  
    // Validation checks
    const validationErrors: string[] = [];
  
    if (status === "published"){
        // Required field checks
        if (!formData.title) validationErrors.push("Event title is required");
        if (!formData.description || formData.description.length < 100) 
          validationErrors.push("Description must be at least 100 characters");
        if (!formData.location.address || !formData.location.city || !formData.location.country) 
          validationErrors.push("Complete location information is required");
        if (!formData.tags || formData.tags.length === 0) 
          validationErrors.push("At least one tag is required");
        // If there are validation errors, show them and stop submission
        if (validationErrors.length > 0) {
          setError(validationErrors.join('\n'));
          setIsCreating(false);
          setIsDrafting(false);
          return;
        }
    }
    
    // Set loading state based on status
    if (status === 'draft') setIsDrafting(true);
    else setIsCreating(true);
  
    setError(null);
  
    try {
      const localDate = new Date(formData.date);
      const utcTime = toZonedTime(localDate, formData.timezone);
  
      // Create a new form data object with the UTC time
      const formDataToSend = new FormData();
      formDataToSend.append('image', formData.image as Blob);
      
      const restOfData = {
        ...formData,
        status: status,
        image: undefined,
        date: utcTime.toISOString()
      };

      formDataToSend.append('data', JSON.stringify(restOfData));
  
      const response = await fetch('/api/events', {
        method: 'POST',
        body: formDataToSend
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create event');
      }

      // Only redirect on successful submission
      return status === "published" ? router.push('/profile?tab=created-events') : router.push('/profile?tab=drafts');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create event');
      console.error('Failed to create event:', err);
    } finally {
      setIsCreating(false);
      setIsDrafting(false);
    }
  };