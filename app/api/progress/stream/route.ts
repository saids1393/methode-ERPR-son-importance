//app/api/progress/stream/route.ts

import { NextRequest } from 'next/server';
import { getAuthUserFromRequest } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUserFromRequest(request);
    
    if (!user) {
      return new Response('Unauthorized', { status: 401 });
    }

    // Configuration SSE
    const stream = new ReadableStream({
      start(controller) {
        const encoder = new TextEncoder();
        
        // Fonction pour envoyer des données
        const sendData = (data: any) => {
          const message = `data: ${JSON.stringify(data)}\n\n`;
          controller.enqueue(encoder.encode(message));
        };

        // Envoyer un ping initial
        sendData({ type: 'connected', userId: user.id });

        // Garder la connexion ouverte
        const keepAlive = setInterval(() => {
          sendData({ type: 'ping', timestamp: Date.now() });
        }, 30000); // Ping toutes les 30 secondes

        // Nettoyer lors de la fermeture
        request.signal.addEventListener('abort', () => {
          clearInterval(keepAlive);
          controller.close();
        });
      }
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Cache-Control',
      },
    });
  } catch (error) {
    console.error('SSE stream error:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}