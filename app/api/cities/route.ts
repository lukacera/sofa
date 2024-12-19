import { NextResponse } from "next/server";
import { connectToDB } from "@/app/utils/connectWithDB";
import Event from "@/app/schemas/Event";

// Force dynamic rendering if necessary
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    await connectToDB();

    // Extract query parameter
    const url = new URL(request.url);
    const searchQuery = url.searchParams.get("query")?.trim().toLowerCase() || "";

    // Define aggregation pipeline
    const pipeline = [
      {
        $match: {
          "location.city": searchQuery
            ? { $regex: searchQuery, $options: "i" }
            : { $ne: null },
        },
      },
      { $group: { _id: "$location.city" } },
      { $project: { city: "$_id", _id: 0 } },
    ];

    // Aggregate cities
    const agg = await Event.aggregate(pipeline);
    const cities = agg.map((item) => item.city);

    // Respond with JSON
    return NextResponse.json(
      {
        cities,
        count: cities.length,
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching cities:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch cities",
        message: "An error occurred while retrieving event cities",
      },
      { status: 500 }
    );
  }
}
