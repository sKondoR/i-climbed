import { NextRequest, NextResponse } from 'next/server';
import { RegionsService } from '@/lib/services/regions.service';

export async function POST(request: NextRequest) {
  try {
    const filters = await request.json();
    const regions = await RegionsService.find(filters);
    // console.log('✅ regions fetched:', regions);
    return NextResponse.json({
      success: true,
      data: regions,
    });
  } catch (error) {
    // console.error('❌ Error in GET /api/regions:', error);

    const message = error instanceof Error ? error.message : 'Unknown error';
    const stack = error instanceof Error ? error.stack : undefined;

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch regions ',
        message,
        stack,
      },
      { status: 500 }
    );
  }
}
