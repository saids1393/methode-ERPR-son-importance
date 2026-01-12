// app/api/videos/stream/[videoId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUserFromRequest, verifyToken } from '@/lib/auth';

type Params = { videoId: string };

// 🔐 Token valide 24 heures (maximum autorisé par Cloudflare)
// Renouvellable automatiquement tant que l'utilisateur est connecté
const TOKEN_EXPIRY = 86400; // 24 heures

/**
 * 🔐 Génère un token signé via l'API Cloudflare
 */
async function generateCloudflareSignedToken(
  cloudflareVideoId: string,
  userId: string,
  expiresInSeconds: number = TOKEN_EXPIRY
): Promise<string> {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const apiToken = process.env.CLOUDFLARE_API_TOKEN;

  if (!accountId || !apiToken) {
    throw new Error('CLOUDFLARE_ACCOUNT_ID et CLOUDFLARE_API_TOKEN sont requis dans .env');
  }

  const exp = Math.floor(Date.now() / 1000) + expiresInSeconds;

  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${accountId}/stream/${cloudflareVideoId}/token`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        exp,
        downloadable: false,
        accessRules: [{ type: 'any', action: 'allow' }],
      }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error('❌ [CLOUDFLARE] Erreur API:', {
      status: response.status,
      error: errorText,
      videoId: cloudflareVideoId,
    });
    throw new Error(`Cloudflare API Error (${response.status})`);
  }

  const data = await response.json();

  if (!data.success || !data.result?.token) {
    throw new Error('Token invalide généré par Cloudflare');
  }

  return data.result.token;
}

/**
 * ✅ Vérifie que l'utilisateur est connecté et son compte est actif
 */
async function checkUserIsActive(request: NextRequest): Promise<{ isValid: boolean; user?: any; error?: string }> {
  try {
    // Récupérer le token depuis les cookies
    const token = request.cookies.get('auth-token')?.value;

    if (!token) {
      return { isValid: false, error: 'Non authentifié - Connectez-vous' };
    }

    // Vérifier le token
    const decoded = await verifyToken(token);

    if (!decoded || !decoded.userId) {
      return { isValid: false, error: 'Token invalide' };
    }

    // Récupérer l'utilisateur
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId as string },
      select: {
        id: true,
        email: true,
        isActive: true,
      },
    });

    if (!user) {
      return { isValid: false, error: 'Utilisateur non trouvé' };
    }

    if (!user.isActive) {
      return { isValid: false, error: 'Compte inactif' };
    }

    return { isValid: true, user };

  } catch (error) {
    console.error('❌ Erreur vérification utilisateur:', error);
    return { isValid: false, error: 'Session expirée - Reconnectez-vous' };
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<Params> }
) {
  try {
    const { videoId } = await params;

    if (!videoId?.trim()) {
      return NextResponse.json(
        { error: 'ID vidéo invalide' },
        { status: 400 }
      );
    }

    // 1️⃣ VÉRIFIER QUE L'UTILISATEUR EST CONNECTÉ ET ACTIF
    const authCheck = await checkUserIsActive(request);

    if (!authCheck.isValid) {
      console.warn(`⚠️ [STREAM] Accès refusé: ${authCheck.error}`);
      return NextResponse.json(
        { error: authCheck.error },
        { status: 401 }
      );
    }

    const user = authCheck.user!;

    // 2️⃣ RÉCUPÉRER LA VIDÉO
    const video = await prisma.chapterVideo.findFirst({
      where: {
        OR: [
          { id: videoId },
          { cloudflareVideoId: videoId }
        ],
        isActive: true,
      },
      select: {
        id: true,
        cloudflareVideoId: true,
        thumbnailUrl: true,
        title: true,
        chapter: {
          select: {
            chapterNumber: true,
            title: true,
          },
        },
      },
    });

    if (!video) {
      console.warn(`⚠️ [STREAM] Vidéo non trouvée: ${videoId}`);
      return NextResponse.json(
        { error: 'Vidéo non trouvée ou inactive' },
        { status: 404 }
      );
    }

    // 3️⃣ GÉNÉRER LE TOKEN SIGNÉ
    // ✅ Tant que l'utilisateur est connecté, il peut renouveler le token
    const signedToken = await generateCloudflareSignedToken(
      video.cloudflareVideoId,
      user.id,
      TOKEN_EXPIRY
    );

    // 4️⃣ CONSTRUIRE LES URLs
    const CLOUDFLARE_STREAM_DOMAIN = process.env.CLOUDFLARE_STREAM_DOMAIN || 'customer-5yz20vgnhpok0kcp.cloudflarestream.com';
    const baseUrl = `https://${CLOUDFLARE_STREAM_DOMAIN}/${video.cloudflareVideoId}`;
    const hlsUrl = `${baseUrl}/manifest/video.m3u8?token=${signedToken}`;
    const dashUrl = `${baseUrl}/manifest/video.mpd?token=${signedToken}`;

    const expiresAt = Math.floor(Date.now() / 1000) + TOKEN_EXPIRY;

    console.log(`✅ [STREAM] Token généré - Utilisateur connecté`, {
      user: user.email,
      videoId: video.id,
      cloudflareVideoId: video.cloudflareVideoId,
      expiresIn: `${TOKEN_EXPIRY}s (24h)`,
      expiresAt: new Date(expiresAt * 1000).toISOString(),
      note: '✅ Renouvellable automatiquement tant que connecté',
    });

    return NextResponse.json({
      hlsUrl,
      dashUrl,
      thumbnailUrl: video.thumbnailUrl,
      videoTitle: video.title,
      chapterNumber: video.chapter?.chapterNumber,
      chapterTitle: video.chapter?.title,
      expiresAt,
      expiresIn: TOKEN_EXPIRY,
      message: '✅ Accès illimité tant que connecté - Token renouvelé automatiquement',
    }, {
      headers: {
        'Cache-Control': 'private, no-store, max-age=0, must-revalidate',
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'Referrer-Policy': 'no-referrer',
        'Pragma': 'no-cache',
      },
    });

  } catch (error) {
    console.error('❌ [STREAM] Erreur:', error);

    if (error instanceof Error) {
      if (error.message.includes('CLOUDFLARE_')) {
        return NextResponse.json(
          { error: 'Configuration serveur manquante. Contactez l\'admin.' },
          { status: 500 }
        );
      }

      if (error.message.includes('Cloudflare API Error')) {
        return NextResponse.json(
          { error: 'Erreur de génération du lien sécurisé' },
          { status: 500 }
        );
      }

      if (error.message.includes('Session expirée')) {
        return NextResponse.json(
          { error: 'Session expirée - Reconnectez-vous' },
          { status: 401 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}