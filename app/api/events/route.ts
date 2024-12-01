import Event from "@/app/schemas/Event";
import { connectToDB } from "@/app/utils/connectWithDB";
import { NextRequest, NextResponse } from "next/server";
import { EventType } from '@/app/types/Event';
import OpenAI from "openai"
import mongoose from "mongoose";

export const config = {
    api: {  
      bodyParser: false, // Disable the built-in bodyParser
    },
};

function validateEvent(event: EventType) {
    const errors = [];
    
    // Required string fields
    if (!event.title?.trim()) {
        errors.push({ field: 'title', message: 'Title is required' });
    }
    
    if (!event.description?.trim()) {
        errors.push({ field: 'description', message: 'Description is required' });
    }
    
    if (!event.location?.trim()) {
        errors.push({ field: 'location', message: 'Location is required' });
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
    
    // Capacity validation
    if (!event.capacity || event.capacity < 1) {
        errors.push({ field: 'capacity', message: 'Capacity must be greater than 0' });
    }

    // Organizer validation
    if (!event.organizer) {
        errors.push({ field: 'organizer', message: 'Organizer is required' });
    }

    // Status validation
    const validStatuses = ['draft', 'published', 'cancelled'];
    if (!event.status || !validStatuses.includes(event.status)) {
        errors.push({ field: 'status', message: 'Status must be either draft, published, or cancelled' });
    }

    // Type validation
    const validTypes = ['conference', 'workshop', 'seminar', 'meetup', 'other'];
    if (!event.type || !validTypes.includes(event.type)) {
        errors.push({ field: 'type', message: 'Invalid event type' });
    }

    // Tags validation
    if (!Array.isArray(event.tags)) {
        errors.push({ field: 'tags', message: 'Tags must be an array' });
    } else if (event.tags.some(tag => typeof tag !== 'string' || !tag.trim())) {
        errors.push({ field: 'tags', message: 'All tags must be non-empty strings' });
    }

    // Tickets validation
    // if (event.tickets?.length) {
    //     event.tickets.forEach((ticket, index) => {
    //         if (!["free", "paid"].includes(ticket.type?.trim())) {
    //             errors.push({ field: `tickets[${index}].name`, message: 'Ticket name is required' });
    //         }
    //         if (ticket.price === undefined || ticket.price < 0) {
    //             errors.push({ field: `tickets[${index}].price`, message: 'Ticket price must be a non-negative number' });
    //         }
    //         if (!ticket.total || ticket.total < 1) {
    //             errors.push({ field: `tickets[${index}].total`, message: 'Ticket total must be greater than 0' });
    //         }
    //         if (ticket.sold !== undefined && (ticket.sold < 0 || ticket.sold > ticket.total)) {
    //             errors.push({ field: `tickets[${index}].sold`, message: 'Sold tickets must be between 0 and total tickets' });
    //         }
    //         if (!Array.isArray(ticket.benefits)) {
    //             errors.push({ field: `tickets[${index}].benefits`, message: 'Benefits must be an array' });
    //         } else if (ticket.benefits.some(benefit => typeof benefit !== 'string' || !benefit.trim())) {
    //             errors.push({ field: `tickets[${index}].benefits`, message: 'All benefits must be non-empty strings' });
    //         }
    //     });
    // }

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
        const eventData = JSON.parse(formData.get('data') as string);
        const imageFile = formData.get('image') as File;

        console.log("Mongo schemas:", mongoose.models);

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

        // OpenAI completion
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content: `
                    You are an expert event analyst. Your task is to analyze events and provide EXACTLY 450 character analyses - no more, no less.
                    When analyzing the event, create a compelling summary using the description and tags provided.
                    Rules:
                    - The response MUST be EXACTLY between 450 and 460 characters
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
                      Location: ${eventData.location}
                      Target Audience: ${eventData.tags?.join(', ')}
                    `
                }
            ],
            max_tokens: 112,
            temperature: 0.4,
            response_format: { type: "text" }                
        });

        console.log("imageFile:", imageUrl);
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

export const GET = async () => {
    try {
        await connectToDB();
        const events = await Event.find();
        return NextResponse.json({ events: events }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Internal error in route.ts' }, { status: 500 });
    }
};