import { cookieExtraction } from "@/app/helpers/generateToken";
import User from "@/app/models/users";
import Organization from "@/app/models/organization";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

interface Params {
  roleId: string;
  organizationId: string;
}

export async function POST(
  request: NextRequest,
  { params }: { params: Params }
) {
  try {
    const { roleId, organizationId } = params;

    // Parse the request body to get the array of user IDs
    const { users } = await request.json();

    // Validate request data
    if (
      !roleId ||
      !organizationId ||
      !Array.isArray(users) ||
      users.length === 0
    ) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    // Extract and verify authentication from cookies
    const decoded = await cookieExtraction();
    if (!decoded || !decoded._id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if the organization exists
    const organization = await Organization.findById(organizationId);
    if (!organization) {
      return NextResponse.json(
        { error: "Organization not found" },
        { status: 404 }
      );
    }

    // Update users' roles in their organizations array
    const updateUserPromises = users.map(async (userId) => {
      console.log(
        "Updating user:",
        userId,
        "with organizationId:",
        organizationId,
        "and roleId:",
        roleId
      );

      // Find and update each user
      return User.findByIdAndUpdate(
        userId,
        {
          $addToSet: {
            organizations: {
              organization: new mongoose.Types.ObjectId(organizationId), // Ensure this is correct in your schema
              role: new mongoose.Types.ObjectId(roleId), // Ensure this is correct in your schema
            },
          },
        },
        { new: true } // Return the updated user document
      );
    });

    // Execute all user update promises
    const updatedUsers = await Promise.all(updateUserPromises);

    // Log the updated users for debugging
    console.log("Updated Users:", updatedUsers);

    if (!updatedUsers || updatedUsers.length === 0) {
      return NextResponse.json(
        { error: "Users not found or updated" },
        { status: 404 }
      );
    }

    // Return the updated users' IDs
    return NextResponse.json({
      success: true,
      message: "Roles assigned successfully",
      updatedUsers: updatedUsers.map((user) => user?._id),
    });
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
