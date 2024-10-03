import connectDB from "@/app/db/connectDB";
import { cookieExtraction } from "@/app/helpers/generateToken";
import Organization from "@/app/models/organization";
import Projects from "@/app/models/project";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const decoded = await cookieExtraction();
    if (!decoded) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, description, status, tasks, members, organizationId } =
      await request.json();

    if (!name || !description || !organizationId) {
      return NextResponse.json(
        {
          error:
            "Please provide all required fields: name, description, and organizationId.",
        },
        { status: 400 }
      );
    }

    // Find the organization by ID
    const alreadyInOrg = await Organization.findById(organizationId);

    if (!alreadyInOrg) {
      return NextResponse.json(
        { error: "Organization not found" },
        { status: 404 }
      );
    }

    // Create the new project, matching the schema
    const newProject = new Projects({
      title: name,
      description,
      organization: organizationId,
      status: status || "not started",
      tasks: tasks || [],
      members: members || [],
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

// Get all projects
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const decoded = await cookieExtraction();
    if (!decoded) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    // const { organizationId } = await request.json();
    // console.log(organizationId);

    const projects = await Projects.find();
    return NextResponse.json({ projects }, { status: 200 });
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json(
      { error: "Something went wrong while fetching projects." },
      { status: 500 }
    );
  }
}
