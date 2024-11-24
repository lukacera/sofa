import { EventType } from "./Event";
export type UserType = {
    name: string;
    email: string;
    image?: string;
    type: "individual" | "company";
    
    // Individual specific fields
    eventsAttending?: EventType[];
    
    // Company specific fields
    events?: EventType[] | null;
    location?: string | null;
    description?: string | null;

    updatedAt?: Date; 
    createdAt?: Date;
};