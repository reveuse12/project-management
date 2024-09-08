import User from "@/app/models/users";
import { NextRequest, NextResponse } from "next/server";

interface Params {
  userId: string;
}

export async function POST(
  request: NextRequest,
  { params }: { params: Params }
) {
  try {
    const { userId } = params;
    const { name } = await request.json();
    if (!name)
      return NextResponse.json({ error: "Name is required" }, { status: 400 });

    const user = await User.findOne({ _id: userId });
    if (!user)
      return NextResponse.json({ error: "User not found" }, { status: 404 });

    const organization = await User.create({
      name,
      createdBy: userId,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
