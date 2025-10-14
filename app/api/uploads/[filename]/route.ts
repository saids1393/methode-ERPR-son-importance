import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import { readFile } from 'fs/promises';

export async function GET(
  req: NextRequest,
  { params }: { params: { filename: string } }
) {
  try {
    const { filename } = params;

    const filePath = process.env.VERCEL
      ? path.join('/tmp/homeworks', filename)
      : path.join(process.cwd(), 'public', 'uploads', 'homeworks', filename);

    // Lire le fichier
    const fileBuffer = await readFile(filePath);

    // Convertir Buffer en Uint8Array (compatible NextResponse)
    const fileUint8 = new Uint8Array(fileBuffer);

    // Type MIME
    const ext = path.extname(filename).toLowerCase();
    const mimeType =
      ext === '.mp3'
        ? 'audio/mpeg'
        : ext === '.wav'
        ? 'audio/wav'
        : 'application/octet-stream';

    return new NextResponse(fileUint8, {
      headers: {
        'Content-Type': mimeType,
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (err) {
    console.error('❌ Erreur GET /api/uploads :', err);
    return NextResponse.json({ error: 'Fichier introuvable' }, { status: 404 });
  }
}
