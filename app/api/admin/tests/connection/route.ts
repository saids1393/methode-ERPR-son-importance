import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import { ConnectionTester, ConnectionTestConfig } from '@/lib/tests/connection-test';

export async function POST(request: NextRequest) {
  try {
    await requireAdmin(request);

    const body = await request.json();
    const config: ConnectionTestConfig = {
      sampleSize: Math.min(Math.max(body.sampleSize || 10, 1), 100),
      includeInactive: body.includeInactive || false,
      testType: body.testType || 'connection',
      timeout: body.timeout || 5000
    };

    console.log('🔧 [API] Lancement du test de connexion avec config:', config);

    const tester = new ConnectionTester(config);
    const result = await tester.runTest();

    console.log('✅ [API] Test de connexion terminé:', result.testId);

    return NextResponse.json({
      success: true,
      result
    });
  } catch (error) {
    console.error('❌ [API] Erreur test de connexion:', error);
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
    const tester = new ConnectionTester({
      sampleSize: 5,
      includeInactive: false,
      testType: 'performance',
      timeout: 3000
    });

    const result = await tester.runTest();

    return NextResponse.json({
      success: true,
      result
    });
  } catch (error) {
    console.error('❌ [API] Erreur test de connexion rapide:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Erreur interne du serveur' 
      },
      { status: 500 }
    );
  }
}