"use client";
import type { Report } from '@/lib/types';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FileText, User, Users } from 'lucide-react';

interface ReportsTableProps {
  reports: Report[];
}

export function ReportsTable({ reports }: ReportsTableProps) {
  if (reports.length === 0) {
    return (
      <div className="mt-6 p-6 bg-card border rounded-lg shadow text-center">
        <FileText size={48} className="mx-auto text-muted-foreground mb-4" />
        <h3 className="text-xl font-semibold text-muted-foreground">No Reports Found</h3>
        <p className="text-muted-foreground">There are no reports matching the current criteria, or no reports have been submitted yet.</p>
      </div>
    );
  }

  return (
    <div className="mt-6 bg-card border rounded-lg shadow">
      <ScrollArea className="h-[400px] lg:h-[500px]"> {/* Adjust height as needed */}
        <Table>
          <TableCaption>A list of recent outbreak reports.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[120px]">Date</TableHead>
              <TableHead className="w-[100px]">Type</TableHead>
              <TableHead>Disease</TableHead>
              <TableHead>Region</TableHead>
              <TableHead>Symptoms</TableHead>
              <TableHead className="hidden md:table-cell">Patient</TableHead>
              <TableHead className="hidden lg:table-cell">Location (GPS)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reports.slice().sort((a,b) => b.timestamp - a.timestamp).map((report) => ( // Sort by newest first
              <TableRow key={report.id}>
                <TableCell>{new Date(report.timestamp).toLocaleDateString()}</TableCell>
                <TableCell>
                  {report.isAnonymous ? (
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Users size={14} /> Anonymous
                    </Badge>
                  ) : (
                    <Badge variant="default" className="flex items-center gap-1">
                      <User size={14} /> HEW
                    </Badge>
                  )}
                </TableCell>
                <TableCell><Badge variant={report.suspectedDisease === "Cholera" || report.suspectedDisease === "Measles" ? "destructive" : "secondary"}>{report.suspectedDisease}</Badge></TableCell>
                <TableCell>{report.region || 'N/A'}</TableCell>
                <TableCell className="max-w-[200px] truncate" title={report.symptoms}>{report.symptoms}</TableCell>
                <TableCell className="hidden md:table-cell">
                  {report.isAnonymous ? 'N/A' : 
                    (report.patientName || 'N/A') + 
                    (report.patientAge ? ` (${report.patientAge}y, ${report.patientGender?.charAt(0).toUpperCase() || 'N/A'})` : '')
                  }
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  {report.location ? `${report.location.latitude.toFixed(3)}, ${report.location.longitude.toFixed(3)}` : 'N/A'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
    </div>
  );
}
