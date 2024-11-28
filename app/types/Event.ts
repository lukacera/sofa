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
        name: string;
        price: number;
        benefits: string[];
        total: number;
        sold: number;
    }[];
    type: 'conference' | 'workshop' | 'meetup' | 'seminar' | 'other'
    organizer: UserType;
    tags?: string[] | null;
    status: 'draft' | 'published' | 'cancelled' | 'finished';
    image: string;
    createdAt: Date;
    updatedAt: Date;
}