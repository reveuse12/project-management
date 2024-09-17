import connectDB from "@/app/db/connectDB";
import User from "@/app/models/users";
import { NextRequest, NextResponse } from "next/server";
import { generateTokenAndRefreshTokens } from "@/app/helpers/generateToken";
import { LoginRequestBody } from "@/app/helpers/types";

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const { username, password }: LoginRequestBody = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { message: "Please fill all the fields" },
        { status: 400 }
      );
    }

    const user = await User.findOne({ username }).select(
      "+password +isVerfied"
    );

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    if (!user.isVerfied) {
      return NextResponse.json(
        { message: "User not verified" },
        { status: 400 }
      );
    }

    // Compare the password
    const isMatch = await user.isPasswordCorrect(password);

    if (!isMatch) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 400 }
      );
    }

    // Generate tokens
    const { accessToken, refreshToken } = await generateTokenAndRefreshTokens(
      user._id.toString()
    );

    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    };

    const headers = new Headers();
    headers.append(
      "Set-Cookie",
      `token=${accessToken}; HttpOnly; Secure=${options.secure}; SameSite=${options.sameSite}; Path=${options.path}; Max-Age=${options.maxAge}`
    );
    headers.append(
      "Set-Cookie",
      `refreshToken=${refreshToken}; HttpOnly; Secure=${options.secure}; SameSite=${options.sameSite}; Path=${options.path}; Max-Age=${options.maxAge}`
    );

    return NextResponse.json(
      { message: "Login Success", accessToken, refreshToken },
      {
        status: 200,
        headers: headers,
      }
    );
  } catch (error) {
    console.error("Error during login:", error);
    return NextResponse.json({ message: "An error occurred" }, { status: 500 });
  }
}
