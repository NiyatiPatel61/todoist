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

// GET all projects
export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromToken(request);

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const userId = user.userId as string;

    // Get all projects created by the user
    const projects = await prisma.project.findMany({
      where: {
        createdBy: userId,
      },
      include: {
        taskLists: {
          include: {
            tasks: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Transform projects to include task statistics
    const formattedProjects = projects.map((project: any) => {
      const allTasks = project.taskLists.flatMap((list: any) => list.tasks);
      const completedTasks = allTasks.filter((task: any) => task.status === "Completed");
      
      return {
        id: project.id,
        name: project.projectName,
        description: project.description,
        color: generateColorFromName(project.projectName),
        tasks: allTasks.length,
        completed: completedTasks.length,
        members: 1, // For now, just the creator
        status: allTasks.length > 0 && completedTasks.length === allTasks.length ? "completed" : "active",
        createdAt: project.createdAt,
      };
    });

    return NextResponse.json({
      projects: formattedProjects,
    });
  } catch (error) {
    console.error("Projects fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}

// POST create new project
export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromToken(request);

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const userId = user.userId as string;
    const body = await request.json();
    const { projectName, description } = body;

    if (!projectName) {
      return NextResponse.json(
        { error: "Project name is required" },
        { status: 400 }
      );
    }

    // Create project
    const project = await prisma.project.create({
      data: {
        projectName,
        description: description || "",
        createdBy: userId,
      },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      project,
    }, { status: 201 });
  } catch (error) {
    console.error("Project creation error:", error);
    return NextResponse.json(
      { error: "Failed to create project" },
      { status: 500 }
    );
  }
}

function generateColorFromName(name: string): string {
  const colors = [
    "#EF4444", "#F59E0B", "#10B981", "#3B82F6", "#8B5CF6", "#EC4899",
    "#14B8A6", "#F97316", "#06B6D4", "#6366F1"
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];

    if (!projectName) {
      return NextResponse.json(
        { error: "Project name is required" },
        { status: 400 }
      );
    }

    // Create the project
    const project = await prisma.project.create({
      data: {
        projectName,
        description: description || "",
        createdBy: userId,
      },
    });

    // Create a default task list for the project
    await prisma.taskList.create({
      data: {
        projectId: project.id,
        listName: "To Do",
      },
    });

    return NextResponse.json({
      success: true,
      project: {
        id: project.id,
        name: project.projectName,
        description: project.description,
        color: generateColorFromName(project.projectName),
        tasks: 0,
        completed: 0,
        members: 1,
        status: "active",
        createdAt: project.createdAt,
      },
    });
  } catch (error) {
    console.error("Project creation error:", error);
    return NextResponse.json(
      { error: "Failed to create project" },
      { status: 500 }
    );
  }
}

// Helper function to generate consistent colors from project names
function generateColorFromName(name: string): string {
  const colors = ['#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6', '#EC4899'];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}
