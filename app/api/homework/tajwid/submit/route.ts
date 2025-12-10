import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUserFromRequest } from "@/lib/auth";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { v4 as uuidv4 } from "uuid";
import {
  sendTajwidHomeworkSubmissionEmail,
  sendTeacherTajwidHomeworkNotification,
} from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthUserFromRequest(req);
    if (!user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const formData = await req.formData();
    const tajwidHomeworkId = formData.get("homeworkId") as string;
    let type = formData.get("type") as string;
    const textContent = formData.get("textContent") as string | null;
    const files = formData.getAll("files") as File[];

    if (type === 'FILE') type = 'AUDIO';

    if (!tajwidHomeworkId) {
      return NextResponse.json({ error: "ID du devoir requis" }, { status: 400 });
    }

    if (type !== 'TEXT' && type !== 'AUDIO') {
      return NextResponse.json({ error: 'Type invalide' }, { status: 400 });
    }

    if (type === 'TEXT' && !textContent) {
      return NextResponse.json({ error: 'Le contenu texte est requis' }, { status: 400 });
    }

    if (type === 'AUDIO' && (!files || files.length === 0)) {
      return NextResponse.json({ error: 'Au moins un fichier est requis' }, { status: 400 });
    }

    const homework = await prisma.tajwidHomework.findUnique({
      where: { id: tajwidHomeworkId },
      select: { id: true, title: true, chapterId: true }
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

    let savedFiles: { name: string; path: string }[] = [];

    if (type === 'AUDIO' && files.length > 0) {
      const uploadDir = process.env.VERCEL
        ? '/tmp/homeworks'
        : join(process.cwd(), 'public', 'uploads', 'homeworks');

      await mkdir(uploadDir, { recursive: true });

      for (const file of files) {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const fileExtension = file.name.split('.').pop();
        const fileName = `${uuidv4()}.${fileExtension}`;
        const filePath = join(uploadDir, fileName);
        await writeFile(filePath, buffer);
        savedFiles.push({ name: file.name, path: filePath });
      }
    }

    const updatedSend = await prisma.tajwidHomeworkSend.update({
      where: {
        userId_tajwidHomeworkId: {
          userId: user.id,
          tajwidHomeworkId
        }
      },
      data: {
        type,
        textContent: type === "TEXT" ? textContent : null,
        audioUrl: null,
        fileUrls: type === "AUDIO" ? JSON.stringify(savedFiles) : null,
        status: "PENDING",
        feedback: null,
        correctedAt: null
      },
      include: {
        tajwidHomework: { select: { id: true, title: true, chapterId: true } },
        user: { select: { id: true, email: true, username: true } }
      }
    });

    try {
      await sendTajwidHomeworkSubmissionEmail({
        userEmail: user.email,
        userName: user.username || 'Étudiant',
        homeworkTitle: updatedSend.tajwidHomework.title,
        chapterId: updatedSend.tajwidHomework.chapterId,
        submissionType: type as 'TEXT' | 'AUDIO',
        content: type === 'TEXT' ? (textContent || '') : '',
        fileUrls: type === 'AUDIO' ? savedFiles : [],
        submittedAt: updatedSend.sentAt,
      });

      await sendTeacherTajwidHomeworkNotification({
        teacherEmail: process.env.TEACHER_EMAIL || 'prof@erpr.com',
        userName: user.username || 'Étudiant',
        userEmail: user.email,
        userId: user.id,
        homeworkTitle: updatedSend.tajwidHomework.title,
        chapterId: updatedSend.tajwidHomework.chapterId,
        submissionType: type as 'TEXT' | 'AUDIO',
        content: type === 'TEXT' ? (textContent || '') : '',
        fileUrls: type === 'AUDIO' ? savedFiles : [],
        submittedAt: updatedSend.sentAt,
      });

      console.log('📩 Emails Tajwid envoyés avec pièces jointes');
    } catch (err) {
      console.error('❌ Erreur lors de l\'envoi des emails Tajwid :', err);
    }

    return NextResponse.json({
      success: true,
      message: "Devoir Tajwid soumis avec succès",
      submission: updatedSend,
    });
  } catch (error) {
    console.error("❌ Erreur POST /homework/tajwid/submit:", error);
    return NextResponse.json(
      { error: "Erreur lors de la soumission du devoir Tajwid" },
      { status: 500 }
    );
  }
}
