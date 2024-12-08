import { NextResponse } from "next/server";
import { connectToDB } from "@/app/utils/connectWithDB";
import Event from "@/app/schemas/Event";

export async function GET(request: Request) {
  try {
    await connectToDB();

    const url = new URL(request.url);
    const searchQuery = url.searchParams.get("query")?.toLowerCase() || "";

    const pipeline = [
      // If there's a search query, add a $match stage
      ...(searchQuery
        ? [
            {
              $match: {
                "location.city": { $regex: searchQuery, $options: "i" },
              },
            },
          ]
        : []),
      { $group: { _id: "$location.city" } },
      { $project: { city: "$_id", _id: 0 } },
    ];

    const agg = await Event.aggregate(pipeline);

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
