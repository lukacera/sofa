import Event from "@/app/schemas/Event";
import { connectToDB } from "@/app/utils/connectWithDB";
import { NextRequest, NextResponse } from "next/server";
import { EventType } from '@/app/types/Event';
import OpenAI from "openai"
import User from "@/app/schemas/User";

function validateEvent(event: EventType) {
    const errors = [];

    // Don't validate if the event is a draft
    if (event.status === 'draft') {
        return { isValid: true, errors: [] };
    }

    // Required string fields
    if (!event.title?.trim()) {
        errors.push({ field: 'title', message: 'Title is required' });
    }
    
    if (!event.description?.trim()) {
        errors.push({ field: 'description', message: 'Description is required' });
    }
    
    // Location validation
    if (!event.location?.city?.trim()) {
        errors.push({ field: 'location.city', message: 'City is required' });
    }
    if (!event.location?.country?.trim()) {
        errors.push({ field: 'location.country', message: 'Country is required' });
    }
    if (!event.location?.address?.trim()) {
        errors.push({ field: 'location.address', message: 'Address is required' });
    }

    if (!event.date) {
        errors.push({ field: 'date', message: 'Date is required' });
    } else {
        const eventDate = new Date(event.date);
        if (isNaN(eventDate.getTime())) {
            errors.push({ field: 'date', message: 'Invalid date format' });
        } else if (eventDate < new Date()) {
            errors.push({ field: 'date', message: 'Event date cannot be in the past' });
        }
    }
    
    // Remaining validations stay the same
    if (!event.capacity || event.capacity < 1) {
        errors.push({ field: 'capacity', message: 'Capacity must be greater than 0' });
    }

    if (!event.organizer) {
        errors.push({ field: 'organizer', message: 'Organizer is required' });
    }

    const validStatuses = ['draft', 'published', 'cancelled'];
    if (!event.status || !validStatuses.includes(event.status)) {
        errors.push({ field: 'status', message: 'Status must be either draft, published, or cancelled' });
    }

    const validTypes = ['conference', 'workshop', 'seminar', 'meetup', 'other'];
    if (!event.type || !validTypes.includes(event.type)) {
        errors.push({ field: 'type', message: 'Invalid event type' });
    }

    if (!Array.isArray(event.tags)) {
        errors.push({ field: 'tags', message: 'Tags must be an array' });
    } else if (event.tags.some(tag => typeof tag !== 'string' || !tag.trim())) {
        errors.push({ field: 'tags', message: 'All tags must be non-empty strings' });
    }

    return {
        isValid: errors.length === 0,
        errors
    };
}

export const POST = async (request: NextRequest) => {
    try {
        await connectToDB();
        const openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY
        });

        // Get FormData from the request
        const formData = await request.formData();
        
        // Parse the JSON data
        const eventData: EventType = JSON.parse(formData.get('data') as string);
        const imageFile = formData.get('image') as File;

        // Validate the event data
        const { isValid, errors } = validateEvent(eventData);

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
        if (imageFile) {
            const uploadFormData = new FormData();
            uploadFormData.append('file', imageFile);
            const response = await fetch('http://localhost:3000/api/upload', {
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
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content: `
                    You are an expert event analyst. Your response must be a single paragraph and EXACTLY between 450 and 460 characters, including spaces. 
                    Count your characters and ensure compliance before completing the response. No exceptions. 
                    Rules:
                    - Write in a single paragraph
                    - Do not mention pricing
                    - Focus on event value and benefits
                    - Make it professional and engaging
                    - Do not use tags or bullet points
                    - End with a complete sentence
                    `
                },
                {
                    role: "user",
                    content: `Analyze this event:
                      Title: ${eventData.title}
                      Description: ${eventData.description}
                      City: ${eventData.location.city}, 
                      Country: ${eventData.location.country}
                      Target Audience: ${eventData.tags?.join(', ')}
                    `
                }
            ],
            temperature: 0.6,
            response_format: { type: "text" }                
        });

        // Create new event with defaults
        const newEvent: Partial<EventType> = {
            title: eventData.title,
            description: eventData.description,
            aiAnalysis: completion.choices[0].message.content || '',
            date: new Date(eventData.date || Date.now()),
            location: eventData.location,
            capacity: eventData.capacity,
            organizer: eventData.organizer,
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
};

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

        const total = await Event.countDocuments(filters);
        
        const events = await Event.find(filters)
        .sort(sortOptions)
        .skip(skip)
        .limit(limit);
        
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