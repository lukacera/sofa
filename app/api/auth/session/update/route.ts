import { NextResponse } from "next/server";
import { auth } from "@/auth";
import User from "@/app/schemas/User";
import { connectToDB } from "@/app/utils/connectWithDB";

export async function POST() {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDB();
    const user = await User.findOne({ email: session.user.email });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Update the session with new user data
    const updatedSession = {
      ...session,
      user: {
        id: user._id.toString(),
        email: user.email,
        image: user.image,
        name: user.name,
        role: user.role,
        description: user.description || "",
        location: user.location || "",
      },
    };

    return NextResponse.json(updatedSession);
  } catch (error) {
    console.error("Session update error:", error);
    return NextResponse.json(
      { error: "Failed to update session" },
      { status: 500 }
    );
  }
}