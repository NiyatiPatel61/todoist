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

    // Get all tasks assigned to the user with project and tasklist info
    const tasks = await prisma.task.findMany({
      where: {
        assignedTo: userId,
      },
      include: {
        taskList: {
          include: {
            project: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Transform tasks to match frontend format
    const formattedTasks = tasks.map((task: any) => ({
      id: task.id,
      title: task.title,
      description: task.description,
      project: task.taskList.project.projectName,
      projectId: task.taskList.project.id,
      listName: task.taskList.listName,
      listId: task.listId,
      priority: task.priority.toLowerCase(),
      status: task.status === "InProgress" ? "inprogress" : task.status.toLowerCase(),
      dueDate: task.dueDate ? task.dueDate.toISOString().split('T')[0] : null,
      createdAt: task.createdAt,
    }));

    return NextResponse.json({
      tasks: formattedTasks,
    });
  } catch (error) {
    console.error("Tasks fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch tasks" },
      { status: 500 }
    );
  }
}

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
    const { title, description, listId, assignedTo, priority, status, dueDate } = body;

    if (!title || !listId || !assignedTo) {
      return NextResponse.json(
        { error: "Title, list ID, and assignee are required" },
        { status: 400 }
      );
    }

    // Create new task
    const task = await prisma.task.create({
      data: {
        title,
        description: description || "",
        listId,
        assignedTo,
        priority: priority || "Low",
        status: status || "Pending",
        dueDate: dueDate ? new Date(dueDate) : null,
      },
      include: {
        taskList: {
          include: {
            project: true,
          },
        },
        assignedUser: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    // Create history record
    await prisma.taskHistory.create({
      data: {
        taskId: task.id,
        changedBy: user.userId as string,
        changeType: "created",
      },
    });

    return NextResponse.json({
      success: true,
      task,
    }, { status: 201 });
  } catch (error) {
    console.error("Task creation error:", error);
    return NextResponse.json(
      { error: "Failed to create task" },
      { status: 500 }
    );
  }
}
