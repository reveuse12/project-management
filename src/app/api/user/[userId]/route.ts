import connectDB from "@/app/db/connectDB";
import Organization from "@/app/models/organization";
import User from "@/app/models/users";
import { NextRequest, NextResponse } from "next/server";

type Params = {
  userId: string;
};

export async function GET(
  request: NextRequest,
  { params }: { params: Params }
) {
  try {
    await connectDB();
    const { userId } = params;
    console.log(userId);

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const user = await User.findById(userId).populate({
      path: "organizations.organization",
      model: Organization,
    });

    // Check if user exists
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Return user's organizations
    return NextResponse.json(
      { organizations: user.organizations },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching organizations:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
