import { CompanyType } from './Company';
export type EventType = {
    title: string;
    description: string;
    aiAnalsis: string;
    date: Date;
    location: {
        city: string;
    };
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
    status: 'draft' | 'published' | 'cancelled';
    createdAt: Date;
    updatedAt: Date;
}