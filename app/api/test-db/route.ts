import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Test the connection by trying to count users
    const userCount = await prisma.user.count();
    
    return NextResponse.json({
      status: 'Connected',
      database: 'todoist',
      userCount,
      message: 'Database connection successful'
    });
  } catch (error: any) {
    console.error('Database connection error:', error);
    return NextResponse.json({
      status: 'Error',
      message: error.message
    }, { status: 500 });
  }
}
