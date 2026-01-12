// app/api/quran/ayah/route.ts
import { NextRequest, NextResponse } from 'next/server';

// Mapping des IDs de récitateurs vers les IDs de l'API Quran.com
// Liste complète: https://api.quran.com/api/v4/resources/recitations
const reciterMapping: { [key: number]: number } = {
  7: 7,   // Mishary Rashid Alafasy
  2: 2,   // Abdul Rahman Al-Sudais  
  1: 1,   // Abdul Basit Abdul Samad (Murattal)
  5: 5,   // Abu Bakr Al-Shatri
  6: 6,   // Hani Ar-Rifai
};

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const reciterId = searchParams.get('reciterId');
    const surah = searchParams.get('surah');
    const ayah = searchParams.get('ayah');

    console.log('=== API AYAH DEBUG ===');
    console.log('Params reçus:', { reciterId, surah, ayah });

    if (!reciterId || !surah || !ayah) {
      console.log('❌ Paramètres manquants');
      return NextResponse.json(
        { error: 'Paramètres manquants: reciterId, surah et ayah sont requis', success: false },
        { status: 400 }
      );
    }

    const reciterIdNum = parseInt(reciterId, 10);
    const surahNum = parseInt(surah, 10);
    const ayahNum = parseInt(ayah, 10);

    console.log('Params parsés:', { reciterIdNum, surahNum, ayahNum });

    // Vérifier si le récitateur est supporté
    const quranApiReciterId = reciterMapping[reciterIdNum];
    if (!quranApiReciterId) {
      console.log('❌ Récitateur non supporté, ID:', reciterIdNum);
      return NextResponse.json(
        { error: 'Récitateur non supporté', success: false },
        { status: 400 }
      );
    }

    // Appeler l'API Quran.com pour obtenir l'URL audio
    const verseKey = `${surahNum}:${ayahNum}`;
    const apiUrl = `https://api.quran.com/api/v4/recitations/${quranApiReciterId}/by_ayah/${verseKey}`;
    
    console.log('Appel API Quran.com:', apiUrl);

    const response = await fetch(apiUrl, {
      headers: {
        'Accept': 'application/json',
      },
      next: { revalidate: 86400 } // Cache 24h
    });

    console.log('Response status:', response.status);

    if (!response.ok) {
      console.log('❌ Erreur API Quran.com:', response.status, response.statusText);
      return NextResponse.json(
        { error: `Erreur API Quran.com: ${response.status}`, success: false },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('Data reçue:', JSON.stringify(data, null, 2));

    // Extraire l'URL audio
    if (data.audio_files && data.audio_files.length > 0) {
      let audioUrl = data.audio_files[0].url;
      
      // L'URL peut être relative, ajouter le domaine si nécessaire
      if (!audioUrl.startsWith('http')) {
        audioUrl = `https://verses.quran.com/${audioUrl}`;
      }

      console.log('✅ URL audio finale:', audioUrl);

      return NextResponse.json({
        audioUrl,
        verseKey,
        success: true
      });
    } else {
      console.log('❌ Pas d\'audio trouvé dans la réponse');
      return NextResponse.json(
        { error: 'Audio non trouvé pour ce verset', success: false },
        { status: 404 }
      );
    }

  } catch (error) {
    console.error('❌ Erreur API ayah:', error);
    return NextResponse.json(
      { error: 'Impossible de récupérer l\'audio du verset', success: false },
      { status: 500 }
    );
  }
}