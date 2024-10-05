import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/app/db/connectDB";
import { cookieExtraction } from "@/app/helpers/generateToken";
import Organization from "@/app/models/organization";
import Projects from "@/app/models/project";
interface Params {
  organizationId: string;
}

export async function POST(
  request: NextRequest,
  { params }: { params: Params }
) {
  try {
    await connectDB();
    const decoded = await cookieExtraction();
    if (!decoded) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, description, status, tasks, members } = await request.json();

    if (!title || !description || !params.organizationId) {
      return NextResponse.json(
        {
          error:
            "Please provide all required fields: name, description, and organizationId.",
        },
        { status: 400 }
      );
    }

    // Find the organization by ID
    const alreadyInOrg = await Organization.findById(params.organizationId);

    if (!alreadyInOrg) {
      return NextResponse.json(
        { error: "Organization not found" },
        { status: 404 }
      );
    }

    // Create the new project, matching the schema
    const newProject = new Projects({
      title,
      description,
      organization: params.organizationId,
      status: status || "not started",
      tasks: tasks || [],
      members: members || [],
      createdBy: decoded._id,
    });

    // Save the new project to the database
    await newProject.save();

    // Push the project to the organization's projects array
    alreadyInOrg.projects.push(newProject._id);
    await alreadyInOrg.save();

    return NextResponse.json(
      { message: "New project created successfully!" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating project:", error);
    return NextResponse.json(
      { error: "Something went wrong while creating the project." },
      { status: 500 }
    );
  }
}
