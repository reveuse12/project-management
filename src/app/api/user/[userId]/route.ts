import connectDB from "@/app/db/connectDB";
import { cookieExtraction } from "@/app/helpers/generateToken";
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
    console.log(request);

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const user = await User.findById(userId)
      .populate({
        path: "organizations.organization",
        model: Organization,
        select: "+name",
      })
      .lean();

    // Check if user exists
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    console.log(user);

    // Return user's organizations
    return NextResponse.json({ organizations: user }, { status: 200 });
  } catch (error) {
    console.error("Error fetching organizations:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Params }
) {
  try {
    await connectDB();

    const { userId } = params;

    const { username, fullname, email } = await request.json();

    if (!username || !fullname || !email || !userId) {
      return NextResponse.json(
        { message: "Please fill all the fields" },
        { status: 400 }
      );
    }
    const decoded = await cookieExtraction();

    if (!decoded) {
      return NextResponse.json({ message: "Unauthorized!!" }, { status: 401 });
    }

    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json({ message: "user not found" }, { status: 400 });
    }

    user.username = username;
    user.fullname = fullname;
    user.email = email;
    await user.save();

    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Params }
) {
  try {
    await connectDB();

    const { userId } = params;
    const { currentPassword, newPassword } = await request.json();
    if (!currentPassword || !newPassword || !userId) {
      return NextResponse.json(
        { message: "Please fill all the fields" },
        { status: 400 }
      );
    }

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const isPasswordValid = await user.isPasswordCorrect(currentPassword);
    if (!isPasswordValid) {
      return NextResponse.json(
        { message: "Incorrect password" },
        { status: 401 }
      );
    }
    user.password = newPassword;
    await user.save();

    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    console.error("Error changing password:", error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
