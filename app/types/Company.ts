import { Event } from "./Event"
export interface Company {
    name: string
    description: string
    website: string
    email: string
    location: {
      city: string
    }
    createdAt: Date
    updatedAt: Date
    createdEvents: Event[]
}