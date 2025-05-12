"use client";
import { useEffect, useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Header } from "@/components/shared/Header";
import {
  ReportFilters,
  type ReportFiltersState,
} from "@/components/officer/ReportFilters";
import { ReportsTable } from "@/components/officer/ReportsTable";
import { DailyReportSection } from "@/components/officer/DailyReportSection";
import { AdminSettingsSection } from "@/components/officer/AdminSettingsSection";
import type { Report } from "@/lib/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import dynamic from "next/dynamic";
import { regionCoordinates } from "@/lib/regionCoordinates";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin } from "lucide-react";


// Dynamically import the OutbreakMap component as it uses Leaflet (client-side only)
const OutbreakMap = dynamic(
  () =>
    import("@/components/officer/OutbreakMap").then((mod) => mod.OutbreakMap),
  {
    ssr: false,
    loading: () => <Skeleton className="h-[450px] w-full" />,
  }
);

export default function OfficerPage() {
  const { user, isAuthenticated, isLoading: authIsLoading } = useAuth();
  const router = useRouter();
  const [allReports, setAllReports] = useState<Report[]>([]);
  const [isLoadingReports, setIsLoadingReports] = useState(true);
  const { toast } = useToast();

  const [filters, setFilters] = useState<ReportFiltersState>({
    region: "",
    disease: "",
    date: undefined,
  });

  const [mapVisible, setMapVisible] = useState(false);

  const fetchReports = useCallback(
    async (currentFilters?: ReportFiltersState) => {
      setIsLoadingReports(true);
      const activeFilters = currentFilters || filters;
      const queryParams = new URLSearchParams();
      if (activeFilters.region)
        queryParams.append("region", activeFilters.region);
      if (activeFilters.disease)
        queryParams.append("disease", activeFilters.disease);
      if (activeFilters.date)
        queryParams.append("date", activeFilters.date.toISOString());

      try {
        const response = await fetch(`/api/reports?${queryParams.toString()}`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to fetch reports");
        }
        const data = await response.json();
        setAllReports(data.reports || []);
      } catch (error: any) {
        console.error("Error fetching reports:", error);
        toast({
          variant: "destructive",
          title: "Error Fetching Reports",
          description: error.message,
        });
        setAllReports([]);
      } finally {
        setIsLoadingReports(false);
      }
    },
    [filters, toast]
  );

  useEffect(() => {
    if (!authIsLoading && !isAuthenticated) {
      router.push("/auth/login");
    } else if (!authIsLoading && isAuthenticated && user?.role !== "officer") {
      router.push(user?.role === "hew" ? "/hew" : "/auth/login");
    } else if (!authIsLoading && isAuthenticated && user?.role === "officer") {
      fetchReports();
    }
  }, [user, isAuthenticated, authIsLoading, router, fetchReports]);

  useEffect(() => {
    if (isAuthenticated && user?.role === "officer") {
      fetchReports(filters);
    }
  }, [filters, isAuthenticated, user, fetchReports]);

  const filteredReports = allReports; // Assuming filtering logic is correct or allReports is already filtered by API

  useEffect(() => {
    if (!isLoadingReports && filteredReports && filteredReports.length > 0) {
      const hasLocationData = filteredReports.some(r => r.location || (r.region && regionCoordinates[r.region!]));
      setMapVisible(hasLocationData);
    } else if (!isLoadingReports) {
      setMapVisible(false);
    }
  }, [isLoadingReports, filteredReports]);


  if (authIsLoading || !isAuthenticated || user?.role !== "officer") {
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
        <h2 className="text-3xl font-bold text-primary mb-6">
          Woreda Health Officer Dashboard
        </h2>

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
                {isLoadingReports ? (
                  <Skeleton className="h-[450px] w-full" />
                ) : mapVisible ? (
                  <OutbreakMap reports={filteredReports} />
                ) : (
                  <Card className="shadow-lg">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-xl"><MapPin /> Outbreak Map</CardTitle>
                        <CardDescription>Geographical distribution of reported cases.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[450px] w-full bg-muted rounded-md border flex items-center justify-center">
                            <p className="text-muted-foreground p-4 text-center">
                                {filteredReports && filteredReports.length > 0
                                    ? "No reports have location data to display on the map."
                                    : "No reports match the current filters, or no reports submitted yet."
                                }
                            </p>
                        </div>
                    </CardContent>
                  </Card>
                )}
                {isLoadingReports ? (
                  <Skeleton className="h-96 w-full" />
                ) : (
                  <ReportsTable reports={filteredReports} />
                )}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="ai_report">
            <ScrollArea className="h-[calc(100vh-220px)]">
              <div className="pr-4">
                {isLoadingReports ? (
                  <Skeleton className="h-64 w-full" />
                ) : (
                  <DailyReportSection reports={allReports} />
                )}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="settings">
            <ScrollArea className="h-[calc(100vh-220px)]">
              <div className="pr-4">
                <AdminSettingsSection onDataChange={() => fetchReports(filters)} />
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}