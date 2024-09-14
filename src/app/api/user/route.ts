import User from "@/app/models/users";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // get user id and get user information
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const user = await User.findById(userId).populate("organizations");
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    // return user information
    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "error" }, { status: 500 });
  }
}
