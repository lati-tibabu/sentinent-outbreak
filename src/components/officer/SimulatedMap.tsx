"use client";
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Map, AlertTriangle, Dot } from 'lucide-react';
import type { Report } from '@/lib/types';
import { Badge } from '@/components/ui/badge';

interface SimulatedMapProps {
  reports: Report[];
  filters: any; 
}

// Approximate Ethiopian Lat/Lon bounds for mapping to image
const MIN_LAT = 3.0;
const MAX_LAT = 15.0;
const MIN_LON = 33.0;
const MAX_LON = 48.0;

// Image dimensions (should match the placeholder image aspect ratio if possible)
const IMAGE_WIDTH = 800;
const IMAGE_HEIGHT = 450;

interface MappedPoint {
  x: number;
  y: number;
  disease: string;
  id: string;
  region?: string;
}

const diseaseColorMap: { [key: string]: string } = {
  "Cholera": "bg-destructive", // Red
  "Malaria": "bg-primary",    // Teal
  "Measles": "bg-accent",     // Muted Red/Orange
  "Pneumonia": "bg-yellow-500", // Yellow
  "Typhoid Fever": "bg-purple-500", // Purple
  "Default": "bg-secondary",   // Light Green
};

const getDiseaseColor = (disease: string) => {
  return diseaseColorMap[disease] || diseaseColorMap["Default"];
}

export function SimulatedMap({ reports, filters }: SimulatedMapProps) {
  
  const reportsWithLocation = reports.filter(report => report.location && report.location.latitude && report.location.longitude);

  const mappedPoints: MappedPoint[] = reportsWithLocation.map(report => {
    const { latitude, longitude } = report.location!;
    
    // Normalize coordinates (0 to 1)
    const normalizedLon = (longitude - MIN_LON) / (MAX_LON - MIN_LON);
    const normalizedLat = (latitude - MIN_LAT) / (MAX_LAT - MIN_LAT);

    // Scale to image dimensions
    let x = normalizedLon * IMAGE_WIDTH;
    // Invert Y-axis because image Y is from top, latitude is from bottom
    let y = IMAGE_HEIGHT - (normalizedLat * IMAGE_HEIGHT);

    // Clamp coordinates to be within image boundaries
    x = Math.max(0, Math.min(IMAGE_WIDTH - 8, x - 4)); // -4 to center dot
    y = Math.max(0, Math.min(IMAGE_HEIGHT - 8, y - 4)); // -4 to center dot


    return {
      x,
      y,
      disease: report.suspectedDisease,
      id: report.id,
      region: report.region
    };
  }).filter(point => point.x >= 0 && point.x <= IMAGE_WIDTH && point.y >= 0 && point.y <= IMAGE_HEIGHT);


  const activeRegions = Array.from(new Set(reportsWithLocation.map(r => r.region).filter(Boolean)));
  const uniqueDiseasesInMap = Array.from(new Set(mappedPoints.map(p => p.disease)));

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <Map /> Simulated Outbreak Map
        </CardTitle>
        <CardDescription>
          Visual representation of reported cases with GPS locations. Showing {mappedPoints.length} reports on map out of {reports.length} total based on current filters.
          {activeRegions.length > 0 && (
            <>
              <br/>Active regions with geolocated reports: {activeRegions.join(', ') || 'N/A'}.
            </>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="aspect-video bg-muted rounded-md flex items-center justify-center relative overflow-hidden border">
          <Image 
            src="https://picsum.photos/seed/ethiopiamapdark/800/450" 
            alt="Simulated map of Ethiopia with outbreak data points"
            width={IMAGE_WIDTH}
            height={IMAGE_HEIGHT}
            className="object-cover"
            data-ai-hint="map ethiopia"
            priority
          />
          {mappedPoints.map(point => (
            <TooltipWrapper key={point.id} disease={point.disease} region={point.region}>
              <div
                title={`${point.disease} in ${point.region || 'region not specified'}`}
                className={`absolute w-3 h-3 rounded-full transform -translate-x-1/2 -translate-y-1/2 animate-pulse border-2 border-background shadow-md ${getDiseaseColor(point.disease)}`}
                style={{ left: `${(point.x / IMAGE_WIDTH) * 100}%`, top: `${(point.y / IMAGE_HEIGHT) * 100}%` }}
              >
                <span className="sr-only">{point.disease} case</span>
              </div>
            </TooltipWrapper>
          ))}
          {mappedPoints.length === 0 && reportsWithLocation.length > 0 && (
             <div className="absolute inset-0 bg-black/30 flex items-center justify-center p-4">
              <p className="text-background/90 bg-foreground/70 p-3 rounded text-center text-sm">
                <AlertTriangle className="inline-block mr-2" />
                Some reports have location data, but they might be outside the expected geographical bounds of Ethiopia for this simulation or data is still loading.
              </p>
            </div>
          )}
           {reportsWithLocation.length === 0 && (
             <div className="absolute inset-0 bg-black/30 flex items-center justify-center p-4">
              <p className="text-background/90 bg-foreground/70 p-3 rounded text-center text-sm">
                No reports with GPS coordinates available for the current filters.
              </p>
            </div>
          )}
        </div>
        {uniqueDiseasesInMap.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-semibold mb-2">Legend:</h4>
            <div className="flex flex-wrap gap-2">
              {uniqueDiseasesInMap.map(disease => (
                <Badge key={disease} variant="secondary" className="flex items-center gap-1.5 text-xs">
                  <span className={`w-2.5 h-2.5 rounded-full ${getDiseaseColor(disease)}`}></span>
                  {disease}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}


// Basic Tooltip for map points (ShadCN Tooltip can be more elaborate if needed)
// This simple div title is often enough for basic info on hover.
// For complex tooltips, consider integrating ShadCN's Tooltip component.
const TooltipWrapper = ({ children, disease, region }: { children: React.ReactNode, disease?: string, region?: string }) => {
  const title = `${disease || 'Case'} ${region ? `in ${region}` : ''}`;
  return (
    <div title={title}>
      {children}
    </div>
  );
};