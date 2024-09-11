import connectDB from "@/app/db/connectDB";
import { cookieExtraction } from "@/app/helpers/generateToken";
import Projects from "@/app/models/project";
import { NextRequest, NextResponse } from "next/server";

type Params = {
  projectId: string;
};

export async function DELETE(
  request: NextRequest,
  { params }: { params: Params }
) {
  try {
    await connectDB();

    // Extract projectId correctly from params
    const { projectId } = params;

    console.log(projectId, "+++++");

    // Check if projectId exists
    if (!projectId) {
      return NextResponse.json(
        { error: "Project ID is required" },
        { status: 400 }
      );
    }

    // Delete the project by its ID
    const deletedProject = await Projects.findByIdAndDelete(projectId);

    if (!deletedProject) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Return success response with 200 status
    return NextResponse.json(
      { message: "Project deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting project:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Params }
) {
  try {
    await connectDB();
    const decoded = await cookieExtraction();
    if (!decoded) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { projectId } = params;

    const { name, description, status, members, tasks } = await request.json();

    if (!name || !description || !projectId) {
      return NextResponse.json(
        {
          error:
            "Please provide all required fields: name, description, and projectId.",
        },
        { status: 400 }
      );
    }

    // Find the project by ID
    const project = await Projects.findById(projectId);

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Update the project fields
    project.title = name;
    project.description = description;
    project.updatedAt = Date.now();
    project.status = status || project.status;
    project.tasks = tasks || project.tasks;
    project.members = members || project.members;

    // Save the updated project
    await project.save();

    return NextResponse.json(
      { message: "Project updated successfully!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating project:", error);
    return NextResponse.json(
      { error: "Something went wrong while updating the project." },
      { status: 500 }
    );
  }
}
