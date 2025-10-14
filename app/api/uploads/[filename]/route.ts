import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";

// ----------------------------
// 📦 GET /api/uploads/[filename]
// ----------------------------
export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const filename = url.pathname.split("/").pop();

    if (!filename) return NextResponse.json({ error: "Nom de fichier manquant" }, { status: 400 });

    const filePath = path.join(process.cwd(), "public", "uploads", "homeworks", filename);

    const fileBuffer = await readFile(filePath);

    const ext = filename.split(".").pop()?.toLowerCase();
    const mimeType =
      {
        mp3: "audio/mpeg",
        wav: "audio/wav",
        mp4: "video/mp4",
        pdf: "application/pdf",
        doc: "application/msword",
        docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        txt: "text/plain",
        jpg: "image/jpeg",
        jpeg: "image/jpeg",
        png: "image/png",
        gif: "image/gif",
      }[ext || ""] || "application/octet-stream";

    return new NextResponse(new Uint8Array(fileBuffer), {
      headers: {
        "Content-Type": mimeType,
        "Content-Disposition": `inline; filename="${filename}"`,
      },
    });
  } catch (err) {
    console.error("❌ Erreur GET /api/uploads :", err);
    return NextResponse.json({ error: "Fichier introuvable ou erreur serveur" }, { status: 404 });
  }
}
