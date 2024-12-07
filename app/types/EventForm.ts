export interface Ticket {
    type: "free" | "paid";
    price: number;
    benefits: string[];
    total: number;
    _id?: string;
}

export interface EventFormData {
    title: string | null | undefined; 
    description: string | null | undefined;
    date: string;
    location: {
        address: string | null | undefined;
        city: string | null | undefined;
        country: string | null | undefined;
    };
    capacity: number | null | undefined;
    image: File | null | undefined;
    type: 'conference' | 'workshop' | 'meetup' | 'seminar' | 'other';
    organizer: string;
    status: 'draft' | 'published' | 'cancelled' | 'finished';
    tags: string[];
    imagePreview: string | null | undefined;
}
