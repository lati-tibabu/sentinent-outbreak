
"use client";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DatabaseZap, Trash2, Settings, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getSampleReportsArray } from '@/lib/localStorageHelper';
import { CreateUserForm } from '@/components/admin/CreateUserForm'; // Import CreateUserForm
import { useState } from 'react';

interface AdminSettingsSectionProps {
  onDataChange: () => void; 
}

export function AdminSettingsSection({ onDataChange }: AdminSettingsSectionProps) {
  const { toast } = useToast();
  const [isClearing, setIsClearing] = useState(false);
  const [isLoadingSamples, setIsLoadingSamples] = useState(false);

  const handleClearReports = async () => {
    if (window.confirm("Are you sure you want to delete ALL reports from the database? This action cannot be undone.")) {
      setIsClearing(true);
      try {
        const response = await fetch('/api/reports', { method: 'DELETE' });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to clear reports");
        }
        toast({ title: "Data Cleared", description: "All reports have been deleted from the database." });
        onDataChange(); 
      } catch (error: any) {
        console.error("Error clearing reports:", error);
        toast({ variant: "destructive", title: "Clear Failed", description: error.message });
      } finally {
        setIsClearing(false);
      }
    }
  };

  const handleLoadSampleData = async () => {
    setIsLoadingSamples(true);
    const sampleData = getSampleReportsArray(); 
    try {
      for (const report of sampleData) {
        const { id, ...reportPayload } = report;
        const response = await fetch('/api/reports', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(reportPayload),
        });
        if (!response.ok) {
          console.error(`Failed to load sample report: ${report.suspectedDisease}`);
        }
      }
      toast({ title: "Sample Data Loaded", description: "Sample outbreak reports have been loaded into the database." });
      onDataChange(); 
    } catch (error: any) {
      console.error("Error loading sample data:", error);
      toast({ variant: "destructive", title: "Sample Load Failed", description: error.message });
    } finally {
      setIsLoadingSamples(false);
    }
  };

  return (
    <>
      <Card className="mt-6 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Settings /> Report Data Management
          </CardTitle>
          <CardDescription>Manage report data in the database for demonstration purposes.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
          <Button onClick={handleLoadSampleData} variant="outline" className="w-full sm:w-auto" disabled={isLoadingSamples || isClearing}>
            {isLoadingSamples ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <DatabaseZap className="mr-2 h-4 w-4" />}
             Load Sample Reports
          </Button>
          <Button onClick={handleClearReports} variant="destructive" className="w-full sm:w-auto" disabled={isClearing || isLoadingSamples}>
            {isClearing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
             Clear All Reports
          </Button>
          </div>
          <p className="text-xs text-muted-foreground">
              These actions affect data stored in the MongoDB database.
          </p>
        </CardContent>
      </Card>

      <CreateUserForm /> 
    </>
  );
}
