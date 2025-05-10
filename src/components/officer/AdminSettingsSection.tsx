
"use client";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DatabaseZap, Trash2, Settings } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { Report } from '@/lib/types';
import { clearStoredReports, loadSampleReports } from '@/lib/localStorageHelper';

interface AdminSettingsSectionProps {
  setReports: (reports: Report[] | ((prevReports: Report[]) => Report[])) => void;
}

export function AdminSettingsSection({ setReports }: AdminSettingsSectionProps) {
  const { toast } = useToast();

  const handleClearReports = () => {
    if (window.confirm("Are you sure you want to delete all locally stored reports? This action cannot be undone.")) {
      clearStoredReports();
      setReports([]);
      toast({ title: "Data Cleared", description: "All local reports have been deleted." });
    }
  };

  const handleLoadSampleData = () => {
    const sampleData = loadSampleReports();
    setReports(sampleData);
    toast({ title: "Sample Data Loaded", description: "Sample outbreak reports have been loaded." });
  };

  return (
    <Card className="mt-6 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <Settings /> System Configuration (Local Data)
        </CardTitle>
        <CardDescription>Manage locally stored report data for demonstration purposes.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
        <Button onClick={handleLoadSampleData} variant="outline" className="w-full sm:w-auto">
          <DatabaseZap className="mr-2 h-4 w-4" /> Load Sample Reports
        </Button>
        <Button onClick={handleClearReports} variant="destructive" className="w-full sm:w-auto">
          <Trash2 className="mr-2 h-4 w-4" /> Clear All Local Reports
        </Button>
        </div>
        <p className="text-xs text-muted-foreground">
            These actions only affect data stored in your browser for this simulation.
        </p>
      </CardContent>
    </Card>
  );
}
