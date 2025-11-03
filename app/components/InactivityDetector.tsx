'use client';

import { useInactivityLogout } from '@/hooks/useInactivityLogout';

export default function InactivityDetector() {
  useInactivityLogout();
  return null;
}
