//app/api/quran/reciters/route.ts
import { NextResponse } from 'next/server';

// URL de l'API Quran.com pour les récitateurs
// https://api.quran.com/api/v4/resources/recitations

export async function GET() {
  try {
    const response = await fetch('https://api.quran.com/api/v4/resources/recitations', {
      next: { revalidate: 86400 } // Cache pendant 24h
    });

    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des récitateurs');
    }

    const data = await response.json();
    
    // Filtrer pour ne garder que les récitateurs les plus populaires
    // IDs des récitateurs populaires : 
    // 7 = Mishary Rashid Alafasy
    // 1 = Abdul Basit Abdul Samad (Murattal)
    // 2 = Abdul Rahman Al-Sudais
    // 5 = Abu Bakr Al-Shatri
    // 6 = Hani Ar-Rifai
    const popularReciterIds = [7, 1, 2, 5, 6];
    
    const filteredReciters = data.recitations.filter((reciter: any) => 
      popularReciterIds.includes(reciter.id)
    );

    return NextResponse.json({
      recitations: filteredReciters,
      success: true
    });
  } catch (error) {
    console.error('Erreur API reciters:', error);
    return NextResponse.json(
      { error: 'Impossible de récupérer les récitateurs', success: false },
      { status: 500 }
    );
  }
}
