import { EventType } from "./Event";
export type UserType = {
    _id?: string;
    name: string;
    email: string;
    image?: string;
    role: "individual" | "company";
    password: string;
    // Individual specific fields
    eventsAttending?: EventType[];
    
    // Company specific fields
    eventsCreated?: EventType[] | null;
    location?: string | null;
    description?: string | null;

    updatedAt?: Date; 
    createdAt?: Date;
};