import connectDB from "@/app/db/connectDB";
import { cookieExtraction } from "@/app/helpers/generateToken";
import Organization from "@/app/models/organization";
import Projects from "@/app/models/project";
import { NextRequest, NextResponse } from "next/server";

type Params = {
  projectId: string;
  organizationId: string;
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
    const { projectId, organizationId } = params;

    const { title, description, status, members, tasks } = await request.json();

    if (!title || !description || !projectId || !organizationId) {
      return NextResponse.json(
        {
          error:
            "Please provide all required fields: name, description, and projectId.",
        },
        { status: 400 }
      );
    }

    // find the organization and check if the project exists in the organization then update the project  otherwise return error
    const organization = await Organization.findById(organizationId);
    if (!organization) {
      return NextResponse.json(
        { error: "Organization not found" },
        { status: 404 }
      );
    }

    const project = await Projects.findOne({ _id: projectId });

    // Update the project fields
    project.title = title;
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
