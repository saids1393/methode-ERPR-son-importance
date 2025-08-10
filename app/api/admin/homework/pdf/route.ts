import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import { prisma } from '@/lib/prisma';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

export async function POST(request: NextRequest) {
  try {
    await requireAdmin(request);

    const { homeworkId } = await request.json();

    if (!homeworkId) {
      return NextResponse.json(
        { error: 'ID du devoir requis' },
        { status: 400 }
      );
    }

    const homework = await prisma.homework.findUnique({
      where: { id: homeworkId }
    });

    if (!homework) {
      return NextResponse.json(
        { error: 'Devoir non trouvé' },
        { status: 404 }
      );
    }

    if (!homework.title || !homework.content || !homework.chapterId) {
      return NextResponse.json(
        { error: 'Devoir incomplet' },
        { status: 400 }
      );
    }

    const pdfDoc = await PDFDocument.create();
    let page = pdfDoc.addPage([595, 842]);
    const { width, height } = page.getSize();

    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    const fontSize = 12;
    const titleFontSize = 18;
    const margin = 50;
    let y = height - margin;

    // En-tête
    page.drawText('MÉTHODE ERPR - DEVOIR', {
      x: margin,
      y,
      size: titleFontSize,
      font: boldFont,
      color: rgb(0.2, 0.2, 0.8)
    });
    y -= 30;

    page.drawText(`Chapitre ${homework.chapterId}`, {
      x: margin,
      y,
      size: fontSize + 2,
      font: boldFont,
      color: rgb(0.4, 0.4, 0.4)
    });
    y -= 40;

    // Titre
    page.drawText(homework.title, {
      x: margin,
      y,
      size: titleFontSize - 2,
      font: boldFont,
      color: rgb(0.1, 0.1, 0.1)
    });
    y -= 40;

    // Contenu
    const lines = homework.content.split('\n');
    for (const line of lines) {
      if (y < 100) {
        page = pdfDoc.addPage([595, 842]);  // <-- réaffectation importante
        y = height - margin;
      }

      if (line.trim()) {
        const maxWidth = width - 2 * margin;
        const words = line.split(' ');
        let currentLine = '';
        
        for (const word of words) {
          const testLine = currentLine ? `${currentLine} ${word}` : word;
          const textWidth = font.widthOfTextAtSize(testLine, fontSize);
          
          if (textWidth > maxWidth && currentLine) {
            page.drawText(currentLine, {
              x: margin,
              y,
              size: fontSize,
              font
            });
            y -= 20;
            currentLine = word;
          } else {
            currentLine = testLine;
          }
        }
        
        if (currentLine) {
          page.drawText(currentLine, {
            x: margin,
            y,
            size: fontSize,
            font
          });
          y -= 20;
        }
      } else {
        y -= 15;
      }
    }

    // Pied de page
    y = 50;
    page.drawText(`Généré le ${new Date().toLocaleDateString('fr-FR')} - Méthode ERPR`, {
      x: margin,
      y,
      size: 10,
      font,
      color: rgb(0.5, 0.5, 0.5)
    });

    const pdfBytes = await pdfDoc.save();

    // Conversion en Buffer pour éviter l'erreur ArrayBufferLike
    const pdfBuffer = Buffer.from(pdfBytes);

    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="devoir-chapitre-${homework.chapterId}.pdf"`,
      },
    });
  } catch (error) {
    console.error('Generate homework PDF error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la génération du PDF' },
      { status: 500 }
    );
  }
}
