import { NextResponse } from "next/server"
import OpenAI from "openai"

export async function GET() {
    try {
        const openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY
        })
        
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
              {
                role: "system",
                content: `You are an elite sports journalist known for deep tactical analysis and compelling storytelling. Your expertise spans European basketball leagues and you specialize in analyzing high-stakes rivalry games. Provide detailed analysis in JSON format covering:

                1. tactical_analysis: Breakdown of key strategies, plays, and adjustments
                2. player_performance: Individual player impact and statistics
                3. momentum_shifts: Critical moments that changed game dynamics
                4. atmosphere: Fan energy, arena environment, historical context
                5. coaching_decisions: Key substitutions, timeouts, strategic choices
                6. matchup_analysis: Head-to-head player battles and mismatches
                7. historical_context: Past meetings, rivalry significance
                8. future_implications: Impact on standings, upcoming games`              },
              {
                role: "user",
                content: `Analyze this event:
                  Title: Kk beko - kk beovuk, hala Vuk Karadzic
                  Description: The basketball game between KK Beko and KK Beovuk will take place at the Vuk Karadzic Hall. The game is part of the national basketball league.
                  Target Audience: Basketball fans, sports enthusiasts
                  Price: 10 EUR
                  Key players: Marko Markovic, Nikola Nikolic, Luka Ceranic, Vojin Durutovic

                `
              }
            ],
            temperature: 0.7,
            response_format: { type: "json_object" }
          })
      
        return NextResponse.json({
            message: 'Success',
            content: completion.choices[0].message.content
        })
    } catch (error) {
        console.error('AI request failed:', error)
        return NextResponse.json({ error: "AI request failed" }, { status: 500 })
    }
}