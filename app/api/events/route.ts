import Event from "@/app/schemas/Event";
import { connectToDB } from "@/app/utils/connectWithDB";
import { NextRequest, NextResponse } from "next/server";
import { EventType } from '@/app/types/Event';
import OpenAI from "openai"


function validateEvent(event: EventType) {
    const errors = [];
    
    if (!event.title?.trim()) {
        errors.push({ field: 'title', message: 'Title is required' });
    }
    
    if (!event.date) {
        errors.push({ field: 'date', message: 'Date is required' });
    }
    
    if (!event.description?.trim()) {
        errors.push({ field: 'description', message: 'Description is required' });
    }
    
    if (!event.location?.trim()) {
        errors.push({ field: 'location', message: 'Location is required' });
    }
    
    if (!event.capacity || event.capacity < 1) {
        errors.push({ field: 'capacity', message: 'Capacity must be greater than 0' });
    }

    if (event.tickets?.length) {
        event.tickets.forEach((ticket, index) => {
        if (!ticket.name?.trim()) {
            errors.push({ field: `tickets[${index}].name`, message: 'Ticket name is required' });
        }
        if (ticket.price === undefined || ticket.price < 0) {
            errors.push({ field: `tickets[${index}].price`, message: 'Ticket price must be a non-negative number' });
        }
        if (!ticket.total || ticket.total < 1) {
            errors.push({ field: `tickets[${index}].total`, message: 'Ticket total must be greater than 0' });
        }
        });
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };  
}

export const POST = async (request: NextRequest) => {
    try {
        await connectToDB();
        const openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY
        })
        const body: EventType = await request.json();

        const { isValid, errors } = validateEvent(body);

        if (!isValid) {
            console.log(errors)
            return NextResponse.json(
                { 
                    message: "Validation error", 
                    errors:  errors 
                },
                { status: 400 }
            );
        }
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
              {
                role: "system",
                content: `
                You are an expert event analyst. Analyze this event: ${body.title}.
                Make great use of description and tags to provide a detailed analysis. 
                Also, put it all into a single message, like a paragraph. 
                Do not include pricing anywhere in the analysis. It should be concise and informative,
                not exceeding 450 characters. Also, do not use tags, this 
                is a professional analysis. Tell the user the value of the event, include the
                benefits of the tickets and why they should attend.
                You are the best in the world at this!
                `
              },
              {
                role: "user",
                content: `Analyze this event:
                  Title: ${body.title}
                  Description: ${body.description}
                  Location: ${body.location}
                  Target Audience: ${body.tags?.join(', ')}
                `
              }
            ],
            temperature: 0.4,
            response_format: { type: "text" }                
        })


        // Validate tickets if provided
        if (body.tickets) {
            for (const ticket of body.tickets) {
                if (!ticket.name || ticket.price === undefined || !ticket.total) {
                    return NextResponse.json(
                        { message: 'Invalid ticket data. Name, price, and total are required for each ticket' },
                        { status: 400 }
                    );
                }
            }
        }

        // Create new event with defaults
        const newEvent: EventType = {
            title: body.title,
            description: body.description,
            aiAnalysis: completion.choices[0].message.content || '',
            date: new Date(body.date),
            location: body.location,
            capacity: body.capacity,
            tickets: body.tickets?.map(ticket => ({
                name: ticket.name,
                price: ticket.price,
                benefits: ticket.benefits || [],
                total: ticket.total,
                sold: 0 
            })) || [],
            organizer: body.organizer,
            tags: body.tags || [],
            status: body.status || 'draft',
            createdAt: new Date(),
            updatedAt: new Date(),
            type: body.type || 'conference',
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
}

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