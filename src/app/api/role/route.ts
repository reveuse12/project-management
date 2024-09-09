import connectDB from "@/app/db/connectDB";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const { role, user, permission } = await request.json();
    return NextResponse.json(
      { message: "Role created successfully." },
      { status: 200 }
    );
  } catch (error: unknown) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
