import { EventType } from "./Event"
export type CompanyType = {
    name: string
    description: string
    email: string
    location: {
      city: string
    }
    createdAt: Date
    updatedAt: Date
    createdEvents: EventType[]
}