import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";

export async function POST(req: NextRequest) {
  try {
    await requireAdmin(req);

    const { tajwidHomeworkId, userIds } = await req.json();

    if (!tajwidHomeworkId) {
      return NextResponse.json({ error: "ID du devoir requis" }, { status: 400 });
    }

    const homework = await prisma.tajwidHomework.findUnique({
      where: { id: tajwidHomeworkId }
    });

    if (!homework) {
      return NextResponse.json({ error: "Devoir Tajwid introuvable" }, { status: 404 });
    }

    let targetUserIds: string[] = [];

    if (userIds && Array.isArray(userIds) && userIds.length > 0) {
      targetUserIds = userIds;
    } else {
      const allUsers = await prisma.user.findMany({
        where: { isActive: true },
        select: { id: true }
      });
      targetUserIds = allUsers.map(u => u.id);
    }

    if (targetUserIds.length === 0) {
      return NextResponse.json({ error: "Aucun utilisateur cible" }, { status: 400 });
    }

    const results = await Promise.allSettled(
      targetUserIds.map(async (userId) => {
        return prisma.tajwidHomeworkSend.upsert({
          where: {
            userId_tajwidHomeworkId: {
              userId,
              tajwidHomeworkId
            }
          },
          create: {
            userId,
            tajwidHomeworkId,
            emailSent: false
          },
          update: {}
        });
      })
    );

    const successCount = results.filter(r => r.status === 'fulfilled').length;
    const failCount = results.filter(r => r.status === 'rejected').length;

    return NextResponse.json({
      success: true,
      sent: successCount,
      failed: failCount,
      total: targetUserIds.length
    });
  } catch (error) {
    console.error("Erreur POST /homework/tajwid/send:", error);
    return NextResponse.json(
      { error: "Erreur lors de l'envoi du devoir Tajwid" },
      { status: 500 }
    );
  }
}
