
"use client";
import { useState, type FormEvent, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { MapPin, FilePlus, ImagePlus, Loader2, LocateFixed } from 'lucide-react';
import type { Report } from '@/lib/types';
import { COMMON_DISEASES, ETHIOPIAN_REGIONS, GENDERS } from '@/lib/constants';
import { useToast } from '@/hooks/use-toast';

interface ReportFormProps {
  onReportSubmit: (report: Report) => void;
}

export function ReportForm({ onReportSubmit }: ReportFormProps) {
  const [symptoms, setSymptoms] = useState('');
  const [suspectedDisease, setSuspectedDisease] = useState('');
  const [patientName, setPatientName] = useState('');
  const [patientAge, setPatientAge] = useState<number | ''>('');
  const [patientGender, setPatientGender] = useState('');
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [region, setRegion] = useState('');
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

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
        (error) => {
          console.error("Error getting location: ", error);
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
    if (!symptoms || !suspectedDisease || (!location && !region)) {
        toast({
            title: "Missing Information",
            description: "Please fill in symptoms, suspected disease, and either get GPS location or select a region.",
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
      patientName: patientName || undefined,
      patientAge: patientAge ? Number(patientAge) : undefined,
      patientGender: patientGender as Report['patientGender'] || undefined,
      location,
      region: region || undefined,
    };
    
    // Simulate submission delay
    setTimeout(() => {
      onReportSubmit(newReport);
      toast({ title: "Report Submitted", description: "The new case report has been saved locally." });
      // Reset form
      setSymptoms('');
      setSuspectedDisease('');
      setPatientName('');
      setPatientAge('');
      setPatientGender('');
      setLocation(null);
      setRegion('');
      setIsSubmitting(false);
    }, 500);
  };

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl">
          <FilePlus /> New Outbreak Report
        </CardTitle>
        <CardDescription>Enter details of the suspected case. Fields marked with * are required.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="symptoms">Symptoms *</Label>
            <Textarea
              id="symptoms"
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              placeholder="e.g., fever, cough, rash..."
              required
              rows={3}
            />
          </div>
          <div>
            <Label htmlFor="suspectedDisease">Suspected Disease *</Label>
            <Select value={suspectedDisease} onValueChange={setSuspectedDisease}>
              <SelectTrigger id="suspectedDisease">
                <SelectValue placeholder="Select disease..." />
              </SelectTrigger>
              <SelectContent>
                {COMMON_DISEASES.map((disease) => (
                  <SelectItem key={disease} value={disease}>{disease}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
                <Label htmlFor="location">GPS Location * (or select region)</Label>
                <Button type="button" variant="outline" onClick={handleGetLocation} className="w-full" disabled={isFetchingLocation}>
                {isFetchingLocation ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <LocateFixed className="mr-2 h-4 w-4" />}
                Get Current Location
                </Button>
                {location && (
                <p className="text-xs text-muted-foreground mt-1">
                    Lat: {location.latitude.toFixed(4)}, Lon: {location.longitude.toFixed(4)}
                </p>
                )}
            </div>
            <div>
                <Label htmlFor="region">Region * (if no GPS)</Label>
                <Select value={region} onValueChange={setRegion}>
                <SelectTrigger id="region">
                    <SelectValue placeholder="Select region..." />
                </SelectTrigger>
                <SelectContent>
                    {ETHIOPIAN_REGIONS.map((r) => (
                    <SelectItem key={r} value={r}>{r}</SelectItem>
                    ))}
                </SelectContent>
                </Select>
            </div>
          </div>
          
          <CardDescription>Optional Patient Information:</CardDescription>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="patientName">Patient Name</Label>
              <Input id="patientName" value={patientName} onChange={(e) => setPatientName(e.target.value)} placeholder="Full name" />
            </div>
            <div>
              <Label htmlFor="patientAge">Patient Age</Label>
              <Input id="patientAge" type="number" value={patientAge} onChange={(e) => setPatientAge(Number(e.target.value))} placeholder="Years" />
            </div>
          </div>
          
          <div>
            <Label htmlFor="patientGender">Patient Gender</Label>
            <Select value={patientGender} onValueChange={setPatientGender}>
              <SelectTrigger id="patientGender">
                <SelectValue placeholder="Select gender..." />
              </SelectTrigger>
              <SelectContent>
                {GENDERS.map((g) => (
                  <SelectItem key={g.value} value={g.value}>{g.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="imageUpload">Upload Image (Optional)</Label>
            <div className="flex items-center space-x-2 p-2 border rounded-md hover:bg-muted/50 cursor-pointer">
                <ImagePlus className="text-muted-foreground" />
                <Input id="imageUpload" type="file" className="border-none p-0 h-auto file:mr-2 file:py-1 file:px-2 file:rounded-full file:border-0 file:text-xs file:bg-muted file:text-muted-foreground hover:file:bg-primary/20" />
            </div>
            <p className="text-xs text-muted-foreground mt-1">Image upload is simulated and not functional.</p>
          </div>
          
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FilePlus className="mr-2 h-4 w-4" />}
            Submit Report
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
