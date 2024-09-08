import connectDB from "@/app/db/connectDB";
import User from "@/app/models/users";
import { NextRequest, NextResponse } from "next/server";

interface Params {
  code: string;
}

export async function POST(
  request: NextRequest,
  { params }: { params: Params }
) {
  try {
    await connectDB();

    const { code } = params;

    const user = await User.findOne({
      verifyToken: code,
      verifyTokenExpiry: { $gt: Date.now() },
    });

    if (!user) {
      console.log("User not found or token expired");
      return NextResponse.json({ message: "Invalid token" }, { status: 400 });
    }

    user.isVerfied = true;
    user.verifyToken = undefined;
    user.verifyTokenExpiry = undefined;

    await user.save();

    return NextResponse.json({ message: "Account verified" }, { status: 200 });
  } catch (error) {
    console.error("Error verifying account:", error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
