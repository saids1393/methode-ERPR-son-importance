import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";

export async function GET(req: NextRequest) {
  try {
    await requireAdmin(req);

    const homeworks = await prisma.homework.findMany({
      orderBy: { chapterId: "asc" },
    });

    return NextResponse.json(homeworks);
  } catch (error) {
    console.error("Erreur GET /admin/homework:", error);
    return NextResponse.json({ error: "Accès non autorisé" }, { status: 403 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAdmin(req);

    const { chapterId, title, content } = await req.json();

    if (!chapterId || !title || !content) {
      return NextResponse.json({ error: "Tous les champs sont requis" }, { status: 400 });
    }

    const homework = await prisma.homework.create({
      data: { chapterId, title, content },
    });

    return NextResponse.json(homework, { status: 201 });
  } catch (error) {
    console.error("Erreur POST /admin/homework:", error);
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    await requireAdmin(req);

    const { id, chapterId, title, content } = await req.json();

    if (!id || !chapterId || !title || !content) {
      return NextResponse.json({ error: "Tous les champs sont requis" }, { status: 400 });
    }

    const homework = await prisma.homework.update({
      where: { id },
      data: { chapterId, title, content },
    });

    return NextResponse.json(homework);
  } catch (error) {
    console.error("Erreur PUT /admin/homework:", error);
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 });
  }
}
export async function DELETE(req: NextRequest) {
  try {
    await requireAdmin(req);

    const { id } = await req.json();
    if (!id) {
      return NextResponse.json({ error: "ID requis" }, { status: 400 });
    }

    await prisma.homework.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erreur DELETE /admin/homework:", error);
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 });
  }
}
