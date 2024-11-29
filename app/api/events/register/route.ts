import Event from '@/app/schemas/Event';
import { NextRequest, NextResponse } from 'next/server';

interface bodyType {
    userId: string;
    eventId: string;
    ticketId: string;
}

function validateBodyData(data: Partial<bodyType>) {
    const errors: Record<string, string> = {};

    if (!data.eventId?.trim()) {
        errors.name = "Event id is required";
    }
    if (!data.ticketId?.trim()) {
        errors.email = "Ticket id is required";
    }
    if (!data.userId?.trim()) {
        errors.password = "User id is required";
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
}
export async function POST(request: NextRequest) {
  try {
    const body: bodyType = await request.json();

    const {eventId, ticketId, userId} = body;


    const { isValid, errors } = validateBodyData(body);

    if (!isValid) {
        console.log(errors)
        return NextResponse.json(
            { message: "Validation error", errors },
            { status: 400 }
        );
    }

    const event = await Event.findOneAndUpdate(
        { 
            _id: eventId,
            'tickets._id': ticketId,
            $expr: { $lt: ['$tickets.sold', '$tickets.total'] }, // Field-to-field comparison
            attendees: { $ne: userId } // Check if user is not already registered
        },
        { 
            $inc: { 'tickets.$.sold': 1 },
            $push: { attendees: userId } 
        },
        { 
            new: true
        }
    );

    if (!event) {
        return NextResponse.json(
            { message: "Event not found, tickets sold out, or already registered" },
            { status: 400 }
        );
    }

    return NextResponse.json({
      DATA: "FSDFS"
    });
    
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload image' },
      { status: 500 }
    );
  }
}