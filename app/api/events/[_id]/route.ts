// app/api/events/[id]/route.ts
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import Event from "@/app/schemas/Event";
import { connectToDB } from "@/app/utils/connectWithDB";
import { generateEventAnalysis } from "@/app/utils/generateEventAnalysis";
import { validateEvent } from "@/app/utils/validateEvent";

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

    const event = await Event.findById(_id)
    .populate("organizer")
    .populate("attendees");
    
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

export async function PATCH(
  request: Request,
  { params }: { params: { _id: string } }
) {
  try {
    await connectToDB();
    
    const { _id } = await params;

    const data = await request.json();

    if (data.status === "published") {
      const { isValid, errors } = validateEvent(data);
      if (!isValid) {
        return NextResponse.json(
          { message: "Validation error", errors },
          { status: 400 }
        );
      }
    }
    
    let AiAnalysisText: string | null = "";

    if (data.title || data.description || data.location || data.tags) {
      AiAnalysisText = await generateEventAnalysis(data);
    }
    
    // Validate if id is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(_id)) {
        return NextResponse.json(
            { 
                message: "Invalid event ID format",
                event: null
            },
            { status: 400 }
        );
    }
    
    const updateData = {
      ...data,
      image: data.imagePreview,
      updatedAt: new Date()
    };

    // Include AiAnalysisText only if it's not null
    if (AiAnalysisText) {
      updateData.aiAnalysis = AiAnalysisText;
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      _id,
      { $set: updateData },
      { 
        new: true,
        runValidators: true
      }
    ).populate("organizer").populate("attendees");

    if (!updatedEvent) {
        return NextResponse.json(
            {
                message: "Event not found",
                event: null
            },
            { status: 404 }
        );
    }

    return NextResponse.json(
        {
            message: "Event updated successfully",
            event: updatedEvent
        },
        { status: 200 }
    );
  } catch (error) {
      console.error("Error updating event:", error);
      
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
              message: "Error updating event",
              error: error instanceof Error ? error.message : "Unknown error"
          },
          { status: 500 }
      );
  }
}