import connectDB from "@/app/db/connectDB";
import { cookieExtraction } from "@/app/helpers/generateToken";
import Organization from "@/app/models/organization";
import User from "@/app/models/users";
import { NextRequest, NextResponse } from "next/server";

type Params = {
  organizationId: string;
};

// Update organization
export async function PUT(
  request: NextRequest,
  { params }: { params: Params }
) {
  try {
    await connectDB();

    // Extract the decoded user info from the cookies
    const decoded = await cookieExtraction();
    if (!decoded) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, description, project, members } = await request.json();

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const _id = decoded._id as string;

    // Find the user by their ID
    const user = await User.findById(_id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Update the organization
    const organization = await Organization.findByIdAndUpdate(
      params.organizationId,
      {
        name,
        description,
        project,
        members,
        updatedBy: user._id,
      },
      { new: true }
    );

    if (!organization) {
      return NextResponse.json(
        { error: "Error Updating Organization" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Organization updated successfully!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating organization:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

// Delete organization
export async function DELETE(
  request: NextRequest,
  { params }: { params: Params }
) {
  try {
    await connectDB();

    // Extract the decoded user info from the cookies
    const decoded = await cookieExtraction();
    if (!decoded) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const _id = decoded._id as string;

    // Find the user by their ID
    const user = await User.findById(_id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Delete the organization by its ID
    const organization = await Organization.findByIdAndDelete(
      params.organizationId
    );

    if (!organization) {
      return NextResponse.json(
        { error: "Error Deleting Organization" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Organization deleted successfully!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting organization:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
