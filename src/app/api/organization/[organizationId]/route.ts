import connectDB from "@/app/db/connectDB";
import { decryptToken } from "@/app/helpers/generateToken";
import Organization from "@/app/models/organization";
import User from "@/app/models/users";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

type Params = {
  organizationId: string;
};

//update organization
export async function PUT(
  request: NextRequest,
  { params }: { params: Params }
) {
  try {
    await connectDB();
    const cookieStore = cookies();
    const token = cookieStore.get("token");
    const organizationId = params;
    console.log(organizationId);
    if (!token)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { name, description, project, members } = await request.json();
    if (!name)
      return NextResponse.json({ error: "Name is required" }, { status: 400 });

    const _id = (await decryptToken(token.value)) as string;

    const user = await User.findById(_id);
    if (!user)
      return NextResponse.json({ error: "User not found" }, { status: 404 });

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

    if (!organization)
      return NextResponse.json(
        { error: "Error Updating Organization" },
        { status: 500 }
      );

    return NextResponse.json(
      { message: "Organization updated success!" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

//delete organization
export async function DELETE(
  request: NextRequest,
  { params }: { params: Params }
) {
  try {
    await connectDB();
    const cookieStore = cookies();
    const token = cookieStore.get("token");

    if (!token)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const _id = (await decryptToken(token.value)) as string;

    const user = await User.findById(_id);
    if (!user)
      return NextResponse.json({ error: "User not found" }, { status: 404 });

    const organization = await Organization.findByIdAndDelete(
      params.organizationId
    );

    if (!organization)
      return NextResponse.json(
        { error: "Error Deleting Organization" },
        { status: 500 }
      );

    return NextResponse.json(
      { message: "Organization deleted success!" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
