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

    // Get all tasks assigned to the user
    const allTasks = await prisma.task.findMany({
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

    // Calculate statistics
    const totalTasks = allTasks.length;
    
    // Completed tasks today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const completedToday = allTasks.filter(
      (task: any) => 
        task.status === "Completed" && 
        task.createdAt >= today
    ).length;
    
    // In progress tasks
    const inProgress = allTasks.filter(
      (task: any) => task.status === "InProgress"
    ).length;
    
    // Overdue tasks (pending/in-progress with due date in the past)
    const now = new Date();
    const overdue = allTasks.filter(
      (task: any) =>
        task.status !== "Completed" &&
        task.dueDate &&
        new Date(task.dueDate) < now
    ).length;

    // Get assigned tasks with project info (limit to 4 for dashboard)
    const assignedTasks = allTasks
      .filter((task: any) => task.status !== "Completed")
      .slice(0, 4)
      .map((task: any) => ({
        id: task.id,
        title: task.title,
        description: task.description,
        priority: task.priority,
        status: task.status,
        dueDate: task.dueDate,
        project: task.taskList.project.projectName,
        projectId: task.taskList.project.id,
        listName: task.taskList.listName,
      }));

    return NextResponse.json({
      stats: {
        totalTasks,
        completedToday,
        inProgress,
        overdue,
      },
      assignedTasks,
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard stats" },
      { status: 500 }
    );
  }
}
