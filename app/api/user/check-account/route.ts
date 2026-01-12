// app/api/user/check-account/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { PrismaClient } from '@prisma/client';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback-secret');
const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Missing or invalid token" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];

    const { payload } = await jwtVerify(token, JWT_SECRET);

    if (!payload?.userId) {
      return NextResponse.json({ error: "Invalid token payload" }, { status: 401 });
    }

    const { userId } = await request.json();

    if (payload.userId !== userId) {
      return NextResponse.json({ error: "Forbidden: user mismatch" }, { status: 403 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        accountType: true,
        subscriptionStartDate: true,
        subscriptionEndDate: true,
      }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Vérifier si l'abonnement est expiré
    const isExpired = user.subscriptionEndDate 
      ? new Date(user.subscriptionEndDate) < new Date() 
      : user.accountType === 'INACTIVE' || user.accountType === 'EXPIRED';

    return NextResponse.json({
      accountType: user.accountType,
      subscriptionExpired: isExpired,
      subscriptionStartDate: user.subscriptionStartDate,
      subscriptionEndDate: user.subscriptionEndDate
    });

  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}