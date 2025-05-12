
"use client";
import { useEffect, useState, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Header } from '@/components/shared/Header';
// import { SimulatedMap } from '@/components/officer/SimulatedMap'; // Old map
import { ReportFilters, type ReportFiltersState } from '@/components/officer/ReportFilters';
import { ReportsTable } from '@/components/officer/ReportsTable';
import { DailyReportSection } from '@/components/officer/DailyReportSection';
import { AdminSettingsSection } from '@/components/officer/AdminSettingsSection';
import type { Report } from '@/lib/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from '@/hooks/use-toast';
import dynamic from 'next/dynamic';

// Dynamically import the OutbreakMap component as it uses Leaflet (client-side only)
const OutbreakMap = dynamic(() => 
  import('@/components/officer/OutbreakMap').then(mod => mod.OutbreakMap), 
  { 
    ssr: false,
    loading: () => <Skeleton className="h-[450px] w-full" /> 
  }
);


export default function OfficerPage() {
  const { user, isAuthenticated, isLoading: authIsLoading } = useAuth();
  const router = useRouter();
  const [allReports, setAllReports] = useState<Report[]>([]);
  const [isLoadingReports, setIsLoadingReports] = useState(true);
  const { toast } = useToast();

  const [filters, setFilters] = useState<ReportFiltersState>({
    region: '',
    disease: '',
    date: undefined,
  });

  const fetchReports = useCallback(async (currentFilters?: ReportFiltersState) => {
    setIsLoadingReports(true);
    const activeFilters = currentFilters || filters;
    const queryParams = new URLSearchParams();
    if (activeFilters.region) queryParams.append('region', activeFilters.region);
    if (activeFilters.disease) queryParams.append('disease', activeFilters.disease);
    if (activeFilters.date) queryParams.append('date', activeFilters.date.toISOString());

    try {
      const response = await fetch(`/api/reports?${queryParams.toString()}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch reports');
      }
      const data = await response.json();
      setAllReports(data.reports || []);
    } catch (error: any) {
      console.error("Error fetching reports:", error);
      toast({ variant: "destructive", title: "Error Fetching Reports", description: error.message });
      setAllReports([]); 
    } finally {
      setIsLoadingReports(false);
    }
  }, [filters, toast]); 

  useEffect(() => {
    if (!authIsLoading && !isAuthenticated) {
      router.push('/auth/login');
    } else if (!authIsLoading && isAuthenticated && user?.role !== 'officer') {
      router.push(user?.role === 'hew' ? '/hew' : '/auth/login');
    } else if (!authIsLoading && isAuthenticated && user?.role === 'officer') {
      fetchReports();
    }
  }, [user, isAuthenticated, authIsLoading, router, fetchReports]); 

  useEffect(() => {
    if (isAuthenticated && user?.role === 'officer') {
      fetchReports(filters);
    }
  }, [filters, isAuthenticated, user, fetchReports]);


  const filteredReports = allReports;

  if (authIsLoading || !isAuthenticated || user?.role !== 'officer') {
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
              <ScrollArea className="h-[calc(100vh-220px)]"> 
                <div className="pr-4 space-y-6">
                  <ReportFilters filters={filters} setFilters={setFilters} />
                  {isLoadingReports ? <Skeleton className="h-[450px] w-full" /> : <OutbreakMap reports={filteredReports} />}
                  {isLoadingReports ? <Skeleton className="h-96 w-full" /> : <ReportsTable reports={filteredReports} />}
                </div>
              </ScrollArea>
            </TabsContent>
            
            <TabsContent value="ai_report">
              <ScrollArea className="h-[calc(100vh-220px)]">
                <div className="pr-4">
                 {isLoadingReports ? <Skeleton className="h-64 w-full" /> : <DailyReportSection reports={allReports} /> }
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="settings">
              <ScrollArea className="h-[calc(100vh-220px)]">
                <div className="pr-4">
                  <AdminSettingsSection onDataChange={fetchReports} />
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </main>
    </div>
  );
}
