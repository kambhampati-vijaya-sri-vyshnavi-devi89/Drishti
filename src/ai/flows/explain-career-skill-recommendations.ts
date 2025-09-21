'use server';
/**
 * @fileOverview Explains why a particular career or skill was recommended based on a student's profile.
 *
 * - explainCareerSkillRecommendation - A function that explains the recommendation.
 * - ExplainCareerSkillRecommendationInput - The input type for the explainCareerSkillRecommendation function.
 * - ExplainCareerSkillRecommendationOutput - The return type for the explainCareerSkillRecommendation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExplainCareerSkillRecommendationInputSchema = z.object({
  profile: z
    .string()
    .describe("A description of the student's profile, including interests, academic background, personality traits, and goals."),
  recommendation: z.string().describe('The career or skill recommendation to explain.'),
});
export type ExplainCareerSkillRecommendationInput = z.infer<
  typeof ExplainCareerSkillRecommendationInputSchema
>;

const ExplainCareerSkillRecommendationOutputSchema = z.object({
  explanation: z.string().describe('The explanation for the career or skill recommendation.'),
});
export type ExplainCareerSkillRecommendationOutput = z.infer<
  typeof ExplainCareerSkillRecommendationOutputSchema
>;

export async function explainCareerSkillRecommendation(
  input: ExplainCareerSkillRecommendationInput
): Promise<ExplainCareerSkillRecommendationOutput> {
  return explainCareerSkillRecommendationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'explainCareerSkillRecommendationPrompt',
  input: {schema: ExplainCareerSkillRecommendationInputSchema},
  output: {schema: ExplainCareerSkillRecommendationOutputSchema},
  prompt: `You are an AI career counselor. A student has received the following career or skill recommendation: {{{recommendation}}}.\n\nBased on the student's profile: {{{profile}}}, explain why this recommendation was made. Provide a detailed explanation, highlighting the connections between the student's profile and the recommended career or skill. The explanation should be easy to understand and should help the student make informed decisions about their career path.`,
});

const explainCareerSkillRecommendationFlow = ai.defineFlow(
  {
    name: 'explainCareerSkillRecommendationFlow',
    inputSchema: ExplainCareerSkillRecommendationInputSchema,
    outputSchema: ExplainCareerSkillRecommendationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
