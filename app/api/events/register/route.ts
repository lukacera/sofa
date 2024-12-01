import Event from '@/app/schemas/Event';
import User from '@/app/schemas/User';
import mongoose from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';

interface bodyType {
    userId: string;
    eventId: string;
    // ticketId: string;
}

function validateBodyData(data: Partial<bodyType>) {
    const errors: Record<string, string> = {};

    if (!data.eventId?.trim()) {
        errors.name = "Event id is required";
    }
    // if (!data.ticketId?.trim()) {
    //     errors.email = "Ticket id is required";
    // }
    if (!data.userId?.trim()) {
        errors.password = "User id is required";
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
}

export async function POST(request: NextRequest) {
    const session = await mongoose.startSession();
    session.startTransaction();
  
    try {
      const body: bodyType = await request.json();
      const {eventId, userId} = body;
  
      const { isValid, errors } = validateBodyData(body);
  
      if (!isValid) {
          return NextResponse.json(
              { message: "Validation error", errors },
              { status: 400 }
          );
      }
  
      // First find the event and check if ticket is available
      const event = await Event.findOne({
        _id: eventId,
        attendees: { $ne: userId }
      }).session(session);
  
      if (!event) {
        await session.abortTransaction();
        return NextResponse.json(
          { message: "Event not found or already registered" },
          { status: 400 }
        );
      }
  
      // Update event
      const updatedEvent = await Event.findByIdAndUpdate(
        eventId,
        {
          $push: { attendees: userId }
        },
        {
          new: true,
          runValidators: true,
          session
        }
      );
  
      // Update user
      const user = await User.findByIdAndUpdate(
        userId,
        {
          $addToSet: { eventsAttending: eventId }
        },
        {
          new: true,
          runValidators: true,
          session
        }
      );
  
      if (!user) {
        await session.abortTransaction();
        return NextResponse.json(
          { message: "User not found" },
          { status: 404 }
        );
      }
  
      // Commit the transaction
      await session.commitTransaction();
  
      return NextResponse.json({
        success: true,
        event: updatedEvent,
        user
      });
      
    } catch (error) {
      await session.abortTransaction();
      console.error('Registration error:', error);
      return NextResponse.json(
        { error: 'Failed to register for event' },
        { status: 500 }
      );
    } finally {
      session.endSession();
    }
  }