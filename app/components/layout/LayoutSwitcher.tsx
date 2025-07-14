'use client';
import DesktopLayout from './DesktopLayout';
import MobileLayout from './MobileLayout';

export default function LayoutSwitcher({ children }: { children: React.ReactNode }) {
  return (
    <>
      <DesktopLayout>{children}</DesktopLayout>
      <MobileLayout>{children}</MobileLayout>
    </>
  );
}