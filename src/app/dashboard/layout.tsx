
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LoaderCircle } from 'lucide-react';

import AppSidebar from '@/components/shared/sidebar';
import AppHeader from '@/components/shared/header';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isOnboardingComplete, setIsOnboardingComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // This code runs only on the client
    const onboardingStatus = localStorage.getItem('onboardingComplete');
    if (onboardingStatus === 'true') {
      setIsOnboardingComplete(true);
    } else {
      router.replace('/onboarding');
    }
    setIsLoading(false);
  }, [router]);

  if (isLoading || !isOnboardingComplete) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <LoaderCircle className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <div className="flex flex-col flex-1">
          <AppHeader />
          <SidebarInset>
            <main className="min-h-screen w-full">{children}</main>
          </SidebarInset>
        </div>
      </div>
    </SidebarProvider>
  );
}
