
import { prisma } from './prisma';

export async function checkFreeTrialAccess(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      accountType: true,
      trialStartDate: true,
      trialEndDate: true,
      trialExpired: true,
      isActive: true,
    }
  });

  if (!user) {
    return {
      hasAccess: false,
      reason: 'User not found',
      isFreeTrial: false,
      daysLeft: 0
    };
  }

  if (!user.isActive) {
    return {
      hasAccess: false,
      reason: 'Account inactive',
      isFreeTrial: false,
      daysLeft: 0
    };
  }

  if (user.accountType !== 'FREE_TRIAL') {
    return {
      hasAccess: true,
      reason: 'Full access',
      isFreeTrial: false,
      daysLeft: 0
    };
  }

  if (user.trialExpired) {
    return {
      hasAccess: false,
      reason: 'Trial expired',
      isFreeTrial: true,
      daysLeft: 0
    };
  }

  if (!user.trialEndDate) {
    return {
      hasAccess: false,
      reason: 'No trial end date',
      isFreeTrial: true,
      daysLeft: 0
    };
  }

  const now = new Date();
  const trialEnd = new Date(user.trialEndDate);

  if (now > trialEnd) {
    await prisma.user.update({
      where: { id: userId },
      data: { trialExpired: true }
    });

    return {
      hasAccess: false,
      reason: 'Trial expired',
      isFreeTrial: true,
      daysLeft: 0
    };
  }

  const daysLeft = Math.ceil((trialEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  return {
    hasAccess: true,
    reason: 'Trial active',
    isFreeTrial: true,
    daysLeft
  };
}

export function isChapter1Content(pathname: string): boolean {
  if (pathname === '/dashboard' || pathname === '/notice') {
    return true;
  }

  const chapterMatch = pathname.match(/^\/chapitres\/(\d+)/);
  if (chapterMatch) {
    const chapterNumber = parseInt(chapterMatch[1], 10);
    return chapterNumber === 0 || chapterNumber === 1;
  }

  return false;
}
