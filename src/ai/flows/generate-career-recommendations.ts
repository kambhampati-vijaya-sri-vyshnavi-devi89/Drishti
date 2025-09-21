// src/ai/flows/generate-career-recommendations.ts
'use server';

/**
 * @fileOverview Generates personalized career path recommendations based on student assessment data.
 *
 * - generateCareerRecommendations - A function that generates career recommendations.
 * - GenerateCareerRecommendationsInput - The input type for the generateCareerRecommendations function.
 * - GenerateCareerRecommendationsOutput - The return type for the generateCareerRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateCareerRecommendationsInputSchema = z.object({
  interests: z.string().describe('The student\u2019s interests.'),
  academicBackground: z.string().describe('The student\u2019s academic background.'),
  personalityTraits: z.string().describe('The student\u2019s personality traits.'),
  goals: z.string().describe('The student\u2019s goals.'),
});
export type GenerateCareerRecommendationsInput = z.infer<
  typeof GenerateCareerRecommendationsInputSchema
>;

const GenerateCareerRecommendationsOutputSchema = z.object({
  careerPaths: z
    .array(z.string())
    .describe(
      'A list of personalized career paths, including traditional, emerging, and hybrid options.'
    ),
  explanation: z.string().describe('Explanation of why the career paths are recommended.'),
});

export type GenerateCareerRecommendationsOutput = z.infer<
  typeof GenerateCareerRecommendationsOutputSchema
>;

export async function generateCareerRecommendations(
  input: GenerateCareerRecommendationsInput
): Promise<GenerateCareerRecommendationsOutput> {
  return generateCareerRecommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateCareerRecommendationsPrompt',
  input: {
    schema: GenerateCareerRecommendationsInputSchema,
  },
  output: {
    schema: GenerateCareerRecommendationsOutputSchema,
  },
  prompt: `Based on the student's profile, suggest personalized career paths, including traditional, emerging, and hybrid options.

Student Profile:
Interests: {{{interests}}}
Academic Background: {{{academicBackground}}}
Personality Traits: {{{personalityTraits}}}
Goals: {{{goals}}}

Explain why these career paths are recommended. Return the career paths and explanation in JSON format.`,
});

const generateCareerRecommendationsFlow = ai.defineFlow(
  {
    name: 'generateCareerRecommendationsFlow',
    inputSchema: GenerateCareerRecommendationsInputSchema,
    outputSchema: GenerateCareerRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
