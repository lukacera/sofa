// app/api/events/[id]/route.ts
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import Event from "@/app/schemas/Event";
import { connectToDB } from "@/app/utils/connectWithDB";

export async function GET(
  request: Request,
  { params }: { params: { _id: string } }
) {
  try {
    await connectToDB();

    const { _id } = await params;

    // Validate if id is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(_id)) {
      return NextResponse.json(
        { error: "Invalid event ID format" },
        { status: 400 }
      );
    }

    const event = await Event.findById(_id).populate("organizer");
    
    console.log(event);
    if (!event) {
      return NextResponse.json(
        { error: "Event not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(event);
    
  } catch (error) {
    console.error("Error fetching event:", error);
    return NextResponse.json(
      { error: "Failed to fetch event" },
      { status: 500 }
    );
  }
}