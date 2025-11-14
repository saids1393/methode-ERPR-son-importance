// app/api/user/check-account/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { PrismaClient } from '@prisma/client';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback-secret');
const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    // 1. Vérifier la présence du header Authorization
    const authHeader = request.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Missing or invalid token" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];

    // 2. Vérifier le JWT
    const { payload } = await jwtVerify(token, JWT_SECRET);

    if (!payload?.userId) {
      return NextResponse.json({ error: "Invalid token payload" }, { status: 401 });
    }

    // 3. Lire le body (userId)
    const { userId } = await request.json();

    // Vérifier que userId du JWT = userId du body (sécurité ++)
    if (payload.userId !== userId) {
      return NextResponse.json({ error: "Forbidden: user mismatch" }, { status: 403 });
    }

    // 4. Récupérer l'utilisateur en base
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        accountType: true,
        trialExpired: true,
        trialEndDate: true
      }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // 5. Vérifier si le trial est expiré
    const now = new Date();
    const isExpired = user.trialEndDate ? now > new Date(user.trialEndDate) : false;

    return NextResponse.json({
      accountType: user.accountType,
      trialExpired: user.trialExpired || isExpired,
      trialEndDate: user.trialEndDate
    });

  } catch (error) {
    console.error("JWT error:", error);
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}




