import { connectToDB } from "@/app/utils/connectWithDB"
import { NextResponse } from "next/server";

export const POST = async () => {
    try {
        await connectToDB();
        return NextResponse.json({ message: 'Connected to the database' }, { status: 200 })
    } catch (error) {
        console.error(error)
        return NextResponse.json({ message: 'Internal error in route.ts' }, { status: 500 })
    }
}