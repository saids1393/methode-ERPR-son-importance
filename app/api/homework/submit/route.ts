import { NextRequest, NextResponse } from 'next/server';
import { getAuthUserFromRequest } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import {
  sendHomeworkSubmissionEmail,
  sendTeacherHomeworkNotification,
} from '@/lib/email';

// POST - Soumettre un rendu de devoir (texte ou fichiers)
export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const formData = await request.formData();
    const homeworkId = formData.get('homeworkId') as string;
    let type = formData.get('type') as string;
    if (type === 'FILE') type = 'AUDIO';
    const textContent = formData.get('textContent') as string;
    const files = formData.getAll('files') as File[];

    // --- Validation ---
    if (!homeworkId || !type) return NextResponse.json({ error: 'Données manquantes' }, { status: 400 });
    if (type !== 'TEXT' && type !== 'AUDIO') return NextResponse.json({ error: 'Type invalide' }, { status: 400 });
    if (type === 'TEXT' && !textContent) return NextResponse.json({ error: 'Le contenu texte est requis' }, { status: 400 });
    if (type === 'AUDIO' && (!files || files.length === 0)) return NextResponse.json({ error: 'Au moins un fichier est requis' }, { status: 400 });

    // --- Vérifier que le devoir a été assigné ---
    const existingSend = await prisma.homeworkSend.findUnique({
      where: { userId_homeworkId: { userId: user.id, homeworkId } },
      include: { homework: { select: { id: true, title: true, chapterId: true } } },
    });
    if (!existingSend) return NextResponse.json({ error: 'Ce devoir ne vous a pas été assigné' }, { status: 404 });

    // --- Sauvegarde des fichiers AUDIO ---
    let fileUrls: { name: string; url: string }[] = [];
    if (type === 'AUDIO' && files) {
      const uploadDir = process.env.NODE_ENV === 'production'
        ? path.join('/tmp', 'homeworks') // stockage temporaire en prod
        : path.join(process.cwd(), 'public', 'uploads', 'homeworks'); // local

      await mkdir(uploadDir, { recursive: true });

      for (const file of files) {
        const buffer = Buffer.from(await file.arrayBuffer());
        const ext = path.extname(file.name);
        const fileName = `${uuidv4()}${ext}`;
        const filePath = path.join(uploadDir, fileName);
        await writeFile(filePath, buffer);

        const url = process.env.NODE_ENV === 'production'
          ? `${process.env.NEXTAUTH_URL || 'https://app.erpr.com'}/tmp/${fileName}`
          : `/uploads/homeworks/${fileName}`;

        fileUrls.push({ name: file.name, url });
      }
    }

    // --- Mise à jour de la base ---
    const updatedSend = await prisma.homeworkSend.update({
      where: { userId_homeworkId: { userId: user.id, homeworkId } },
      data: {
        type,
        textContent: type === 'TEXT' ? textContent : null,
        audioUrl: null,
        fileUrls: type === 'AUDIO' ? JSON.stringify(fileUrls) : null,
        status: 'PENDING',
        feedback: null,
        correctedAt: null,
      },
      include: {
        homework: { select: { id: true, title: true, chapterId: true, content: true } },
        user: { select: { id: true, email: true, username: true } },
      },
    });

    // --- Envoi des emails ---
    try {
      const fileLinks = fileUrls.map(f => f.url).join('\n');

      await sendHomeworkSubmissionEmail({
        userEmail: user.email,
        userName: user.username || 'Étudiant',
        homeworkTitle: updatedSend.homework.title,
        chapterId: updatedSend.homework.chapterId,
        submissionType: updatedSend.type as 'TEXT' | 'AUDIO',
        content: type === 'TEXT' ? updatedSend.textContent || '' : `Fichiers envoyés :\n${fileLinks}`,
        submittedAt: updatedSend.sentAt,
      });

      await sendTeacherHomeworkNotification({
        teacherEmail: process.env.TEACHER_EMAIL || 'prof@erpr.com',
        userName: user.username || 'Étudiant',
        userEmail: user.email,
        userId: user.id,
        homeworkTitle: updatedSend.homework.title,
        chapterId: updatedSend.homework.chapterId,
        submissionType: updatedSend.type as 'TEXT' | 'AUDIO',
        content: type === 'TEXT' ? updatedSend.textContent || '' : `Fichiers envoyés :\n${fileLinks}`,
        submittedAt: updatedSend.sentAt,
      });

      console.log('📩 Emails envoyés avec succès');
    } catch (err) {
      console.error('❌ Erreur lors de l’envoi des emails :', err);
    }

    // --- Réponse ---
    return NextResponse.json({
      success: true,
      message: 'Devoir soumis avec succès',
      submission: {
        id: updatedSend.id,
        type: updatedSend.type,
        status: updatedSend.status,
        textContent: updatedSend.textContent,
        fileUrls: fileUrls,
        sentAt: updatedSend.sentAt,
        homework: updatedSend.homework,
      },
    });

  } catch (error) {
    console.error('Submit homework error:', error);
    return NextResponse.json({ error: 'Erreur lors de la soumission du devoir' }, { status: 500 });
  }
}
