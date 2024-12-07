export interface Ticket {
    type: "free" | "paid";
    price: number;
    benefits: string[];
    total: number;
    _id?: string;
}

export interface EventFormData {
    title: string | null; 
    description: string | null;
    date: string;
    location: {
        address: string | null;
        city: string | null;
        country: string | null;
    };
    capacity: number | null;
    image: File | null;
    type: 'conference' | 'workshop' | 'meetup' | 'seminar' | 'other';
    organizer: string;
    status: 'draft' | 'published';
    tags: string[];
}
  