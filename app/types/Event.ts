import { Company } from "./Company";
export interface Event {
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
    organizer: Company;
    status: 'draft' | 'published' | 'cancelled';
    createdAt: Date;
    updatedAt: Date;
  }