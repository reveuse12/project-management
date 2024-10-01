import connectDB from "@/app/db/connectDB";
import { cookieExtraction } from "@/app/helpers/generateToken";
import { sendEmail } from "@/app/helpers/sendMail";
import User from "@/app/models/users";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    await connectDB();
    console.log(request, "request-reset-api");
    const decoded = await cookieExtraction();
    if (!decoded) {
      return NextResponse.json({ message: "Unauthorized!!" }, { status: 401 });
    }

    const user = await User.findById(decoded._id);

    if (!user) {
      return NextResponse.json({ message: "user not found" }, { status: 400 });
    }
    user.isVerfied = false;
    user.save();

    await sendEmail({
      email: user.email,
      emailType: "RESET",
      userId: user._id,
    });
    return NextResponse.json({ message: "reset Link sent!" }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        error,
      },
      { status: 500 }
    );
  }
}
