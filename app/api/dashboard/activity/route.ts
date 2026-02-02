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

    // Get recent task history changes for tasks assigned to the user
    const recentHistory = await prisma.taskHistory.findMany({
      where: {
        task: {
          assignedTo: userId,
        },
      },
      include: {
        task: {
          select: {
            title: true,
          },
        },
        user: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        changeTime: "desc",
      },
      take: 10,
    });

    // Get recent comments on user's tasks
    const recentComments = await prisma.taskComment.findMany({
      where: {
        task: {
          assignedTo: userId,
        },
      },
      include: {
        task: {
          select: {
            title: true,
          },
        },
        user: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 10,
    });

    // Combine and format activities
    const activities = [
      ...recentHistory.map((history: any) => ({
        action: history.changeType.toLowerCase(),
        task: history.task.title,
        time: getRelativeTime(history.changeTime),
        user: history.user.name,
        timestamp: history.changeTime,
      })),
      ...recentComments.map((comment: any) => ({
        action: "commented",
        task: comment.task.title,
        time: getRelativeTime(comment.createdAt),
        user: comment.user.name,
        timestamp: comment.createdAt,
      })),
    ]
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, 10)
      .map(({ timestamp, ...rest }) => rest);

    return NextResponse.json({
      activities,
    });
  } catch (error) {
    console.error("Dashboard activity error:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard activity" },
      { status: 500 }
    );
  }
}

function getRelativeTime(date: Date): string {
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInMinutes < 1) return "Just now";
  if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes > 1 ? "s" : ""} ago`;
  if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
  if (diffInDays < 7) return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
  
  return date.toLocaleDateString();
}
