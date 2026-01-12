// app/api/quran/audio/route.ts
import { NextRequest, NextResponse } from 'next/server';

// Mapping des récitateurs vers les dossiers everyayah.com
// Source: https://everyayah.com/recitations_ayat.html
const reciterFolders: { [key: string]: string } = {
  'abdul-basit': 'Abdul_Basit_Mujawwad_128kbps',
  'ayman-suwaid': 'Ayman_Sowaid_64kbps',
  'minshawi': 'Minshawy_Mujawwad_192kbps',
  'hudhaify': 'Hudhaify_128kbps',
  'sudais': 'Abdurrahmaan_As-Sudais_192kbps',
  'afasy': 'Alafasy_128kbps',
};

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const reciterId = searchParams.get('reciterId');
    const surah = searchParams.get('surah');
    const ayah = searchParams.get('ayah');

    if (!reciterId || !surah || !ayah) {
      return NextResponse.json(
        { error: 'Paramètres manquants' },
        { status: 400 }
      );
    }

    const surahNum = parseInt(surah, 10);
    const ayahNum = parseInt(ayah, 10);

    // Vérifier si le récitateur est supporté
    const audioFolder = reciterFolders[reciterId];
    if (!audioFolder) {
      return NextResponse.json(
        { error: 'Récitateur non supporté' },
        { status: 400 }
      );
    }

    // Construire l'URL audio (format: SSSAAA.mp3)
    const surahPadded = surahNum.toString().padStart(3, '0');
    const ayahPadded = ayahNum.toString().padStart(3, '0');
    const audioUrl = `https://everyayah.com/data/${audioFolder}/${surahPadded}${ayahPadded}.mp3`;

    console.log('Fetching audio from:', audioUrl);

    // Récupérer le fichier audio
    const audioResponse = await fetch(audioUrl);

    if (!audioResponse.ok) {
      console.error('Audio fetch failed:', audioResponse.status);
      return NextResponse.json(
        { error: 'Audio non trouvé' },
        { status: 404 }
      );
    }

    // Streamer l'audio vers le client
    const audioBuffer = await audioResponse.arrayBuffer();

    return new NextResponse(audioBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': audioBuffer.byteLength.toString(),
        'Cache-Control': 'public, max-age=86400',
      },
    });

  } catch (error) {
    console.error('Erreur proxy audio:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}