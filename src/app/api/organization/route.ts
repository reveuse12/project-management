import connectDB from "@/app/db/connectDB";
import { NextRequest, NextResponse } from "next/server";
import User from "@/app/models/users";
import { cookieExtraction } from "@/app/helpers/generateToken";
import Organization from "@/app/models/organization";

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const decoded = await cookieExtraction();

    if (!decoded)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { name, description, projects, members } = await request.json();
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
      projects,
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
    console.log(error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await connectDB();
    const decoded = await cookieExtraction();

    if (!decoded) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const _id = decoded._id as string;
    const user = await User.findById(_id).select("organizations");

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Fetch organizations with populated admin details
    const organizations = await Organization.find({
      _id: { $in: user.organizations },
    }).select("name description members admin");

    if (!organizations || organizations.length === 0) {
      return NextResponse.json(
        { error: "No Organizations Found" },
        { status: 404 }
      );
    }

    const cleanedOrganizations = await Promise.all(
      organizations.map(async (org) => {
        const admin = await User.findById(org.admin).select("fullname").lean();
        return {
          _id: org._id,
          name: org.name,
          description: org.description,
          members: org.members.map(
            (member: { user: string; role: string; _id: string }) => ({
              user: member.user,
              role: member.role,
              _id: member._id,
            })
          ),
          admin: admin ? { _id: admin._id, fullname: admin.fullname } : null,
        };
      })
    );

    return NextResponse.json(
      { organizations: cleanedOrganizations },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching organizations:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
