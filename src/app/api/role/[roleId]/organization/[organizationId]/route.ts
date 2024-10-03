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
    const { users } = await request.json();

    // Validate inputs
    if (
      !roleId ||
      !organizationId ||
      !Array.isArray(users) ||
      users.length === 0
    ) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    // Get the logged-in user's info
    const decoded = await cookieExtraction();
    if (!decoded || !decoded._id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Find the organization
    const organization = await Organization.findById(organizationId);
    if (!organization) {
      return NextResponse.json(
        { error: "Organization not found" },
        { status: 404 }
      );
    }

    // Update users' roles in their organizations array
    const updateUserPromises = users.map(async (member) => {
      return User.findByIdAndUpdate(
        member.userId,
        {
          $addToSet: {
            organizations: {
              organization: new mongoose.Types.ObjectId(organizationId),
              role: new mongoose.Types.ObjectId(roleId),
            },
          },
        },
        { new: true } // Return the updated user document
      );
    });

    const updatedUsers = await Promise.all(updateUserPromises);

    console.log("Updated users", updatedUsers);

    // Ensure updated users exist
    if (!updatedUsers || updatedUsers.length === 0) {
      return NextResponse.json(
        { error: "Users not found or updated" },
        { status: 404 }
      );
    }

    // Update organization members with the new roles
    const updateOrganization = await Organization.updateOne(
      { _id: organizationId },
      {
        $addToSet: {
          members: {
            $each: users.map((member) => ({
              user: new mongoose.Types.ObjectId(member.userId),
              role: new mongoose.Types.ObjectId(roleId),
            })),
          },
        },
      }
    );

    if (!updateOrganization.modifiedCount) {
      return NextResponse.json(
        { error: "Failed to update organization members" },
        { status: 500 }
      );
    }

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
