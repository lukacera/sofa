import { connectToDB } from "@/app/utils/connectWithDB";
import { NextRequest, NextResponse } from "next/server";
import User from "@/app/schemas/User";
import mongoose from "mongoose";
import { EventSchema } from "@/app/schemas/Event";
import { EventType } from "@/app/types/Event";

export async function GET(
    req: NextRequest,
    { params }: { params: { email: string } }
) {
    try {
        await connectToDB();

        const { email } = await params;

        // Force register Event model if it doesn't exist
        if (!mongoose.models.Event) {
            mongoose.model('Event', EventSchema);
        }

        const user = await User.findOne({
            email: email
        }).populate({
            path: "eventsCreated",
            model: "Event",
            options: { 
                sort: { date: -1 },
                strictPopulate: false
            }
        });

        if (!user) {
            return NextResponse.json(
                {
                    message: "User not found",
                    events: [],
                    pastEvents: [],
                    draftEvents: [],
                    totalAttendees: 0,
                    stats: {
                        pastEventsCount: 0,
                        draftEventsCount: 0,
                        totalAttendees: 0
                    }
                },
                { status: 404 }
            );
        }

        const currentDate = new Date();
        const events = user.eventsCreated || [];

        // Separate events into categories
        const pastEvents = events.filter((event: EventType) => 
            new Date(event.date) < currentDate && event.status !== 'draft'
        );

        const draftEvents = events.filter((event: EventType) => 
            event.status === 'draft'
        );

        const upcomingEvents = events.filter((event: EventType) => 
            new Date(event.date) >= currentDate && event.status !== 'draft'
        );

        // Calculate total attendees across all events
        const totalAttendees = events.reduce((sum: number, event: EventType) => 
            sum + (event.attendees?.length || 0), 0
        );

        const stats = {
            pastEventsCount: pastEvents.length,
            draftEventsCount: draftEvents.length,
            totalAttendees: totalAttendees
        };

        return NextResponse.json(
            {
                upcomingEvents: upcomingEvents, // Current and future events
                pastEvents,
                draftEvents,
                totalAttendees,
                stats
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error fetching hosted events:", error);
        return NextResponse.json(
            {
                message: "Error fetching events",
                events: [],
                pastEvents: [],
                draftEvents: [],
                totalAttendees: 0,
                stats: {
                    pastEventsCount: 0,
                    draftEventsCount: 0,
                    totalAttendees: 0
                }
            },
            { status: 500 }
        );
    }
}