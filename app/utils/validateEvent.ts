import { EventType } from "../types/Event";

export function validateEvent(event: EventType) {
    const errors = [];

    // Don't validate if the event is a draft
    if (event.status === 'draft') {
        return { isValid: true, errors: [] };
    }

    // Required string fields
    if (!event.title?.trim()) {
        errors.push({ field: 'title', message: 'Title is required' });
    }
    
    if (!event.description?.trim()) {
        errors.push({ field: 'description', message: 'Description is required' });
    }
    
    // Location validation
    if (!event.location?.city?.trim()) {
        errors.push({ field: 'location.city', message: 'City is required' });
    }
    if (!event.location?.country?.trim()) {
        errors.push({ field: 'location.country', message: 'Country is required' });
    }
    if (!event.location?.address?.trim()) {
        errors.push({ field: 'location.address', message: 'Address is required' });
    }

    if (!event.date) {
        errors.push({ field: 'date', message: 'Date is required' });
    } else {
        // Consider the timezone when checking
        const formatter = new Intl.DateTimeFormat('en-US', {
            timeZone: event.timezone,
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });
        
        const eventDate = new Date(event.date);
        const now = new Date();
        
        if (isNaN(eventDate.getTime())) {
            errors.push({ field: 'date', message: 'Invalid date format' });
        } else if (formatter.format(eventDate) < formatter.format(now)) {
            console.log("Date is" + event.date)
            console.log(formatter.format(eventDate));
            errors.push({ field: 'date', message: 'Event date cannot be in the past' });
        }
    }
    
    // Remaining validations stay the same
    if (!event.capacity || event.capacity < 1) {
        errors.push({ field: 'capacity', message: 'Capacity must be greater than 0' });
    }

    if (!event.organizer) {
        errors.push({ field: 'organizer', message: 'Organizer is required' });
    }

    const validStatuses = ['draft', 'published', 'cancelled'];
    if (!event.status || !validStatuses.includes(event.status)) {
        errors.push({ field: 'status', message: 'Status must be either draft, published, or cancelled' });
    }

    const validTypes = ['conference', 'workshop', 'seminar', 'meetup', 'other'];
    if (!event.type || !validTypes.includes(event.type)) {
        errors.push({ field: 'type', message: 'Invalid event type' });
    }

    if (!Array.isArray(event.tags)) {
        errors.push({ field: 'tags', message: 'Tags must be an array' });
    } else if (event.tags.some(tag => typeof tag !== 'string' || !tag.trim())) {
        errors.push({ field: 'tags', message: 'All tags must be non-empty strings' });
    }

    return {
        isValid: errors.length === 0,
        errors
    };
}
