import { NextResponse } from "next/server";
import { connectToDB } from "@/app/utils/connectWithDB";
import Event from "@/app/schemas/Event";

export const revalidate = 300; // 5 minutes in seconds

export async function GET() {
  try {
    await connectToDB();
    
    const tagsAggregation = await Event.aggregate([
      { $match: { status: "published" } },
      { $unwind: "$tags" },
      { $group: { _id: "$tags" } },
      { $sort: { _id: 1 } },
      { $project: { _id: 0, tag: "$_id" } }
    ]);

    const tags = tagsAggregation.map(item => item.tag);

    const response = NextResponse.json(
      { 
        tags, 
        count: tags.length,
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    );
    
    return response;

  } catch (error) {
    console.error("Error fetching tags:", error);
    
    return NextResponse.json(
      { 
        error: "Failed to fetch tags",
        message: "An error occurred while retrieving event tags"
      },
      { status: 500 }
    );
  }
}