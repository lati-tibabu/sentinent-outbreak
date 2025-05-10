
"use client";
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Map } from 'lucide-react';
import type { Report } from '@/lib/types';

interface SimulatedMapProps {
  reports: Report[]; // Reports to potentially display or count
  filters: any; // Current filters, to show context
}

export function SimulatedMap({ reports, filters }: SimulatedMapProps) {
  const filteredReportCount = reports.length; // In a real map, this would be based on map bounds + filters

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <Map /> Simulated Outbreak Map
        </CardTitle>
        <CardDescription>
          This is a placeholder for an interactive map. Currently showing {filteredReportCount} reports based on filters.
          Regions with active reports: {
            // Create a unique list of regions from the reports
            Array.from(new Set(reports.map(r => r.region).filter(Boolean))).join(', ') || 'N/A'
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="aspect-video bg-muted rounded-md flex items-center justify-center relative overflow-hidden border border-dashed">
          <Image 
            src="https://picsum.photos/seed/ethiopiamap/800/450" 
            alt="Simulated map of Ethiopia with outbreak data points"
            layout="fill"
            objectFit="cover"
            data-ai-hint="map ethiopia"
          />
          <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
            <p className="text-foreground/80 bg-background/70 p-2 rounded text-center">
              Interactive Map Placeholder
              <br />
              <span className="text-xs">(Data visualization of reports would appear here)</span>
            </p>
          </div>
        </div>
        {/* You could add a small summary list here if needed */}
      </CardContent>
    </Card>
  );
}
