// app/api/download/[filename]/route.ts
import { NextResponse } from 'next/server';

declare const CLOUDFLARE_R2_BUCKET: R2Bucket;

export async function GET(
  req: Request,
  { params }: { params: { filename: string } }
) {
  try {
    const { filename } = params;

    if (!filename) {
      return NextResponse.json({ error: 'Nom de fichier manquant' }, { status: 400 });
    }

    // Récupérer le fichier depuis R2
    const object = await CLOUDFLARE_R2_BUCKET.get(`homeworks/${filename}`);
    if (!object) {
      return NextResponse.json({ error: 'Fichier introuvable' }, { status: 404 });
    }

    // Lire le contenu
    const arrayBuffer = await object.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);

    // Déterminer le type MIME générique
    const ext = filename.split('.').pop()?.toLowerCase();
    const mimeType = (() => {
      switch (ext) {
        case 'mp3': return 'audio/mpeg';
        case 'wav': return 'audio/wav';
        case 'mp4': return 'video/mp4';
        case 'pdf': return 'application/pdf';
        case 'doc': return 'application/msword';
        case 'docx': return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
        case 'xls': return 'application/vnd.ms-excel';
        case 'xlsx': return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
        case 'ppt': return 'application/vnd.ms-powerpoint';
        case 'pptx': return 'application/vnd.openxmlformats-officedocument.presentationml.presentation';
        case 'jpg':
        case 'jpeg': return 'image/jpeg';
        case 'png': return 'image/png';
        case 'gif': return 'image/gif';
        case 'txt': return 'text/plain';
        default: return 'application/octet-stream';
      }
    })();

    return new NextResponse(uint8Array, {
      headers: {
        'Content-Type': mimeType,
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (err) {
    console.error('❌ Erreur GET /api/download :', err);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
