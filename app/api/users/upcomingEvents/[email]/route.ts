import Event from "@/app/schemas/Event";
import User from "@/app/schemas/User";
import { connectToDB } from "@/app/utils/connectWithDB";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    req: NextRequest, 
    { params }: { params: { email: string } }
) {
    try {
        await connectToDB();

        const { email } = await params;

        const currentDateTime = new Date();
        const user = await User.findOne({
            email: email
        }).populate({
            path: "eventsAttending",
            match: { date: { $gte: currentDateTime } },
            options: { sort: { date: 1 } }
        })
        
        if (!user) {
            return NextResponse.json(
                { 
                    message: "User not found",
                    user: null
                }, 
                { status: 404 }
            );
        }        
        return NextResponse.json(
            {
                message: "User found",
                events: user.eventsAttending
            }, 
            { status: 200 });
    } catch (error) {
        console.error("Error fetching users:", error);
        return NextResponse.json(
            { 
                message: "User not found",
                user: null
            },             
            { status: 500 }
        );
    }
}