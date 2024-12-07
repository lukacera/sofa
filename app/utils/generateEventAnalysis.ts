import OpenAI from "openai";
import { EventType } from "../types/Event";

async function generateEventAnalysis(eventData: Partial<EventType>) {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
   
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
            - End with a complete sentence
          `
        },
        {
          role: "user", 
          content: `Analyze this event:
            Title: ${eventData.title}
            Description: ${eventData.description}
            City: ${eventData.location?.city || 'N/A'}, 
            Country: ${eventData.location?.country || 'N/A'}
            Target Audience: ${eventData.tags?.join(', ') || 'N/A'}
          `
        }
      ],
      temperature: 0.6,
      response_format: { type: "text" }                
    });
   
    return completion.choices[0].message.content;
   }
   
   export { generateEventAnalysis };