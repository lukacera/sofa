import Event from "@/app/schemas/Event";
import { connectToDB } from "@/app/utils/connectWithDB";
import { NextRequest, NextResponse } from "next/server";
import { EventType } from '@/app/types/Event';
import User from "@/app/schemas/User";
import { generateEventAnalysis } from "@/app/utils/generateEventAnalysis";
import { auth } from '../../../auth'
import { validateEvent } from "@/app/utils/validateEvent";


function removeNullFields<T extends Record<string, unknown>>(data: T) {
    return Object.fromEntries(
        Object.entries(data).filter(([value]) => value !== null)
    );
 }

export const POST = auth(async (request) => {
    try {
        const session = request.auth
        if (!session) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }
        await connectToDB();
        // Get FormData from the request
        const formData = await request.formData();
        
        // Parse the JSON data
        let eventData: Partial<EventType> = JSON.parse(formData.get('data') as string);
        const imageFile = formData.get('image') as File;

        // Remove null fields from the event data
        eventData = removeNullFields(eventData);

        // Validate the event data
        const { isValid, errors } = validateEvent(eventData as EventType);

        if (!isValid) {
            console.log(errors);
            return NextResponse.json(
                { 
                    message: "Validation error", 
                    errors: errors 
                },
                { status: 400 }
            );
        }

        // Handle image upload to Cloudinary
        let imageUrl = "";
        if (imageFile && imageFile.size > 0) {
            const uploadFormData = new FormData();
            uploadFormData.append('file', imageFile);
            const apiURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
            const response = await fetch(`${apiURL}/upload`, {
                method: 'POST',
                body: uploadFormData
            });
            const data = await response.json();
            imageUrl = data.url;
        }

        const organizer = await User.findById(eventData.organizer);

        if (!organizer) {
            return NextResponse.json(
                { message: 'Organizer not found' },
                { status: 404 }
            );
        }

        // OpenAI completion
        const aiAnalysisText = await generateEventAnalysis(eventData);

        // Create new event with defaults
        const newEvent: Partial<EventType> = {
            ...eventData, // Use cleaned eventData with nulls removed
            aiAnalysis: aiAnalysisText ?? "",
            date: new Date(eventData.date || Date.now()),
            tags: eventData.tags || [],
            status: eventData.status || 'draft',
            type: eventData.type || 'conference',
            ...(imageUrl && { image: imageUrl }) 
        };

        // Save to database
        const createdEvent = await Event.create(newEvent);

        await organizer.updateOne({ $push: { eventsCreated: createdEvent._id } });

        return NextResponse.json(
            { 
                message: 'Event created successfully',
                event: createdEvent 
            },
            { status: 201 }
        );

    } catch (error) {
        console.error('Error creating event:', error);
        return NextResponse.json(
            { message: 'Internal error while creating event', error },
            { status: 500 }
        );
    }
});

interface IEvent extends Document {
    description: string;
    date: Date;
    category: string;
}

interface EventFilters {
    tags?: {$in: string[]};
    $or?: Array<{
        title?: { $regex: string; $options: string };
        description?: { $regex: string; $options: string };
    }>;
    $text?: { $search: string };
    date?: { $gte: Date };
    status?: { $ne: string };
    'location.country'?: string;
    'location.city'?: string;
}

interface PaginationMetadata {
    total: number;
    page: number;
    limit: number;
    pages: number;
}

interface EventsResponse {
    events: IEvent[];
    pagination: PaginationMetadata;
}

export const GET = async (request: NextRequest): Promise<NextResponse<EventsResponse | { message: string; error?: string }>> => {
    try {
        await connectToDB();

        const { searchParams } = new URL(request.url);
        
        // Parse pagination and sorting parameters
        const page = parseInt(searchParams.get('page') ?? '') || 1;
        const limit = parseInt(searchParams.get('limit') ?? '') || 10;
        const sortField = searchParams.get('sortField') || 'date';
        const sortOrder = searchParams.get('sortOrder') || 'asc';
        const includeFinished = searchParams.get('finishedEvents') === 'true';
        const country = searchParams.get('country');
        const city = searchParams.get('city');
        const skip = (page - 1) * limit;

        // Build filter object
        const filters: EventFilters = {};
        
        // Add category filter if provided
        const tags = searchParams.get('tags');
        if (tags) {
            const tagArray = tags.split(',').map(tag => tag.trim());
            // Use $in operator to match events that have any of the provided tags
            filters.tags = { $in: tagArray };
        }
        
        // Add search term filter if provided
        const search = searchParams.get('search');
        if (search) {
            filters.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        // Build sort object
        const sortOptions: Record<string, 1 | -1> = {
            [sortField]: sortOrder === 'asc' ? 1 : -1
        };
        
        if (!includeFinished) {
            const now = new Date();
            filters.date = { $gte: now }; // Only show future events
        }
        
        if (country) {
            filters['location.country'] = country;
        }
        
        if (city) {
            filters['location.city'] = city;
        }

        
        filters.status = { $ne: "draft" }
        
        const total = await Event.countDocuments(filters);
        
        const events = await Event.find(filters)
        .sort(sortOptions)
        .skip(skip)
        .limit(limit);
        
        console.log(events.length)
        console.log(filters)
        return NextResponse.json({
            events,
            pagination: {
                total,
                page,
                limit,
                pages: Math.ceil(total / limit)
            }
        }, { status: 200 });

    } catch (error) {
        console.error('Events route error:', error);
        return NextResponse.json(
            { 
                message: 'Failed to fetch events', 
                error: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
};