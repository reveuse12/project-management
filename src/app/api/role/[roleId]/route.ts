import connectDB from "@/app/db/connectDB";
import Role from "@/app/models/role";
import { NextRequest, NextResponse } from "next/server";

interface Params {
  roleId: string;
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Params }
) {
  try {
    await connectDB();
    const { roleId } = params;
    if (!roleId) {
      return NextResponse.json(
        { error: "Role ID is required" },
        { status: 400 }
      );
    }
    const { name, description, permissions } = await request.json();
    if (!name || !description || !permissions) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }
    // Find the existing role by ID
    const role = await Role.findById(roleId);
    if (!role) {
      return NextResponse.json({ error: "Role not found" }, { status: 404 });
    }

    // Append new permissions to the existing ones and remove duplicates
    const updatedPermissions = Array.from(
      new Set([...role.permissions, ...permissions])
    );

    // Update the role with the new data
    role.name = name;
    role.description = description;
    role.permissions = updatedPermissions;

    await role.save();

    return NextResponse.json({ message: "Role updated successfully" });
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Params }
) {
  try {
    await connectDB();
    const { roleId } = params;
    if (!roleId) {
      return NextResponse.json(
        { error: "Role ID is required" },
        { status: 400 }
      );
    }
    const deletedProject = await Role.findByIdAndDelete(roleId);
    if (!deletedProject) {
      return NextResponse.json({ error: "Role not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Role deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
