import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function POST(request: Request) {
  try {
    const { title, eventType, description, city } = await request.json();

    if (description.length > 250) return NextResponse.json({ 
        description: ""
    });
    
    const prompt = `Generate an engaging event description for:
    Event Title: ${title},
    Event Type: ${eventType},
    Current Description: "${description ?? "No description provided"},
    City: ${city}
    Create a compelling 2-3 paragraph description that:
    - Hooks the reader in the first sentence
    - Describes key benefits of attending
    - Uses professional but engaging language
    - Includes a call to action
    - Is between 400-500 characters (strictly enforce this limit).
    Focus on creating excitement while maintaining professionalism.
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are an expert event marketer writing compelling event descriptions. 
            Your responses must be engaging and strictly between 400-500 characters.`
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7
    });

    const richenDescriptipn = response.choices[0].message.content;

    return NextResponse.json({ 
        description: richenDescriptipn
     });
  } catch (error) {
    console.error("Error generating description:", error);
    return NextResponse.json(
      { error: "Failed to generate description" },
      { status: 500 }
    );
  }
}