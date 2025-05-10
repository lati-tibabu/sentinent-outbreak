
"use client";
import type { Report } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { List, MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

interface LocalReportsListProps {
  reports: Report[];
}

export function LocalReportsList({ reports }: LocalReportsListProps) {
  if (reports.length === 0) {
    return (
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl"><List /> Locally Saved Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No reports saved locally yet. Submitted reports will appear here.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mt-6 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl"><List /> Locally Saved Reports</CardTitle>
        <CardDescription>These reports are stored on your device and will sync when connectivity is restored (simulated).</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px] pr-4">
          <div className="space-y-3">
            {reports.slice().reverse().map((report) => ( // Show newest first
              <div key={report.id} className="p-3 border rounded-lg bg-card hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold text-primary">{report.suspectedDisease}</h3>
                  <Badge variant="secondary">{new Date(report.timestamp).toLocaleDateString()}</Badge>
                </div>
                <p className="text-sm text-muted-foreground truncate mt-1" title={report.symptoms}>Symptoms: {report.symptoms}</p>
                {report.patientName && <p className="text-sm">Patient: {report.patientName} {report.patientAge ? `(${report.patientAge} yrs, ${report.patientGender})` : ''}</p>}
                <div className="text-xs mt-1 flex items-center gap-1">
                  <MapPin size={14} className="text-muted-foreground" />
                  {report.location ? `GPS: ${report.location.latitude.toFixed(2)}, ${report.location.longitude.toFixed(2)}` : report.region || 'Location not specified'}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
