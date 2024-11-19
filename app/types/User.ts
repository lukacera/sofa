import { EventType } from "./Event";
export type UserType = {
    name: string;
    email: string;
    eventsAttending: EventType[];
    password: string | null;
    image?: string;
    createdAt?: Date;
};