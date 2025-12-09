import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";

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

export async function POST(req: NextRequest) {
  try {
    await requireAdmin(req);

    const { chapterId, title, content } = await req.json();

    console.log('📝 [ADMIN TAJWID] Création devoir - Données reçues:', { chapterId, title, content });

    if (!chapterId || !title || !content) {
      console.log('❌ [ADMIN TAJWID] Données manquantes:', { chapterId, title, content });
      return NextResponse.json({ error: "Tous les champs sont requis" }, { status: 400 });
    }

    // Validation du chapterId
    if (typeof chapterId !== 'number' || chapterId < 0 || chapterId > 11) {
      console.log('❌ [ADMIN TAJWID] ChapterId invalide:', chapterId);
      return NextResponse.json({ error: "Numéro de chapitre invalide (0-11)" }, { status: 400 });
    }

    // Vérifier si un devoir Tajwid existe déjà pour ce chapitre
    const existingHomework = await prisma.tajwidHomework.findFirst({
      where: { chapterId }
    });

    if (existingHomework) {
      console.log('⚠️ [ADMIN TAJWID] Devoir existant trouvé pour le chapitre', chapterId);
      return NextResponse.json({ 
        error: `Un devoir Tajwid existe déjà pour le chapitre ${chapterId}. Utilisez la modification pour le mettre à jour.` 
      }, { status: 400 });
    }

    const tajwidHomework = await prisma.tajwidHomework.create({
      data: { 
        chapterId: parseInt(chapterId.toString()), 
        title: title.trim(), 
        content: content.trim() 
      },
    });

    console.log('✅ [ADMIN TAJWID] Devoir créé avec succès:', tajwidHomework);
    return NextResponse.json(tajwidHomework, { status: 201 });
  } catch (error) {
    console.error("Erreur POST /admin/homework/tajwid:", error);
    
    // Gestion des erreurs spécifiques de Prisma
    if (error instanceof Error) {
      if (error.message.includes('Unique constraint')) {
        return NextResponse.json(
          { error: 'Un devoir Tajwid existe déjà pour ce chapitre' },
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

    console.log('📝 [ADMIN TAJWID] Modification devoir - Données reçues:', { id, chapterId, title, content });

    if (!id || !chapterId || !title || !content) {
      console.log('❌ [ADMIN TAJWID] Données manquantes pour modification:', { id, chapterId, title, content });
      return NextResponse.json({ error: "Tous les champs sont requis" }, { status: 400 });
    }

    // Validation du chapterId
    if (typeof chapterId !== 'number' || chapterId < 0 || chapterId > 11) {
      console.log('❌ [ADMIN TAJWID] ChapterId invalide:', chapterId);
      return NextResponse.json({ error: "Numéro de chapitre invalide (0-11)" }, { status: 400 });
    }

    // Vérifier si le devoir Tajwid existe
    const existingHomework = await prisma.tajwidHomework.findUnique({
      where: { id }
    });

    if (!existingHomework) {
      console.log('❌ [ADMIN TAJWID] Devoir non trouvé:', id);
      return NextResponse.json({ error: "Devoir Tajwid non trouvé" }, { status: 404 });
    }

    // Vérifier si un autre devoir Tajwid existe déjà pour ce chapitre (sauf celui qu'on modifie)
    const conflictingHomework = await prisma.tajwidHomework.findFirst({
      where: { 
        chapterId,
        id: { not: id }
      }
    });

    if (conflictingHomework) {
      console.log('⚠️ [ADMIN TAJWID] Conflit - Un autre devoir existe pour le chapitre', chapterId);
      return NextResponse.json({ 
        error: `Un autre devoir Tajwid existe déjà pour le chapitre ${chapterId}` 
      }, { status: 400 });
    }

    const tajwidHomework = await prisma.tajwidHomework.update({
      where: { id },
      data: { 
        chapterId: parseInt(chapterId.toString()), 
        title: title.trim(), 
        content: content.trim() 
      },
    });

    console.log('✅ [ADMIN TAJWID] Devoir modifié avec succès:', tajwidHomework);
    return NextResponse.json(tajwidHomework);
  } catch (error) {
    console.error("Erreur PUT /admin/homework/tajwid:", error);
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

    await prisma.tajwidHomework.delete({ where: { id } });
    console.log('✅ [ADMIN TAJWID] Devoir supprimé:', id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erreur DELETE /admin/homework/tajwid:", error);
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 });
  }
}