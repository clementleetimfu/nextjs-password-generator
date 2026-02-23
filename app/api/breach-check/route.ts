import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const hashPrefix = searchParams.get('hash');

  if (!hashPrefix) {
    return NextResponse.json({ error: 'Missing hash prefix' }, { status: 400 });
  }

  try {
    const response = await fetch(
      `https://api.pwnedpasswords.com/range/${hashPrefix}`,
      {
        headers: {
          'User-Agent': 'Password-Generator',
          'Add-Padding': 'true',
        },
      }
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: `API request failed: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.text();

    return new NextResponse(data, {
      headers: {
        'Content-Type': 'text/plain',
      },
    });
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch from HIBP API' },
      { status: 500 }
    );
  }
}
