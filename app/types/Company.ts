import { EventType } from "./Event"
export type CompanyType = {
    name: string
    description: string
    location: string
    email: string
    createdAt: Date
    updatedAt: Date
    createdEvents: EventType[],
    image: string
}