import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUserFromRequest } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthUserFromRequest(req);
    if (!user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    // 🔹 Vérifier si l'utilisateur est professeur (optionnel)
    const isProfessor = await prisma.professor.findUnique({
      where: { id: user.id },
    });
    if (!isProfessor) {
      return NextResponse.json({ error: "Accès réservé à l'admin" }, { status: 403 });
    }

    const homeworks = await prisma.homework.findMany({
      orderBy: { chapterId: "asc" },
    });

    return NextResponse.json(homeworks);
  } catch (error) {
    console.error("Erreur GET /admin/homework:", error);
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthUserFromRequest(req);
    if (!user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const isProfessor = await prisma.professor.findUnique({
      where: { id: user.id },
    });
    if (!isProfessor) {
      return NextResponse.json({ error: "Accès réservé à l'admin" }, { status: 403 });
    }

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

export async function DELETE(req: NextRequest) {
  try {
    const user = await getAuthUserFromRequest(req);
    if (!user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const isProfessor = await prisma.professor.findUnique({
      where: { id: user.id },
    });
    if (!isProfessor) {
      return NextResponse.json({ error: "Accès réservé à l'admin" }, { status: 403 });
    }

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
