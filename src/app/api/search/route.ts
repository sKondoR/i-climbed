import { SearchService } from '@/lib/services/search.service';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  if (!query) {
    return NextResponse.json({ results: [] });
  }

  if (request.signal.aborted) {
    return new Response('Client closed request', { status: 499 });
  }

  try {
    const abortPromise = new Promise((_, reject) => {
      request.signal.addEventListener('abort', () => {
        reject(new Error('Request aborted'));
      });
    });

    const results = await Promise.race([SearchService.searchByName(query), abortPromise]);
    return NextResponse.json(results);
  } catch (error) {
    if (error instanceof Error && error.message === 'Request aborted') {
      return new Response(null, { status: 499 });
    }

    console.error('Search error:', error);
    return NextResponse.json(
      { error: 'Failed to perform search' },
      { status: 500 }
    );
  }
}