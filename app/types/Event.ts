import { CompanyType } from './Company';
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
    organizer: CompanyType;
    tags: string[];
    status: 'finished' | 'published' | 'ongoing';
    createdAt: Date;
    updatedAt: Date;
}