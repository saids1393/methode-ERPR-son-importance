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

    console.log('📝 [ADMIN] Création devoir - Données reçues:', { chapterId, title, content });

    if (!chapterId || !title || !content) {
      console.log('❌ [ADMIN] Données manquantes:', { chapterId, title, content });
      return NextResponse.json({ error: "Tous les champs sont requis" }, { status: 400 });
    }

    // Validation du chapterId
    if (typeof chapterId !== 'number' || chapterId < 0 || chapterId > 11) {
      console.log('❌ [ADMIN] ChapterId invalide:', chapterId);
      return NextResponse.json({ error: "Numéro de chapitre invalide (0-11)" }, { status: 400 });
    }

    // Vérifier si un devoir existe déjà pour ce chapitre
    const existingHomework = await prisma.homework.findFirst({
      where: { chapterId }
    });

    if (existingHomework) {
      console.log('⚠️ [ADMIN] Devoir existant trouvé pour le chapitre', chapterId);
      return NextResponse.json({ 
        error: `Un devoir existe déjà pour le chapitre ${chapterId}. Utilisez la modification pour le mettre à jour.` 
      }, { status: 400 });
    }

    const homework = await prisma.homework.create({
      data: { 
        chapterId: parseInt(chapterId.toString()), 
        title: title.trim(), 
        content: content.trim() 
      },
    });

    console.log('✅ [ADMIN] Devoir créé avec succès:', homework);
    return NextResponse.json(homework, { status: 201 });
  } catch (error) {
    console.error("Erreur POST /admin/homework:", error);
    
    // Gestion des erreurs spécifiques de Prisma
    if (error instanceof Error) {
      if (error.message.includes('Unique constraint')) {
        return NextResponse.json(
          { error: 'Un devoir existe déjà pour ce chapitre' },
          { status: 400 }
        );
      }
    }
    
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    await requireAdmin(req);

    const { id, chapterId, title, content } = await req.json();

    console.log('📝 [ADMIN] Modification devoir - Données reçues:', { id, chapterId, title, content });

    if (!id || !chapterId || !title || !content) {
      console.log('❌ [ADMIN] Données manquantes pour modification:', { id, chapterId, title, content });
      return NextResponse.json({ error: "Tous les champs sont requis" }, { status: 400 });
    }

    // Validation du chapterId
    if (typeof chapterId !== 'number' || chapterId < 0 || chapterId > 11) {
      console.log('❌ [ADMIN] ChapterId invalide:', chapterId);
      return NextResponse.json({ error: "Numéro de chapitre invalide (0-11)" }, { status: 400 });
    }

    // Vérifier si le devoir existe
    const existingHomework = await prisma.homework.findUnique({
      where: { id }
    });

    if (!existingHomework) {
      console.log('❌ [ADMIN] Devoir non trouvé:', id);
      return NextResponse.json({ error: "Devoir non trouvé" }, { status: 404 });
    }

    // Vérifier si un autre devoir existe déjà pour ce chapitre (sauf celui qu'on modifie)
    const conflictingHomework = await prisma.homework.findFirst({
      where: { 
        chapterId,
        id: { not: id }
      }
    });

    if (conflictingHomework) {
      console.log('⚠️ [ADMIN] Conflit - Un autre devoir existe pour le chapitre', chapterId);
      return NextResponse.json({ 
        error: `Un autre devoir existe déjà pour le chapitre ${chapterId}` 
      }, { status: 400 });
    }

    const homework = await prisma.homework.update({
      where: { id },
      data: { 
        chapterId: parseInt(chapterId.toString()), 
        title: title.trim(), 
        content: content.trim() 
      },
    });

    console.log('✅ [ADMIN] Devoir modifié avec succès:', homework);
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
