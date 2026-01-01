import { ALLCLIMB_SEARCH } from '@/shared/constants/allclimb';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');
  if (!query) {
    return NextResponse.json({ results: [] });
  }

  const formData = new URLSearchParams();
  formData.append('searchfor', query);
  formData.append('lang', 'ru');

  try {
    // Example with external API (e.g., GitHub Search)
    const response = await fetch(ALLCLIMB_SEARCH,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36',
        },
        body: 'searchfor=xza&lang=ru',
      }
    );

    console.log(response);
    const contentType = response.headers.get('content-type');
    console.log('contentType ', contentType);
    if (!response.ok) {
      const errorText = await response.text();
      console.error('External API error response:', errorText);
      return NextResponse.json(
        { error: 'Search service is unavailable', details: errorText },
        { status: 500 }
      );
    }

    const data = await response.json();
    // Transform the data
    const results = data.items.map((item: any) => ({
      id: item.id,
      title: item.full_name,
      description: item.description,
      stars: item.stargazers_count,
      url: item.html_url,
    }));

    return NextResponse.json({ results });
  } catch (error) {
    console.error('External API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch from external API' },
      { status: 500 }
    );
  }
}