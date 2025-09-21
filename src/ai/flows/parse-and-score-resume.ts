'use server';
/**
 * @fileOverview An AI agent that parses a resume and provides a general quality score.
 *
 * - parseAndScoreResume - A function that handles the resume parsing and scoring process.
 * - ParseAndScoreResumeInput - The input type for the parseAndScoreResume function.
 * - ParseAndScoreResumeOutput - The return type for the parseAndScoreResume function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ParseAndScoreResumeInputSchema = z.object({
  resumeDataUri: z
    .string()
    .describe(
      "The resume, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type ParseAndScoreResumeInput = z.infer<typeof ParseAndScoreResumeInputSchema>;

const FeedbackItemSchema = z.object({
    score: z.number().min(0).max(100).describe('The score from 0-100 for this category.'),
    strengths: z.array(z.string()).describe('A list of specific strengths found in the resume for this category.'),
    suggestions: z.array(z.string()).describe('A list of specific, actionable suggestions for improvement for this category.'),
});

const ParseAndScoreResumeOutputSchema = z.object({
  overallScore: z.number().min(0).max(100).describe('An overall score for the resume quality, from 0 to 100.'),
  atsCompatibility: FeedbackItemSchema.describe('Feedback on the resume\'s ATS compatibility.'),
  impact: FeedbackItemSchema.describe('Feedback on the impact and use of action verbs.'),
  brevity: FeedbackItemSchema.describe('Feedback on the resume\'s brevity and conciseness.'),
});
export type ParseAndScoreResumeOutput = z.infer<typeof ParseAndScoreResumeOutputSchema>;

export async function parseAndScoreResume(input: ParseAndScoreResumeInput): Promise<ParseAndScoreResumeOutput> {
  return parseAndScoreResumeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'parseAndScoreResumePrompt',
  input: {schema: ParseAndScoreResumeInputSchema},
  output: {schema: ParseAndScoreResumeOutputSchema},
  prompt: `You are an AI resume expert and career counselor. Your task is to analyze a resume and provide a detailed, structured evaluation based on general best practices.

Analyze the resume and score it based on the following criteria. For each criterion, provide a score from 0 to 100, a list of strengths, and a list of actionable suggestions for improvement.

1.  **ATS Compatibility**: How well is the resume formatted to pass through an Applicant Tracking System? Check for standard fonts, clear headings, and parsable layout.
2.  **Impact & Action Verbs**: How well does the resume use strong action verbs and quantify achievements to demonstrate impact?
3.  **Brevity & Conciseness**: Is the resume concise and easy to read? Is it an appropriate length (ideally one page)?

Finally, provide an **overallScore** from 0 to 100 that represents the resume's general quality.

Resume: {{media url=resumeDataUri}}`,
});

const parseAndScoreResumeFlow = ai.defineFlow(
  {
    name: 'parseAndScoreResumeFlow',
    inputSchema: ParseAndScoreResumeInputSchema,
    outputSchema: ParseAndScoreResumeOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
