
"use client";
import { useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Header } from '@/components/shared/Header';
import { ReportForm } from '@/components/hew/ReportForm';
import { LocalReportsList } from '@/components/hew/LocalReportsList';
import { OutbreakAlertsDisplay } from '@/components/hew/OutbreakAlertsDisplay';
import { Button } from '@/components/ui/button';
import { RefreshCw, CloudOff } from 'lucide-react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import type { Report } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';


export default function HEWPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const initialReports = useMemo(() => [], []);
  const [reports, setReports] = useLocalStorage<Report[]>('outbreak_sentinel_reports', initialReports);
  const { toast } = useToast();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/');
    } else if (!isLoading && isAuthenticated && user?.role !== 'hew') {
      // If logged in but not HEW, redirect to their respective page or home
      router.push(user?.role === 'officer' ? '/officer' : '/');
    }
  }, [user, isAuthenticated, isLoading, router]);

  const handleReportSubmit = (newReport: Report) => {
    setReports(prevReports => [...prevReports, newReport]);
  };

  const simulateSync = () => {
    toast({
      title: "Sync Simulated",
      description: "Data sync with server is simulated. In a real app, local reports would be uploaded.",
    });
    // In a real app, you might clear successfully synced reports or mark them as synced.
    // For this simulation, we'll just show a message.
  };

  if (isLoading || !isAuthenticated || user?.role !== 'hew') {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow container mx-auto px-2 py-4 sm:px-4 md:max-w-2xl"> {/* Mobile-like constraint */}
          <Skeleton className="h-12 w-1/2 mb-4" />
          <Skeleton className="h-64 w-full mb-6" />
          <Skeleton className="h-32 w-full" />
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-secondary/30">
      <Header />
      <main className="flex-grow container mx-auto px-2 py-6 sm:px-4 md:max-w-2xl"> {/* Mobile-like constraint */}
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-primary">HEW Mobile Portal</h2>
            <Button onClick={simulateSync} variant="outline">
                <RefreshCw className="mr-2 h-4 w-4" /> Simulate Sync
            </Button>
        </div>
        
        <OutbreakAlertsDisplay reports={reports} />
        <ReportForm onReportSubmit={handleReportSubmit} />
        <LocalReportsList reports={reports} />

        <div className="mt-8 p-3 bg-muted text-muted-foreground rounded-lg text-sm flex items-center justify-center gap-2">
            <CloudOff size={18} />
            <span>Offline mode enabled. Reports are saved locally.</span>
        </div>
      </main>
    </div>
  );
}
