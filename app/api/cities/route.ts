import { NextResponse } from "next/server";
import { connectToDB } from "@/app/utils/connectWithDB";
import Event from "@/app/schemas/Event";

export const revalidate = 300; // 5 minutes in seconds

export async function GET() {
  try {
    await connectToDB();

    const agg = await Event.aggregate([
      { $group: { _id: "$location.city" } },
      { $project: { city: "$_id", _id: 0 } }
    ]);

    const cities = agg.map(item => item.city);

    const response = NextResponse.json(
      { 
        cities, 
        count: cities.length,
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    );
    
    return response;

  } catch (error) {
    console.error("Error fetching cities:", error);
    
    return NextResponse.json(
      { 
        error: "Failed to fetch cities",
        message: "An error occurred while retrieving event cities"
      },
      { status: 500 }
    );
  }
}