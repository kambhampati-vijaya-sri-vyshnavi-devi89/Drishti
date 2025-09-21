'use server';
/**
 * @fileOverview Maps a student's profile (interests, academic background, personality traits, and goals) to career paths.
 *
 * - mapProfileToCareerPaths - A function that handles the mapping of a student's profile to career paths.
 * - MapProfileToCareerPathsInput - The input type for the mapProfileToCareerPaths function.
 * - MapProfileToCareerPathsOutput - The return type for the mapProfileToCareerPaths function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const MapProfileToCareerPathsInputSchema = z.object({
  interests: z
    .string()
    .describe('The student\'s interests, such as technology, art, or science.'),
  academicBackground: z
    .string()
    .describe(
      'The student\'s academic background, including degrees, majors, and coursework.'
    ),
  personalityTraits: z
    .string()
    .describe(
      'The student\'s personality traits, such as introverted, extroverted, analytical, or creative.'
    ),
  goals: z
    .string()
    .describe('The student\'s goals, such as financial security or helping others.'),
});
export type MapProfileToCareerPathsInput = z.infer<
  typeof MapProfileToCareerPathsInputSchema
>;

const MapProfileToCareerPathsOutputSchema = z.object({
  careerPaths: z
    .array(z.string())
    .describe('A list of career paths that match the student\'s profile.'),
});
export type MapProfileToCareerPathsOutput = z.infer<
  typeof MapProfileToCareerPathsOutputSchema
>;

export async function mapProfileToCareerPaths(
  input: MapProfileToCareerPathsInput
): Promise<MapProfileToCareerPathsOutput> {
  return mapProfileToCareerPathsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'mapProfileToCareerPathsPrompt',
  input: {schema: MapProfileToCareerPathsInputSchema},
  output: {schema: MapProfileToCareerPathsOutputSchema},
  prompt: `You are an expert career counselor. Based on the student's profile, suggest a list of career paths that match their profile.

Student Profile:
Interests: {{{interests}}}
Academic Background: {{{academicBackground}}}
Personality Traits: {{{personalityTraits}}}
Goals: {{{goals}}}

Career Paths:`,
});

const mapProfileToCareerPathsFlow = ai.defineFlow(
  {
    name: 'mapProfileToCareerPathsFlow',
    inputSchema: MapProfileToCareerPathsInputSchema,
    outputSchema: MapProfileToCareerPathsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
