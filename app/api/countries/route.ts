import { NextResponse } from "next/server";
import { connectToDB } from "@/app/utils/connectWithDB";
import Event from "@/app/schemas/Event";

export async function GET() {
  try {
    await connectToDB();

    const agg = await Event.aggregate([
      { $group: { _id: "$location.country" } },
      { $project: { city: "$_id", _id: 0 } }
    ]);

    const countries = agg.map(item => item.city);

    const response = NextResponse.json(
      { 
        countries, 
        count: countries.length,
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    );
    
    return response;

  } catch (error) {
    console.error("Error fetching countries:", error);
    
    return NextResponse.json(
      { 
        error: "Failed to fetch countries",
        message: "An error occurred while retrieving event countries"
      },
      { status: 500 }
    );
  }
}