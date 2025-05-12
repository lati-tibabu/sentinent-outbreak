
"use client";
import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import type { Report } from '@/lib/types';
import { regionCoordinates } from '@/lib/regionCoordinates';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

// Fix for default Leaflet icon issue (paths not resolving correctly with Webpack/Next.js)
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
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
}

const diseaseColorMap: { [key: string]: string } = {
  "Cholera": "text-red-500", 
  "Malaria": "text-teal-500",    
  "Measles": "text-orange-500",     
  "Pneumonia": "text-yellow-500", 
  "Typhoid Fever": "text-purple-500", 
  "Default": "text-green-500",  
};

const getDiseaseColorClass = (disease: string) => {
  return diseaseColorMap[disease] || diseaseColorMap["Default"];
}

// Helper component to adjust map view dynamically based on points
function MapEffectController({ points }: { points: MappedPoint[] }) {
  const map = useMap();

  useEffect(() => {
    if (points.length > 0) {
      const latLngs = points.map(p => L.latLng(p.latitude, p.longitude));
      const bounds = L.latLngBounds(latLngs);
      if (bounds.isValid()) {
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 12 });
      }
    } else {
      // Default view for Ethiopia if no points or if bounds are not valid
      map.setView([9.145, 40.4897], 6); // Centered on Ethiopia
    }
  }, [points, map]);

  return null;
}


export function OutbreakMap({ reports }: OutbreakMapProps) {
  const mappedPoints: MappedPoint[] = reports.reduce((acc: MappedPoint[], report) => {
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
      });
    }
    return acc;
  }, []);

  const uniqueDiseasesInMap = Array.from(new Set(mappedPoints.map(p => p.disease)));
  const reportsWithAnyLocation = reports.filter(r => r.location || r.region).length;

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
          {typeof window !== 'undefined' && ( // Ensure Leaflet only runs on the client
            <MapContainer center={[9.145, 40.4897]} zoom={6} style={{ height: '100%', width: '100%' }} className="rounded-md">
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <MapEffectController points={mappedPoints} />
              {mappedPoints.map(point => (
                <Marker key={point.id} position={[point.latitude, point.longitude]}>
                  <Popup minWidth={200}>
                    <div className="space-y-1">
                      <h4 className={`font-bold text-md ${getDiseaseColorClass(point.disease)}`}>{point.disease}</h4>
                      <p className="text-xs text-muted-foreground">
                        {new Date(point.timestamp).toLocaleDateString()}
                      </p>
                      {point.region && <p className="text-sm">Region: {point.region}</p>}
                      <p className="text-sm">Symptoms: <span className="font-normal">{point.symptoms}</span></p>
                      {point.isApproximate && (
                        <p className="text-xs text-orange-600 italic">Location is an approximation for the region.</p>
                      )}
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          )}
        </div>
        {mappedPoints.length === 0 && reportsWithAnyLocation > 0 && (
             <div className="mt-2 p-3 text-center text-sm bg-yellow-100 border border-yellow-300 text-yellow-700 rounded-md flex items-center justify-center gap-2">
              <AlertTriangle size={18} />
              Some reports have location/region data, but could not be placed on the map (e.g., outside expected bounds or region not in lookup).
            </div>
        )}
        {uniqueDiseasesInMap.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-semibold mb-2">Legend (Diseases on map):</h4>
            <div className="flex flex-wrap gap-2">
              {uniqueDiseasesInMap.map(disease => (
                <Badge key={disease} variant="outline" className={`border-transparent ${getDiseaseColorClass(disease)} bg-opacity-10`}>
                   <span className={`mr-1.5 h-2 w-2 rounded-full inline-block ${getDiseaseColorClass(disease).replace('text-','bg-')}`}></span>
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
