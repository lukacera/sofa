import { connectToDB } from "@/app/utils/connectWithDB";
import { NextRequest, NextResponse } from "next/server";
import User from "@/app/schemas/User";
import mongoose from "mongoose";
import { EventSchema } from "@/app/schemas/Event";
import OpenAI from "openai";
import { EventType } from "@/app/types/Event";
import crypto from "crypto";
import stableStringify from "json-stable-stringify";

const InsightSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  pros: [{
    type: String
  }],
  cons: [{
    type: String
  }],
  lastUpdated: {
    type: Date,
    required: true
  },
  eventHash: {
    type: String,
    required: true
  }
}, { timestamps: true });

// Create the model if it doesn't exist
const Insight = mongoose.models.Insight || mongoose.model('Insight', InsightSchema);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Cache duration - 24 hours in milliseconds
const CACHE_DURATION = 24 * 60 * 60 * 1000;

export async function GET(
    req: NextRequest,
    { params }: { params: { email: string } }
): Promise<NextResponse> {
    try {
        await connectToDB();
        const { email } = await params;

        if (!mongoose.models.Event) {
            mongoose.model('Event', EventSchema);
        }

        const user = await User.findOne({ email }).populate("eventsCreated");

        if (!user) {
            return NextResponse.json(
                { 
                    message: "User not found",
                    pros: [],
                    cons: []
                },
                { status: 404 }
            );
        }

        const events = user.eventsCreated || [];
        
        // Generate a hash of the events data to detect changes
        const eventHash = generateEventHash(events);
        
        // Check for cached insights
        const cachedInsights = await Insight.findOne({
            userId: user._id,
            eventHash: eventHash
        });

        // If we have valid cached insights, return them
        if (cachedInsights && isInsightValid(cachedInsights.lastUpdated)) {
            return NextResponse.json({
                pros: cachedInsights.pros,
                cons: cachedInsights.cons
            }, 
            { status: 200 });
        }

        // Generate new insights
        const {cons, pros} = await generateAIInsights(events);

        // Update or create cache
        await Insight.findOneAndUpdate(
            { userId: user._id },
            {
                pros: pros,
                cons: cons,
                lastUpdated: new Date(),
                eventHash: eventHash
            },
            { upsert: true, new: true }
        );

        return NextResponse.json({
            pros: pros,
            cons: cons
        }, { status: 200 });

    } catch (error) {
        console.error("Error generating insights:", error);
        return NextResponse.json(
            { 
                message: "User not found",
                pros: [],
                cons: []
            },
            { status: 500 }
        );
    }
}

function generateEventHash(events: EventType[]): string {
    // Create a string that represents the current state of events
    const eventData = events.map(event => ({
        id: event._id,
        attendees: event.attendees.length,
        updatedAt: event.updatedAt
    }));
    const serializedData = stableStringify(eventData);
    return crypto.createHash('md5').update(serializedData).digest('hex');
}

function isInsightValid(lastUpdated: Date): boolean {
    const now = new Date();
    const timeDiff = now.getTime() - lastUpdated.getTime();
    return timeDiff < CACHE_DURATION;
}

async function generateAIInsights(events: EventType[]) : Promise<{pros: string[], cons: string[]}> {
    if (events.length === 0) return {
        pros: [],
        cons: []
    };

    const eventData = events.map(event => ({
        title: event.title,
        type: event.type,
        attendeeCount: event.attendees.length,
        capacity: event.capacity,
        description: event.description,
        date: new Date(event.date).toISOString(),
        location: event.location,
    }));

    const prompt = `As an event analytics expert, analyze this event data and provide:
    1. Three specific strengths or successful aspects (pros)
    2. Three areas that need improvement or attention (cons)
    Format the response as a JSON object with two arrays: "pros" and "cons", each containing exactly 3 strings.
    Be specific and actionable in your analysis.

    Event Data:${JSON.stringify(eventData, null, 2)}`;

    try {
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content: "You are an expert event analyzer. Provide clear, specific, and actionable insights about event performance patterns. Focus on concrete metrics and practical improvements."
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            temperature: 1,
            response_format: { type: "json_object" }
        });

        const aiResponse:{ 
            pros: string[],
            cons: string[]
        } = JSON.parse(response.choices[0].message.content || "{}");
        
        
        // Return the pros and cons separately
        return {
            pros: aiResponse.pros,
            cons: aiResponse.cons
        };

    } catch (error) {
        console.error("Error generating AI insights:", error);
        return {
            pros: [],
            cons: []
        };
    }
}