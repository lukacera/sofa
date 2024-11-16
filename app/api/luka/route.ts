import { NextRequest, NextResponse } from 'next/server';

export function GET() {
    // Handle GET request
    return NextResponse.json({ message: 'Hello, this is a GET request!' }, {
        status: 200,
    });
}

export async function POST(req: NextRequest) {
    // Handle POST request
    const formData = await req.formData();
    const name = formData.get('name');

    return NextResponse.json({ 
        message: `Hello, this is a GET request! ${name}` 
    }, {
        status: 200,
    });
}
