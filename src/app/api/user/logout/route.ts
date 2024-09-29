import connectDB from "@/app/db/connectDB";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const token = request.cookies.get("token");
    if (!token) {
      return NextResponse.json({ error: "Not logged in" }, { status: 401 });
    }
    const response = NextResponse.json({
      message: "Logout successful",
    });
    response.cookies.set("token", "", { httpOnly: true, expires: new Date(0) });
    return response;
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
