import { cookieExtraction } from "@/app/helpers/generateToken";
import User from "@/app/models/users";
import Organization from "@/app/models/organization";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

interface Params {
  roleId: string;
  organizationId: string;
  userId: string;
}

export async function POST(
  request: NextRequest,
  { params }: { params: Params }
) {
  try {
    const { roleId, organizationId, userId } = params;

    // Extract the authenticated user information (e.g., the admin or creator)
    const decoded = await cookieExtraction();
    if (!decoded) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Find the organization by organizationId
    const organization = await Organization.findById(organizationId);
    if (!organization) {
      return NextResponse.json(
        { error: "Organization not found" },
        { status: 404 }
      );
    }

    // Check if the user is already a member of the organization
    const isUserAlreadyMember = organization.members.some(
      (member: { user: { toString: () => string } }) =>
        member.user.toString() === userId
    );
    if (isUserAlreadyMember) {
      return NextResponse.json(
        { error: "User is already a member" },
        { status: 400 }
      );
    }

    // Validate if the user and role exist
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (!mongoose.Types.ObjectId.isValid(roleId)) {
      return NextResponse.json({ error: "Invalid role ID" }, { status: 400 });
    }

    // Add the user to the organization with the specified role
    organization.members.push({
      user: userId,
      role: roleId,
    });

    // Update the `updatedBy` field with the authenticated user's ID
    organization.updatedBy = decoded._id;

    // Save the organization with the new member
    await organization.save();

    return NextResponse.json(
      {
        organization,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
