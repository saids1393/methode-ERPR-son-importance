import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import { AssiduityTester, AssiduityTestConfig } from '@/lib/tests/assiduity-test';

export async function POST(request: NextRequest) {
  try {
    await requireAdmin(request);

    const body = await request.json();
    const config: AssiduityTestConfig = {
      analysisDepth: body.analysisDepth || 'week',
      includeInactive: body.includeInactive || false,
      minStudyTime: body.minStudyTime || 300, // 5 minutes par défaut
      minProgressThreshold: body.minProgressThreshold || 10 // 10% par défaut
    };

    console.log('📊 [API] Lancement du test d\'assiduité avec config:', config);

    const tester = new AssiduityTester(config);
    const result = await tester.runTest();

    console.log('✅ [API] Test d\'assiduité terminé:', result.testId);

    return NextResponse.json({
      success: true,
      result
    });
  } catch (error) {
    console.error('❌ [API] Erreur test d\'assiduité:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Erreur interne du serveur' 
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    await requireAdmin(request);

    // Test rapide par défaut
    const tester = new AssiduityTester({
      analysisDepth: 'week',
      includeInactive: false,
      minStudyTime: 300,
      minProgressThreshold: 10
    });

    const result = await tester.runTest();

    return NextResponse.json({
      success: true,
      result
    });
  } catch (error) {
    console.error('❌ [API] Erreur test d\'assiduité rapide:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Erreur interne du serveur' 
      },
      { status: 500 }
    );
  }
}