
"use client";
import { useEffect, useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Header } from "@/components/shared/Header";
import { ReportForm } from "@/components/hew/ReportForm";
import { LocalReportsList } from "@/components/hew/LocalReportsList"; // Renaming might be considered if it fetches all reports
import { OutbreakAlertsDisplay } from "@/components/hew/OutbreakAlertsDisplay";
import { Button } from "@/components/ui/button";
import { RefreshCw, CloudOff, Loader2 } from "lucide-react";
import type { Report } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

export default function HEWPage() {
  const { user, isAuthenticated, isLoading: authIsLoading } = useAuth();
  const router = useRouter();
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoadingReports, setIsLoadingReports] = useState(true);
  const { toast } = useToast();

  const fetchReports = useCallback(async () => {
    setIsLoadingReports(true);
    try {
      const response = await fetch("/api/reports");
      if (!response.ok) {
        let errorMessage = `Failed to fetch reports: ${response.status} - ${response.statusText}`;
        try {
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            const errorData = await response.json();
            console.error("API Error Data (JSON):", errorData);
            errorMessage = errorData.message || errorData.error || errorMessage;
          } else {
            const errorText = await response.text();
            console.error("API Error Data (Non-JSON):", errorText);
            // Attempt to extract a meaningful message if it's HTML, otherwise use the raw text.
            const titleMatch = errorText.match(/<title>(.*?)<\/title>/i);
            if (titleMatch && titleMatch[1]) {
              errorMessage = titleMatch[1];
            } else if (errorText.length < 200) { // Arbitrary length to avoid huge HTML dumps
                errorMessage = errorText;
            }
          }
        } catch (parseError) {
          console.error("Error parsing error response:", parseError);
          // Fallback to the original status text if parsing fails
        }
        throw new Error(errorMessage);
      }
      const data = await response.json();
      setReports(data.reports || []);
    } catch (error: any) {
      console.error("Error fetching reports:", error);
      toast({
        variant: "destructive",
        title: "Error Fetching Reports",
        description: error.message || "Could not fetch reports. Please check console for details.",
      });
      setReports([]); // Set to empty on error
    } finally {
      setIsLoadingReports(false);
    }
  }, [toast]);

  useEffect(() => {
    if (!authIsLoading && !isAuthenticated) {
      router.push("/auth/login");
    } else if (!authIsLoading && isAuthenticated && user?.role !== "hew") {
      router.push(user?.role === "officer" ? "/officer" : "/auth/login");
    } else if (!authIsLoading && isAuthenticated && user?.role === "hew") {
      fetchReports(); // Fetch reports when HEW is authenticated
    }
  }, [user, isAuthenticated, authIsLoading, router, fetchReports]);

  const handleSimulateSync = () => {
    toast({
      title: "Data Refresh Triggered",
      description: "Fetching latest reports from the server.",
    });
    fetchReports();
  };


  if (authIsLoading || !isAuthenticated || user?.role !== "hew") {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow container mx-auto px-2 py-4 sm:px-4 md:max-w-2xl">
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
      <main className="flex-grow container mx-auto px-2 py-6 sm:px-4 md:max-w-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-primary">
            HEW Mobile Portal
          </h2>
          <Button
            onClick={handleSimulateSync}
            variant="outline"
            disabled={isLoadingReports}
          >
            {isLoadingReports ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="mr-2 h-4 w-4" />
            )}
            Refresh Reports
          </Button>
        </div>

        <OutbreakAlertsDisplay reports={reports} />
        <ReportForm />

        {isLoadingReports ? (
          <Skeleton className="h-48 w-full mt-6" />
        ) : (
          <LocalReportsList reports={reports} />
        )}

        <div className="mt-8 p-3 bg-muted text-muted-foreground rounded-lg text-sm flex items-center justify-center gap-2">
          <CloudOff size={18} />
          <span>Reports are submitted to the server when online.</span>
        </div>
      </main>
    </div>
  );
}
