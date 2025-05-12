// components/officer/OutbreakMap.tsx
'use client';

import React, { useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import type { Report } from '@/lib/types';
import { regionCoordinates } from '@/lib/regionCoordinates';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { MapPin, AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

// Fix default icon path issues as per the user's example
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface OutbreakMapProps {
  reports: Report[];
}

interface MappedPoint {
  id: string;
  latitude: number;
  longitude: number;
  disease: string;
  region?: string;
  symptoms: string;
  timestamp: number;
  isApproximate: boolean;
  patientName?: string;
  patientAge?: number;
  patientGender?: string;
}

const diseaseColorMap: { [key: string]: string } = {
  Cholera: "text-red-500",
  Malaria: "text-teal-500",
  Measles: "text-orange-500",
  Pneumonia: "text-yellow-500",
  "Typhoid Fever": "text-purple-500",
  Default: "text-green-500",
};

const getDiseaseColorClass = (disease: string) => {
  return diseaseColorMap[disease] || diseaseColorMap["Default"];
};


function MapViewAdjuster({ points }: { points: MappedPoint[] }) {
  const map = useMap();
  useEffect(() => {
    if (points.length > 0) {
      const bounds = L.latLngBounds(points.map(p => [p.latitude, p.longitude]));
      if (bounds.isValid()) {
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 12 });
      } else if (points.length === 1) {
        map.setView([points[0].latitude, points[0].longitude], 10);
      }
    } else {
      map.setView([9.145, 40.4897], 6); // Default to Ethiopia
    }
  }, [points, map]);
  return null;
}

export function OutbreakMap({ reports }: OutbreakMapProps) {
  const mappedPoints = useMemo(() => {
    return reports.reduce((acc: MappedPoint[], report) => {
      if (report.location && typeof report.location.latitude === 'number' && typeof report.location.longitude === 'number') {
        acc.push({
          id: report.id,
          latitude: report.location.latitude,
          longitude: report.location.longitude,
          disease: report.suspectedDisease,
          region: report.region,
          symptoms: report.symptoms,
          timestamp: report.timestamp,
          isApproximate: false,
          patientName: report.patientName,
          patientAge: report.patientAge,
          patientGender: report.patientGender,
        });
      } else if (report.region && regionCoordinates[report.region]) {
        const coords = regionCoordinates[report.region];
        acc.push({
          id: report.id,
          latitude: coords.latitude,
          longitude: coords.longitude,
          disease: report.suspectedDisease,
          region: report.region,
          symptoms: report.symptoms,
          timestamp: report.timestamp,
          isApproximate: true,
          patientName: report.patientName,
          patientAge: report.patientAge,
          patientGender: report.patientGender,
        });
      }
      return acc;
    }, []);
  }, [reports]);

  const uniqueDiseasesInMap = useMemo(() =>
    Array.from(new Set(mappedPoints.map((p) => p.disease))),
    [mappedPoints]
  );

  const reportsWithAnyLocation = useMemo(() =>
    reports.filter((r) => r.location || (r.region && regionCoordinates[r.region!])).length,
    [reports]
  );


  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <MapPin /> Outbreak Map
        </CardTitle>
        <CardDescription>
          Geographical distribution of reported cases. Showing {mappedPoints.length} reports on map.
          {reportsWithAnyLocation === 0 && reports.length > 0 && " No reports have location data."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[450px] w-full bg-muted rounded-md border">
          <MapContainer center={[9.145, 40.4897]} zoom={6} style={{ height: '100%', width: '100%' }} className="rounded-md">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapViewAdjuster points={mappedPoints} />
            {mappedPoints.map((point) => (
              <Marker key={point.id} position={[point.latitude, point.longitude]}>
                <Popup minWidth={200}>
                  <div className="space-y-1">
                    <h4 className={`font-bold text-md ${getDiseaseColorClass(point.disease)}`}>
                      {point.disease}
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      Reported: {new Date(point.timestamp).toLocaleDateString()}
                    </p>
                    {point.region && <p className="text-sm">Region: {point.region}</p>}
                    <p className="text-sm">Symptoms: <span className="font-normal">{point.symptoms}</span></p>
                    {!point.isApproximate && point.patientName && (
                       <p className="text-sm">Patient: {point.patientName} 
                       {point.patientAge ? ` (${point.patientAge} yrs` : ''}
                       {point.patientGender ? `, ${point.patientGender})` : point.patientAge ? ')' : ''}
                       </p>
                    )}
                    {point.isApproximate && (
                      <p className="text-xs text-orange-600 italic">
                        Location is an approximation for the region.
                      </p>
                    )}
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
        {mappedPoints.length === 0 && reports.length > 0 && reportsWithAnyLocation === 0 && (
           <div className="mt-2 p-3 text-center text-sm bg-yellow-100 border border-yellow-300 text-yellow-700 rounded-md flex items-center justify-center gap-2">
            <AlertTriangle size={18} />
            No reports currently have location data to display on the map.
          </div>
        )}
        {uniqueDiseasesInMap.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-semibold mb-2">
              Legend (Diseases on map):
            </h4>
            <div className="flex flex-wrap gap-2">
              {uniqueDiseasesInMap.map((disease) => (
                <Badge
                  key={disease}
                  variant="outline"
                  className={`border-transparent ${getDiseaseColorClass(
                    disease
                  )} bg-opacity-10`}
                >
                  <span
                    className={`mr-1.5 h-2 w-2 rounded-full inline-block ${getDiseaseColorClass(
                      disease
                    ).replace("text-", "bg-")}`}
                  ></span>
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
