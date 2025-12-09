import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const user = await getUser(req);
    if (!user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const tajwidHomeworkSends = await prisma.tajwidHomeworkSend.findMany({
      where: { userId: user.id },
      include: {
        tajwidHomework: {
          select: {
            id: true,
            chapterId: true,
            title: true,
            content: true,
            createdAt: true,
          },
        },
      },
      orderBy: {
        tajwidHomework: {
          chapterId: 'asc'
        }
      }
    });

    const homeworks = tajwidHomeworkSends.map((send) => ({
      id: send.tajwidHomework.id,
      chapterId: send.tajwidHomework.chapterId,
      title: send.tajwidHomework.title,
      content: send.tajwidHomework.content,
      createdAt: send.tajwidHomework.createdAt,
      sentAt: send.sentAt,
      emailSent: send.emailSent,
      submission: send.textContent || send.fileUrls ? {
        type: send.type,
        textContent: send.textContent,
        files: send.fileUrls ? JSON.parse(send.fileUrls) : null,
        fileUrls: send.fileUrls,
        status: send.status,
        feedback: send.feedback,
        correctedAt: send.correctedAt
      } : null
    }));

    return NextResponse.json(homeworks);
  } catch (error) {
    console.error("Erreur GET /homework/tajwid/mine:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des devoirs Tajwid" },
      { status: 500 }
    );
  }
}
