import connectDB from "@/app/db/connectDB";
import { cookieExtraction } from "@/app/helpers/generateToken";
import Organization from "@/app/models/organization";
import Projects from "@/app/models/project";
import { NextRequest, NextResponse } from "next/server";

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
