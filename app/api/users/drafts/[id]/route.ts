import User from "@/app/schemas/User";
import { connectToDB } from "@/app/utils/connectWithDB";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    req: NextRequest, 
    { params }: { params: { id: string } }
) {
    try {
        await connectToDB();
        
        const { id } = await params; 
        const user = await User.findById(id)
        .populate({
            path: "eventsCreated",
            match: { status: "draft" },
            options: { 
                sort: { createdAt: -1 },
                strictPopulate: false
            }
        })

        return NextResponse.json({
            data: user?.eventsCreated || []
        }, { status: 200 });
    } catch (error) {
        console.error("Error fetching users:", error);
        return NextResponse.json(
            { message: "Error fetching users" }, 
            { status: 500 }
        );
    }
}