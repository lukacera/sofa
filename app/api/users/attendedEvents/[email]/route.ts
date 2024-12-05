// app/api/users/[email]/attended/route.ts
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
            path: "eventsAttending",
            match: { status: "published" }, // Only get published events
            options: { sort: { date: -1 } } // Sort by date descending
        });

        if (!user) {
            return NextResponse.json(
                {
                    message: "User not found",
                    events: []
                },
                { status: 404 }
            );
        }

        return NextResponse.json(
            {
                message: "Events found",
                events: user.eventsAttending
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error fetching attended events:", error);
        return NextResponse.json(
            {
                message: "Error fetching events",
                events: []
            },
            { status: 500 }
        );
    }
}