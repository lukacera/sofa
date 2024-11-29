export interface Ticket {
    type: "free" | "paid";
    price: number;
    benefits: string[];
    total: number;
    _id: string;
}

export interface EventFormData {
    title: string;
    description: string;
    date: string;
    location: string;
    capacity: number;
    image: File | null;
    type: 'conference' | 'workshop' | 'meetup' | 'seminar' | 'other';
    tickets: Ticket[];
    organizer: string;
    status: 'draft' | 'published';
    tags: string[];
}
  