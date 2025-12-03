import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/auth";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: NextRequest) {
  try {
    const user = await getUser(req);
    if (!user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const formData = await req.formData();
    const tajwidHomeworkId = formData.get("homeworkId") as string;
    const type = formData.get("type") as "TEXT" | "FILE";
    const textContent = formData.get("textContent") as string | null;
    const files = formData.getAll("files") as File[];

    if (!tajwidHomeworkId) {
      return NextResponse.json({ error: "ID du devoir requis" }, { status: 400 });
    }

    const homework = await prisma.tajwidHomework.findUnique({
      where: { id: tajwidHomeworkId }
    });

    if (!homework) {
      return NextResponse.json({ error: "Devoir Tajwid introuvable" }, { status: 404 });
    }

    const existingSend = await prisma.tajwidHomeworkSend.findUnique({
      where: {
        userId_tajwidHomeworkId: {
          userId: user.id,
          tajwidHomeworkId
        }
      }
    });

    if (!existingSend) {
      return NextResponse.json({ error: "Vous n'avez pas reçu ce devoir Tajwid" }, { status: 403 });
    }

    let fileUrls: { name: string; url: string }[] = [];

    if (type === "FILE" && files.length > 0) {
      const uploadDir = join(process.cwd(), "public", "uploads", "homeworks");

      try {
        await mkdir(uploadDir, { recursive: true });
      } catch (error) {
        console.error("Erreur lors de la création du dossier:", error);
      }

      for (const file of files) {
        const buffer = Buffer.from(await file.arrayBuffer());
        const filename = `${uuidv4()}.${file.name.split('.').pop()}`;
        const filepath = join(uploadDir, filename);

        await writeFile(filepath, buffer);

        fileUrls.push({
          name: file.name,
          url: `/uploads/homeworks/${filename}`
        });
      }
    }

    await prisma.tajwidHomeworkSend.update({
      where: {
        userId_tajwidHomeworkId: {
          userId: user.id,
          tajwidHomeworkId
        }
      },
      data: {
        type,
        textContent: type === "TEXT" ? textContent : null,
        fileUrls: type === "FILE" ? JSON.stringify(fileUrls) : null,
        status: "PENDING"
      }
    });

    return NextResponse.json({
      success: true,
      message: "Devoir Tajwid soumis avec succès"
    });
  } catch (error) {
    console.error("Erreur POST /homework/tajwid/submit:", error);
    return NextResponse.json(
      { error: "Erreur lors de la soumission du devoir Tajwid" },
      { status: 500 }
    );
  }
}
