import connectDB from "@/app/db/connectDB";
import { sendEmail } from "@/app/helpers/sendMail";
import User from "@/app/models/users";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const { username, fullname, email, password } = await request.json();
    if (!username || !fullname || !email || !password) {
      return NextResponse.json(
        { message: "Please fill all the fields" },
        { status: 400 }
      );
    }
    const alreadyUser = await User.findOne({ username });

    if (alreadyUser) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 400 }
      );
    }

    const newUser = await User.create({
      username: username,
      fullname: fullname,
      email,
      password,
    });

    const createdUser = await User.findById(newUser._id).select(
      "-password -refreshToken"
    );

    if (!createdUser)
      return NextResponse.json(
        { message: "Error while creating new user" },
        { status: 500 }
      );

    await sendEmail({
      email,
      emailType: "VERIFY",
      userId: createdUser._id,
    });
    return NextResponse.json(
      { message: "Verification e-mail sent!" },
      { status: 201 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: error }, { status: 500 });
  }
}
