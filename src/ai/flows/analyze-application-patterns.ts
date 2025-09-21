'use server';

/**
 * @fileOverview Analyzes job application patterns and outcomes to provide personalized strategic advice.
 *
 * - analyzeApplicationPatterns - A function that analyzes application data and provides advice.
 * - AnalyzeApplicationPatternsInput - The input type for the analyzeApplicationPatterns function.
 * - AnalyzeApplicationPatternsOutput - The return type for the analyzeApplicationPatterns function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeApplicationPatternsInputSchema = z.object({
  applicationData: z.string().describe('A JSON string containing the job application data, including application dates, job descriptions, resume used, cover letter used and outcomes (e.g., interview, rejection).'),
  studentProfile: z.string().describe('A JSON string containing the student profile data, including skills, experience, and career goals.'),
});
export type AnalyzeApplicationPatternsInput = z.infer<
  typeof AnalyzeApplicationPatternsInputSchema
>;

const AnalyzeApplicationPatternsOutputSchema = z.object({
  strategicAdvice: z.string().describe('Personalized strategic advice for optimizing the job search strategy based on the application data and student profile.'),
});
export type AnalyzeApplicationPatternsOutput = z.infer<
  typeof AnalyzeApplicationPatternsOutputSchema
>;

export async function analyzeApplicationPatterns(
  input: AnalyzeApplicationPatternsInput
): Promise<AnalyzeApplicationPatternsOutput> {
  return analyzeApplicationPatternsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeApplicationPatternsPrompt',
  input: {
    schema: AnalyzeApplicationPatternsInputSchema,
  },
  output: {
    schema: AnalyzeApplicationPatternsOutputSchema,
  },
  prompt: `You are a career advisor analyzing job application data to provide personalized strategic advice to students.

  Analyze the following application data and student profile to identify patterns and suggest improvements to their job search strategy. Provide specific and actionable advice.

  Application Data: {{{applicationData}}}
  Student Profile: {{{studentProfile}}}
  `,
});

const analyzeApplicationPatternsFlow = ai.defineFlow(
  {
    name: 'analyzeApplicationPatternsFlow',
    inputSchema: AnalyzeApplicationPatternsInputSchema,
    outputSchema: AnalyzeApplicationPatternsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
