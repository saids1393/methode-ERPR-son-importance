import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const videoId = req.nextUrl.searchParams.get('videoId');
  if (!videoId) return NextResponse.json({ error: 'Missing videoId' }, { status: 400 });

  const CLOUDFLARE_ACCOUNT_ID = process.env.NEXT_PUBLIC_CLOUDFLARE_ACCOUNT_ID;
  const CLOUDFLARE_TOKEN = process.env.GBOBAL_CLOUDFLARE; // token API

  try {
    const res = await fetch(`https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/stream/${videoId}/access/url`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${CLOUDFLARE_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ // options pour signed URL
        ttl: 3600 // URL valide 1 heure
      })
    });

    const data = await res.json();

    if (!data.result) {
      return NextResponse.json({ error: 'No result from Cloudflare', data }, { status: 500 });
    }

    // Retourne uniquement HLS et DASH
    const hls = data.result?.hls;
    const dash = data.result?.dash;

    return NextResponse.json({ hls, dash });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch Cloudflare URL', err }, { status: 500 });
  }
}
