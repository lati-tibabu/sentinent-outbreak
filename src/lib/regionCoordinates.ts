
export interface RegionCoordinate {
  latitude: number;
  longitude: number;
  zoom: number; 
}

// Approximate coordinates for Ethiopian regions. These can be refined.
export const regionCoordinates: Record<string, RegionCoordinate> = {
  "Addis Ababa": { latitude: 9.02497, longitude: 38.74689, zoom: 10 },
  "Afar": { latitude: 11.8000, longitude: 41.0000, zoom: 7 },
  "Amhara": { latitude: 11.5986, longitude: 37.9603, zoom: 7 },
  "Benishangul-Gumuz": { latitude: 10.7675, longitude: 35.5830, zoom: 7 },
  "Dire Dawa": { latitude: 9.5931, longitude: 41.8661, zoom: 10 },
  "Gambela": { latitude: 8.2500, longitude: 34.5833, zoom: 8 },
  "Harari": { latitude: 9.3100, longitude: 42.1200, zoom: 10 },
  "Oromia": { latitude: 7.5460, longitude: 39.6319, zoom: 6 },
  "Sidama": { latitude: 6.8600, longitude: 38.3000, zoom: 8 },
  "Somali": { latitude: 6.5428, longitude: 44.0737, zoom: 6 },
  "South Ethiopia": { latitude: 6.0000, longitude: 37.0000, zoom: 7 },
  "South West Ethiopia Peoples'": { latitude: 7.0000, longitude: 36.0000, zoom: 7 },
  "Tigray": { latitude: 13.5000, longitude: 39.4999, zoom: 7 },
  "Central Ethiopia": { latitude: 7.8000, longitude: 38.5000, zoom: 7 },
};
