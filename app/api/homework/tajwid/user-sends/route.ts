import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const user = await getUser(req);
    if (!user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const sends = await prisma.tajwidHomeworkSend.findMany({
      where: { userId: user.id },
      include: {
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
    console.error("Erreur GET /homework/tajwid/user-sends:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des envois" },
      { status: 500 }
    );
  }
}
