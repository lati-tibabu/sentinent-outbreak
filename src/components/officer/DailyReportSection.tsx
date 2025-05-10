
"use client";
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, Loader2, AlertTriangle } from 'lucide-react';
import { generateDailyReport } from '@/ai/flows/daily-report-generator';
import type { Report } from '@/lib/types';
import { ScrollArea } from '../ui/scroll-area';

interface DailyReportSectionProps {
  reports: Report[]; // All available reports, pre-filtering for "recent" can happen here or in AI prompt
}

export function DailyReportSection({ reports }: DailyReportSectionProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [aiReport, setAiReport] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateReport = async () => {
    setIsLoading(true);
    setAiReport(null);
    setError(null);

    // Potentially filter for "recent" reports if needed, or let the AI handle it based on full data.
    // For this demo, we'll send all reports.
    const recentData = JSON.stringify(reports);

    try {
      const result = await generateDailyReport({ recentData });
      setAiReport(result.summary);
    } catch (e) {
      console.error("Error generating AI report:", e);
      setError("Failed to generate AI summary. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="mt-6 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <Brain /> AI-Powered Daily Summary
        </CardTitle>
        <CardDescription>Generate a concise daily summary of recent outbreak data using AI.</CardDescription>
      </CardHeader>
      <CardContent>
        <Button onClick={handleGenerateReport} disabled={isLoading || reports.length === 0} className="mb-4">
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Brain className="mr-2 h-4 w-4" />}
          Generate Daily Report
        </Button>
        {reports.length === 0 && <p className="text-sm text-muted-foreground">No reports available to generate a summary.</p>}

        {error && (
          <div className="mt-4 p-3 bg-destructive/10 border border-destructive text-destructive rounded-md flex items-center gap-2">
            <AlertTriangle size={18} /> {error}
          </div>
        )}

        {aiReport && (
          <ScrollArea className="mt-4 p-4 bg-muted/50 border rounded-md h-auto max-h-[400px]">
            <h3 className="font-semibold mb-2 text-lg text-primary">Generated Summary:</h3>
            {/* The AI prompt aims for specific colors. Render HTML directly if AI produces it.
                Otherwise, simple pre-wrap for text.
                For safety, if using dangerouslySetInnerHTML, ensure output is sanitized or from a trusted source.
                Given the prompt uses color names, it might produce text that needs styling interpretation.
                Let's assume the AI generates text that can be directly displayed and the prompt's color instructions
                are for the AI's internal reasoning for emphasis, not literal HTML output.
            */}
            <div 
              className="prose prose-sm dark:prose-invert max-w-none" 
              dangerouslySetInnerHTML={{ __html: aiReport.replace(/\n/g, '<br />') }} // Basic formatting for newlines
            />
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
