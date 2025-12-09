import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";

export async function GET(req: NextRequest) {
  try {
    await requireAdmin(req);

    const sends = await prisma.tajwidHomeworkSend.findMany({
      include: {
        user: {
          select: {
            id: true,
            email: true,
            username: true
          }
        },
        tajwidHomework: {
          select: {
            id: true,
            chapterId: true,
            title: true
          }
        }
      },
      orderBy: { sentAt: 'desc' }
    });

    return NextResponse.json({ sends });
  } catch (error) {
    console.error("Erreur GET /admin/homework/tajwid/user-sends:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des envois" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    await requireAdmin(req);

    const { id, feedback, status } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "ID requis" }, { status: 400 });
    }

    const send = await prisma.tajwidHomeworkSend.update({
      where: { id },
      data: {
        feedback,
        status: status as any,
        correctedAt: status === 'CORRECTED' ? new Date() : undefined
      },
      include: {
        user: true,
        tajwidHomework: true
      }
    });

    return NextResponse.json(send);
  } catch (error) {
    console.error("Erreur PUT /admin/homework/tajwid/user-sends:", error);
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour" },
      { status: 500 }
    );
  }
}
