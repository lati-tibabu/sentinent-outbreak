
"use client";
import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Header } from '@/components/shared/Header';
import { SimulatedMap } from '@/components/officer/SimulatedMap';
import { ReportFilters, type ReportFiltersState } from '@/components/officer/ReportFilters';
import { ReportsTable } from '@/components/officer/ReportsTable';
import { DailyReportSection } from '@/components/officer/DailyReportSection';
import { AdminSettingsSection } from '@/components/officer/AdminSettingsSection';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import type { Report } from '@/lib/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function OfficerPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const initialReports = useMemo(() => [], []);
  const [reports, setReports] = useLocalStorage<Report[]>('outbreak_sentinel_reports', initialReports);
  const [filters, setFilters] = useState<ReportFiltersState>({
    region: '',
    disease: '',
    date: undefined,
  });

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/');
    } else if (!isLoading && isAuthenticated && user?.role !== 'officer') {
      router.push(user?.role === 'hew' ? '/hew' : '/');
    }
  }, [user, isAuthenticated, isLoading, router]);

  const filteredReports = useMemo(() => {
    return reports.filter(report => {
      const matchRegion = filters.region ? report.region === filters.region : true;
      const matchDisease = filters.disease ? report.suspectedDisease === filters.disease : true;
      const matchDate = filters.date ? new Date(report.timestamp).toDateString() === filters.date.toDateString() : true;
      return matchRegion && matchDisease && matchDate;
    });
  }, [reports, filters]);

  if (isLoading || !isAuthenticated || user?.role !== 'officer') {
    return (
       <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
          <Skeleton className="h-12 w-1/3 mb-6" />
          <Skeleton className="h-20 w-full mb-6" />
          <div className="grid md:grid-cols-2 gap-6">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-muted/30">
      <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
          <h2 className="text-3xl font-bold text-primary mb-6">Woreda Health Officer Dashboard</h2>
          
          <Tabs defaultValue="dashboard" className="w-full">
            <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3 mb-6 max-w-xl">
              <TabsTrigger value="dashboard">Main Dashboard</TabsTrigger>
              <TabsTrigger value="ai_report">AI Daily Summary</TabsTrigger>
              <TabsTrigger value="settings">Data Management</TabsTrigger>
            </TabsList>
            
            <TabsContent value="dashboard">
              <ScrollArea className="h-[calc(100vh-220px)]"> {/* Adjust height based on header/tabs */}
                <div className="pr-4 space-y-6">
                  <ReportFilters filters={filters} setFilters={setFilters} />
                  <SimulatedMap reports={filteredReports} filters={filters} />
                  <ReportsTable reports={filteredReports} />
                </div>
              </ScrollArea>
            </TabsContent>
            
            <TabsContent value="ai_report">
              <ScrollArea className="h-[calc(100vh-220px)]">
                <div className="pr-4">
                 <DailyReportSection reports={reports} /> {/* AI report uses all reports for context */}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="settings">
              <ScrollArea className="h-[calc(100vh-220px)]">
                <div className="pr-4">
                  <AdminSettingsSection setReports={setReports} />
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </main>
    </div>
  );
}
