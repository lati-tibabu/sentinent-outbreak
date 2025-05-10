"use client";
import { useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { FilePlus, Loader2, LocateFixed, ShieldAlert } from 'lucide-react';
import type { Report } from '@/lib/types';
import { COMMON_DISEASES, ETHIOPIAN_REGIONS } from '@/lib/constants';
import { useToast } from '@/hooks/use-toast';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { addStoredReport } from '@/lib/localStorageHelper'; // Using specific helper

export function AnonymousReportForm() {
  const [symptoms, setSymptoms] = useState('');
  const [suspectedDisease, setSuspectedDisease] = useState('');
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [region, setRegion] = useState('');
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  // We don't need to read all reports, just add one.
  // So, directly use addStoredReport which handles localStorage.
  // const [_, setReports] = useLocalStorage<Report[]>('outbreak_sentinel_reports', []);


  const handleGetLocation = () => {
    if (navigator.geolocation) {
      setIsFetchingLocation(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          setIsFetchingLocation(false);
          toast({ title: "Location Acquired", description: `Lat: ${position.coords.latitude.toFixed(4)}, Lon: ${position.coords.longitude.toFixed(4)}` });
        },
        (error: GeolocationPositionError) => {
          console.error("Error getting location: ", error.message, " (Code: ", error.code, ")");
          toast({ title: "Location Error", description: "Could not get GPS location. Please select region manually.", variant: "destructive" });
          setIsFetchingLocation(false);
        }
      );
    } else {
      toast({ title: "Location Error", description: "Geolocation is not supported by this browser.", variant: "destructive" });
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    if (!symptoms || !suspectedDisease || !region) { // Region is mandatory for anonymous
        toast({
            title: "Missing Information",
            description: "Please fill in symptoms, suspected disease, and select a region.",
            variant: "destructive",
        });
        setIsSubmitting(false);
        return;
    }

    const newReport: Report = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      symptoms,
      suspectedDisease,
      location, // Can be null if not fetched
      region: region,
      isAnonymous: true,
    };
    
    setTimeout(() => {
      addStoredReport(newReport); // Directly use the helper to add and store
      toast({ 
        title: "Anonymous Report Submitted", 
        description: "Your report has been submitted anonymously and saved. Thank you for contributing to community health." 
      });
      // Reset form
      setSymptoms('');
      setSuspectedDisease('');
      setLocation(null);
      setRegion('');
      setIsSubmitting(false);
    }, 500);
  };

  return (
    <Card className="w-full max-w-lg mx-auto shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl">
          <ShieldAlert /> Anonymous Community Report
        </CardTitle>
        <CardDescription>Report suspected outbreaks in your community. Your identity will remain anonymous. Fields marked with * are required.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="symptoms">Symptoms Observed *</Label>
            <Textarea
              id="symptoms"
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              placeholder="Describe the symptoms, e.g., widespread fever and cough in several households..."
              required
              rows={4}
            />
          </div>
          <div>
            <Label htmlFor="suspectedDisease">Suspected Disease *</Label>
            <Select value={suspectedDisease} onValueChange={setSuspectedDisease} required>
              <SelectTrigger id="suspectedDisease">
                <SelectValue placeholder="Select suspected disease..." />
              </SelectTrigger>
              <SelectContent>
                {COMMON_DISEASES.map((disease) => (
                  <SelectItem key={disease} value={disease}>{disease}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="region">Region *</Label>
            <Select value={region} onValueChange={setRegion} required>
            <SelectTrigger id="region">
                <SelectValue placeholder="Select region where symptoms are observed..." />
            </SelectTrigger>
            <SelectContent>
                {ETHIOPIAN_REGIONS.map((r) => (
                <SelectItem key={r} value={r}>{r}</SelectItem>
                ))}
            </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="location">GPS Location (Optional, more precise)</Label>
            <Button type="button" variant="outline" onClick={handleGetLocation} className="w-full flex items-center gap-2" disabled={isFetchingLocation}>
            {isFetchingLocation ? <Loader2 className="animate-spin" /> : <LocateFixed />}
            Try to Get Current Location
            </Button>
            {location && (
            <p className="text-xs text-muted-foreground mt-1">
                Acquired: Lat: {location.latitude.toFixed(4)}, Lon: {location.longitude.toFixed(4)}
            </p>
            )}
             <p className="text-xs text-muted-foreground mt-1">If you allow, your precise location can help health officials respond faster. This is optional.</p>
          </div>
          
          <Button type="submit" className="w-full text-lg py-3" disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <FilePlus className="mr-2 h-5 w-5" />}
            Submit Anonymous Report
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
