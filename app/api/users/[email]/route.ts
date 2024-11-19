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
                { message: "User not found" }, 
                { status: 404 }
            );
        }        
        return NextResponse.json(user, { status: 200 });
    } catch (error) {
        console.error("Error fetching users:", error);
        return NextResponse.json(
            { message: "Error fetching users" }, 
            { status: 500 }
        );
    }
}