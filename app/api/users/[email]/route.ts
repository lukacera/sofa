import User from "@/app/schemas/User";
import { connectToDB } from "@/app/utils/connectWithDB";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        await connectToDB();
        const email = req.nextUrl.searchParams.get('email') || '';

        const user = await User.find({
            email: email.trim()
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
        console.log("User found:", user);
        return NextResponse.json(user, { status: 200 });
    } catch (error) {
        console.error("Error fetching users:", error);
        return NextResponse.json(
            { 
                message: "Error fetching users",
                user: null
            }, 
            { status: 500 }
        );
    }
}