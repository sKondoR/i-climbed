import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    // Run a simple query
    await db.execute('SELECT NOW()');
    return NextResponse.json({ success: true, message: 'Database connected!' });
  } catch (error) {
    console.error('Health check failed:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'DB connection failed',
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}