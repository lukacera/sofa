import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/app/utils/connectWithDB";
import Event from "@/app/schemas/Event";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    await connectToDB();

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "10");    

    const tagsAggregation = await Event.aggregate([
      { 
        $match: { 
          status: "published"
        } 
      },
      { $unwind: "$tags" },
      { 
        $group: { 
          _id: "$tags",
          eventCount: { $sum: 1 },
          // Calculate total registered attendees for events with this tag
          totalAttendees: { $sum: { $size: "$attendees" } },
          // Keep track of the most recent usage
          lastUsed: { $max: "$date" }
        } 
      },

      // Sort by event count in descending order (most used first)
      { 
        $sort: { 
          eventCount: -1
        } 
      },
      // Shape the final output
      { 
        $project: { 
          _id: 0,
          tag: "$_id",
          eventCount: 1,
          totalAttendees: 1,
          lastUsed: 1
        } 
      },
      { $limit: limit }
    ]);

    // Transform the response to be more frontend-friendly
    const tags = tagsAggregation.map(item => ({
      name: item.tag,
      eventCount: item.eventCount,
      totalAttendees: item.totalAttendees,
      lastUsed: item.lastUsed
    }));

    const response = NextResponse.json(
      { 
        tags,
        count: tags.length,
        timestamp: new Date().toISOString(),
        metadata: {
          period: "90 days",
          totalEventsWithTags: tags.reduce((sum, tag) => sum + tag.eventCount, 0),
          totalAttendeesAcrossTags: tags.reduce((sum, tag) => sum + tag.totalAttendees, 0)
        }
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