import { NextResponse } from "next/server"
import OpenAI from "openai"

export async function GET() {
    try {
       
        
      
        return NextResponse.json({
            message: 'Success',
            content: completion.choices[0].message.content
        })
    } catch (error) {
        console.error('AI request failed:', error)
        return NextResponse.json({ error: "AI request failed" }, { status: 500 })
    }
}