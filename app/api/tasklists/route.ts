import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "your-secret-key"
);

async function getUserFromToken(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  
  if (!token) {
    return null;
  }

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload;
  } catch (error) {
    return null;
  }
}

// GET all task lists for a project
export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromToken(request);

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get("projectId");

    if (!projectId) {
      return NextResponse.json(
        { error: "Project ID is required" },
        { status: 400 }
      );
    }

    const taskLists = await prisma.taskList.findMany({
      where: {
        projectId,
      },
      include: {
        tasks: {
          include: {
            assignedUser: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
      orderBy: {
        listName: "asc",
      },
    });

    return NextResponse.json({
      taskLists,
    });
  } catch (error) {
    console.error("Task lists fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch task lists" },
      { status: 500 }
    );
  }
}

// POST create new task list
export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromToken(request);

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { projectId, listName } = body;

    if (!projectId || !listName) {
      return NextResponse.json(
        { error: "Project ID and list name are required" },
        { status: 400 }
      );
    }

    const taskList = await prisma.taskList.create({
      data: {
        projectId,
        listName,
      },
      include: {
        tasks: true,
      },
    });

    return NextResponse.json({
      success: true,
      taskList,
    }, { status: 201 });
  } catch (error) {
    console.error("Task list creation error:", error);
    return NextResponse.json(
      { error: "Failed to create task list" },
      { status: 500 }
    );
  }
}
