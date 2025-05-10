'use server';
/**
 * @fileOverview Generates a concise daily summary report of recent outbreak data for Woreda Health Officers.
 *
 * - generateDailyReport - A function that generates the daily report.
 * - GenerateDailyReportInput - The input type for the generateDailyReport function.
 * - GenerateDailyReportOutput - The return type for the generateDailyReport function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateDailyReportInputSchema = z.object({
  recentData: z.string().describe('JSON string of recent outbreak data.'),
});
export type GenerateDailyReportInput = z.infer<typeof GenerateDailyReportInputSchema>;

const GenerateDailyReportOutputSchema = z.object({
  summary: z.string().describe('A concise, human-readable summary of the recent outbreak data.'),
});
export type GenerateDailyReportOutput = z.infer<typeof GenerateDailyReportOutputSchema>;

export async function generateDailyReport(input: GenerateDailyReportInput): Promise<GenerateDailyReportOutput> {
  return generateDailyReportFlow(input);
}

const prompt = ai.definePrompt({
  name: 'dailyReportPrompt',
  input: {schema: GenerateDailyReportInputSchema},
  output: {schema: GenerateDailyReportOutputSchema},
  prompt: `You are an AI assistant tasked with generating a concise daily summary report of recent outbreak data for Woreda Health Officers in Ethiopia. The report should be formatted for easy readability on a small screen. Use a deep teal color (#008080) for a sense of trust and health, light green (#90EE90) for well-being, and muted red (#CD5C5C) to highlight critical alerts and warnings. The recent outbreak data is provided in JSON format:

  {{{recentData}}}

  Focus on key trends, affected regions, disease types, and any urgent alerts. Provide actionable insights in a brief and easily understandable manner. The summary must be brief, due to screen size constraints.
  DO NOT include the raw JSON data in the summary.
  Format the output as a short paragraph with a maximum of 5 sentences.
`,
});

const generateDailyReportFlow = ai.defineFlow(
  {
    name: 'generateDailyReportFlow',
    inputSchema: GenerateDailyReportInputSchema,
    outputSchema: GenerateDailyReportOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
