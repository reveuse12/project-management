import connectDB from "@/app/db/connectDB";
import { cookieExtraction } from "@/app/helpers/generateToken";
import Organization from "@/app/models/organization";
import User from "@/app/models/users";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();

    const decoded = await cookieExtraction();

    if (!decoded) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = decoded._id;
    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const getOrganizationsNames = await Promise.all(
      user.organizations.map(
        async (organization: { _id: string; name: string }) => {
          const org = await Organization.findById(organization._id).select(
            "_id name"
          );
          return org
            ? { _id: org._id, name: org.name }
            : { _id: organization._id, name: "Unknown Organization" };
        }
      )
    );

    const userWithOrganizationNames = {
      _id: user._id,
      username: user.username,
      fullname: user.fullname,
      email: user.email,
      isVerified: user.isVerified,
      isSuperAdmin: user.isSuperAdmin,
      organizations: getOrganizationsNames,
    };

    return NextResponse.json(
      { user: userWithOrganizationNames },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
