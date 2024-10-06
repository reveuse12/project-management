import connectDB from "@/app/db/connectDB";
import { cookieExtraction } from "@/app/helpers/generateToken";
import Role from "@/app/models/role";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const decoded = await cookieExtraction();
    if (!decoded) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, description, permissions } = await request.json();

    if (!name || !permissions) {
      return NextResponse.json(
        {
          error:
            "Please provide all required fields: role, user, and permission.",
        },
        { status: 400 }
      );
    }

    const role = await Role.create({
      name,
      description,
      permissions,
    });

    if (!role) {
      return NextResponse.json(
        { error: "Error creating role" },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { message: "Role created successfully." },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}

export async function GET() {
  try {
    await connectDB();
    const decoded = await cookieExtraction();
    if (!decoded) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const roles = await Role.find().sort("name");
    return NextResponse.json(roles, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
