import { connectToDB } from "@/app/utils/connectWithDB";
import { NextRequest, NextResponse } from "next/server";
import User from "@/app/schemas/User";
import mongoose from "mongoose";
import { EventSchema } from "@/app/schemas/Event";

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
                sort: { createdAt: -1 },
                strictPopulate: false
            }
        });

        if (!user) {
            return NextResponse.json(
                {
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

        return NextResponse.json(
            {
                data: user.eventsCreated || [],
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