// app/api/users/upcomingEvents/[email]/route.ts
import { connectToDB } from "@/app/utils/connectWithDB";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import User from "@/app/schemas/User";
import EventSchema from "@/app/schemas/Event"; // Import the schema, not the model

export async function GET(
    req: NextRequest, 
    { params }: { params: { email: string } }
) {
    try {
        await connectToDB();
        console.log("Connected to DB from the routeConnected to DB from the routeConnected to DB from the routeConnected to DB from the routeConnected to DB from the routeConnected to DB from the routeConnected to DB from the routeConnected to DB from the routeConnected to DB from the routeConnected to DB from the routeConnected to DB from the route");
        // Force register Event model if it doesn't exist
        if (!mongoose.models.Event) {
            // @ts-expect-error - Ignore type error for schema
            mongoose.model('Event', EventSchema);
        }

        const { email } = await params;
        const currentDateTime = new Date();
        
        const user = await User.findOne({
            email: email
        }).populate({
            path: "eventsAttending",
            match: { date: { $gte: currentDateTime } },
            options: { sort: { date: 1 } }
        });

        if (!user) {
            return NextResponse.json({ 
                message: "User not found",
                events: [] 
            }, { status: 404 });
        }        

        return NextResponse.json({
            message: "User found",
            events: user.eventsAttending || []
        });
    } catch (error) {
        console.error("Error fetching users:", error);
        return NextResponse.json({ 
            message: "Error fetching events",
            events: [] 
        }, { status: 500 });
    }
}