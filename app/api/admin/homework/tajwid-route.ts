import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";

// GET - Récupérer tous les devoirs Tajwid
export async function GET(req: NextRequest) {
  try {
    await requireAdmin(req);

    const tajwidHomeworks = await prisma.tajwidHomework.findMany({
      orderBy: { chapterId: "asc" },
    });

    return NextResponse.json(tajwidHomeworks);
  } catch (error) {
    console.error("Erreur GET /admin/homework/tajwid:", error);
    return NextResponse.json({ error: "Accès non autorisé" }, { status: 403 });
  }
}

// POST - Créer un nouveau devoir Tajwid
export async function POST(req: NextRequest) {
  try {
    await requireAdmin(req);

    const { chapterId, title, content } = await req.json();

    if (!chapterId || !title || !content) {
      return NextResponse.json({ error: "Tous les champs sont requis" }, { status: 400 });
    }

    if (typeof chapterId !== 'number' || chapterId < 0 || chapterId > 11) {
      return NextResponse.json({ error: "Numéro de chapitre invalide (0-11)" }, { status: 400 });
    }

    const existingHomework = await prisma.tajwidHomework.findFirst({
      where: { chapterId }
    });

    if (existingHomework) {
      return NextResponse.json({ 
        error: `Un devoir existe déjà pour le chapitre ${chapterId}` 
      }, { status: 400 });
    }

    const tajwidHomework = await prisma.tajwidHomework.create({
      data: { 
        chapterId, 
        title: title.trim(), 
        content: content.trim() 
      },
    });

    return NextResponse.json(tajwidHomework, { status: 201 });
  } catch (error) {
    console.error("Erreur POST /admin/homework/tajwid:", error);
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 });
  }
}

// PUT - Modifier un devoir Tajwid
export async function PUT(req: NextRequest) {
  try {
    await requireAdmin(req);

    const { id, chapterId, title, content } = await req.json();

    if (!id || !chapterId || !title || !content) {
      return NextResponse.json({ error: "Tous les champs sont requis" }, { status: 400 });
    }

    if (typeof chapterId !== 'number' || chapterId < 0 || chapterId > 11) {
      return NextResponse.json({ error: "Numéro de chapitre invalide (0-11)" }, { status: 400 });
    }

    const existingHomework = await prisma.tajwidHomework.findUnique({
      where: { id }
    });

    if (!existingHomework) {
      return NextResponse.json({ error: "Devoir non trouvé" }, { status: 404 });
    }

    const conflictingHomework = await prisma.tajwidHomework.findFirst({
      where: { 
        chapterId,
        id: { not: id }
      }
    });

    if (conflictingHomework) {
      return NextResponse.json({ 
        error: `Un autre devoir existe déjà pour le chapitre ${chapterId}` 
      }, { status: 400 });
    }

    const tajwidHomework = await prisma.tajwidHomework.update({
      where: { id },
      data: { 
        chapterId,
        title: title.trim(), 
        content: content.trim() 
      },
    });

    return NextResponse.json(tajwidHomework);
  } catch (error) {
    console.error("Erreur PUT /admin/homework/tajwid:", error);
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 });
  }
}

// DELETE - Supprimer un devoir Tajwid
export async function DELETE(req: NextRequest) {
  try {
    await requireAdmin(req);

    const { id } = await req.json();
    
    if (!id) {
      return NextResponse.json({ error: "ID requis" }, { status: 400 });
    }

    await prisma.tajwidHomework.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erreur DELETE /admin/homework/tajwid:", error);
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 });
  }
}
