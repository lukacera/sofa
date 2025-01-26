import { NextRequest, NextResponse } from 'next/server';
import Event from "@/app/schemas/Event";
import User from "@/app/schemas/User";
import { connectToDB } from "@/app/utils/connectWithDB";
import { EventType } from '@/app/types/Event';
import { validateEvent } from "@/app/utils/validateEvent";
import { generateEventAnalysis } from "@/app/utils/generateEventAnalysis";

interface InsertEventsResult {
  success: boolean;
  message: string;
  insertedCount?: number;
  errors?: Array<{
    event: Partial<EventType>;
    error: string;
  }>;
}

export async function POST(
  req: NextRequest
): Promise<NextResponse<InsertEventsResult>> {
  try {
    const events = await req.json() as Partial<EventType>[];
    
    if (!Array.isArray(events)) {
      return NextResponse.json({
        success: false,
        message: 'Request body must be an array of events'
      }, { status: 400 });
    }

    await connectToDB();
    
    const errors: Array<{ event: Partial<EventType>; error: string }> = [];
    const validEvents: Partial<EventType>[] = [];

    // Process each event
    for (const eventData of events) {
      try {
        // Remove null fields
        const cleanedEventData = Object.fromEntries(
          Object.entries(eventData).filter(([_, value]) => value !== null)
        ) as Partial<EventType>;

        // Validate event
        const { isValid, errors: validationErrors } = validateEvent(cleanedEventData as EventType);
        if (!isValid) {
          errors.push({
            event: eventData,
            error: `Validation failed: ${JSON.stringify(validationErrors)}`
          });
          // Skip to next event
          continue;
        }

        // Check if organizer exists
        const organizer = await User.findById(cleanedEventData.organizer);
        if (!organizer) {
          errors.push({
            event: eventData,
            error: `Organizer with ID ${cleanedEventData.organizer} not found`
          });
          continue;
        }

        // Generate AI analysis
        const aiAnalysisText = await generateEventAnalysis(cleanedEventData);

        // Prepare event with defaults
        const preparedEvent: Partial<EventType> = {
          ...cleanedEventData,
          aiAnalysis: aiAnalysisText ?? "",
          date: new Date(cleanedEventData.date || Date.now()),
          tags: cleanedEventData.tags || [],
          status: cleanedEventData.status || 'draft',
          type: cleanedEventData.type || 'conference'
        };

        validEvents.push(preparedEvent);

      } catch (error) {
        errors.push({
          event: eventData,
          error: error instanceof Error ? error.message : 'Unknown error processing event'
        });
      }
    }

    if (validEvents.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'No valid events to insert',
        errors
      }, { status: 400 });
    }

    // Insert all valid events in a single operation
    const insertedEvents = await Event.insertMany(validEvents);

    // Update organizers' eventsCreated arrays
    const updates = validEvents.map(event => 
      User.updateOne(
        { _id: event.organizer },
        { $push: { eventsCreated: event._id } }
      )
    );
    await Promise.all(updates);

    return NextResponse.json({
      success: true,
      message: `Successfully inserted ${insertedEvents.length} events`,
      insertedCount: insertedEvents.length,
      ...(errors.length > 0 && { errors })
    });

  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Failed to insert events',
      errors: [{
        event: {} as Partial<EventType>,
        error: error instanceof Error ? error.message : 'Unknown error'
      }]
    }, { status: 500 });
  }
}