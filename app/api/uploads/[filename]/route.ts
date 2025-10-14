// app/api/uploads/[filename]/route.ts
import { NextResponse } from "next/server";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { Readable } from "stream";

// ----------------------------
// 🔹 Helper: Convert Readable stream to Buffer
// ----------------------------
function streamToBuffer(stream: Readable): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    stream.on("data", (chunk) => chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)));
    stream.on("end", () => resolve(Buffer.concat(chunks)));
    stream.on("error", reject);
  });
}

// ----------------------------
// ⚙️ Configuration Cloudflare R2
// ----------------------------
const r2Client = new S3Client({
  region: "auto", // obligatoire pour R2
  endpoint: process.env.CLOUDFLARE_R2_ENDPOINT, // exemple: "https://<account_id>.r2.cloudflarestorage.com"
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY!,
  },
});

const BUCKET_NAME = process.env.CLOUDFLARE_R2_BUCKET_NAME!;

// ----------------------------
// 📦 GET /api/uploads/[filename]
// ----------------------------
export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const filename = url.pathname.split("/").pop();

    if (!filename) {
      return NextResponse.json({ error: "Nom de fichier manquant" }, { status: 400 });
    }

    // Récupérer le fichier depuis Cloudflare R2
    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: `homeworks/${filename}`,
    });

    const object = await r2Client.send(command);

    if (!object || !object.Body) {
      return NextResponse.json({ error: "Fichier introuvable" }, { status: 404 });
    }

    // Convertir le flux Readable en Buffer
    const buffer = await streamToBuffer(object.Body as Readable);

    // Déterminer le type MIME
    const ext = filename.split(".").pop()?.toLowerCase();
    const mimeType =
      {
        mp3: "audio/mpeg",
        wav: "audio/wav",
        mp4: "video/mp4",
        pdf: "application/pdf",
        doc: "application/msword",
        docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        xls: "application/vnd.ms-excel",
        xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        ppt: "application/vnd.ms-powerpoint",
        pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        jpg: "image/jpeg",
        jpeg: "image/jpeg",
        png: "image/png",
        gif: "image/gif",
        txt: "text/plain",
      }[ext || ""] || "application/octet-stream";

    // Retourner le fichier
    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Type": mimeType,
        "Content-Disposition": `inline; filename="${filename}"`,
      },
    });

  } catch (err) {
    console.error("❌ Erreur GET /api/uploads :", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
