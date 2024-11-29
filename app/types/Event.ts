import { UserType } from "./User";

export type EventType = {
    _id?: string;
    title: string;
    description: string;
    aiAnalysis: string;
    date: Date;
    location: string;
    capacity: number;
    tickets: {
        type: "free" | "paid";
        price: number;
        benefits: string[];
        total: number;
        sold: number;
        _id: string;
    }[];
    type: 'conference' | 'workshop' | 'meetup' | 'seminar' | 'other'
    organizer: UserType;
    tags?: string[] | null;
    status: 'draft' | 'published' | 'cancelled' | 'finished';
    image: string;
    createdAt: Date;
    updatedAt: Date;
    attendees: UserType[];
}