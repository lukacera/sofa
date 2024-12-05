import { EventSchema } from "@/app/schemas/Event";
import User from "@/app/schemas/User";

import { connectToDB } from "@/app/utils/connectWithDB";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

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
        }).populate("eventsAttending");
        
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
                user: user
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

export async function PATCH(
    req: NextRequest,
    { params }: { params: { email: string } }
) {
    try {
        await connectToDB();
        
        const { email } = params;
        const data = await req.json();
        
        const updatedUser = await User.findOneAndUpdate(
            { email: email },
            { 
                $set: {
                    ...data,
                    updatedAt: new Date()
                }
            },
            { 
                new: true, // Return updated document
                runValidators: true // Run schema validators
            }
        ).populate("eventsAttending");

        if (!updatedUser) {
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
                message: "User updated successfully",
                user: updatedUser
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error updating user:", error);
        
        if (error instanceof mongoose.Error.ValidationError) {
            return NextResponse.json(
                {
                    message: "Validation error",
                    errors: error.errors
                },
                { status: 400 }
            );
        }

        return NextResponse.json(
            {
                message: "Error updating user",
                error: error instanceof Error ? error.message : "Unknown error"
            },
            { status: 500 }
        );
    }
}