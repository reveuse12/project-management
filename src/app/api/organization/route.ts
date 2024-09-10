import User from "@/app/models/users";
import { NextRequest, NextResponse } from "next/server";
import { cookieExtraction } from "@/app/helpers/generateToken";
import connectDB from "@/app/db/connectDB";
import Organization from "@/app/models/organization";

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const decoded = await cookieExtraction();

    if (!decoded)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { name, description, project, members } = await request.json();
    if (!name)
      return NextResponse.json({ error: "Name is required" }, { status: 400 });

    // decrypt the token and get the user id
    const _id = decoded._id as string;

    const user = await User.findById(_id);
    if (!user)
      return NextResponse.json({ error: "User not found" }, { status: 404 });

    // create organization
    const organization = await Organization.create({
      name,
      description,
      project,
      members,
      admin: user._id,
      createdBy: user._id,
      updatedBy: user._id,
    });

    // add organization to user's organizations array
    user.organizations.push(organization._id);
    await user.save();

    if (!organization)
      return NextResponse.json(
        { error: "Error Creating Organization" },
        { status: 500 }
      );

    return NextResponse.json(
      { message: "Organization created success!" },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

// Get all organizations
export async function GET() {
  try {
    await connectDB();

    const decoded = await cookieExtraction();

    if (!decoded)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const _id = decoded._id as string;

    const user = await User.findById(_id).populate("organizations");
    if (!user)
      return NextResponse.json({ error: "User not found" }, { status: 404 });

    return NextResponse.json(
      { organizations: user.organizations },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
