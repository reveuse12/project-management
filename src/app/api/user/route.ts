import connectDB from "@/app/db/connectDB";
import { cookieExtraction } from "@/app/helpers/generateToken";
import User from "@/app/models/users";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    connectDB();

    const decoded = await cookieExtraction();

    if (!decoded) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = decoded._id;
    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // fetch all user
    const users = await User.find();
    if (!users || !Array.isArray(users)) {
      return NextResponse.json({ error: "No user found" }, { status: 404 });
    }

    return NextResponse.json({ users }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "error" }, { status: 500 });
  }
}
