'use server';

/**
 * @fileOverview A learning strategy recommendation AI agent.
 *
 * - recommendLearningStrategies - A function that recommends learning strategies based on career path.
 * - RecommendLearningStrategiesInput - The input type for the recommendLearningStrategies function.
 * - RecommendLearningStrategiesOutput - The return type for the recommendLearningStrategies function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RecommendLearningStrategiesInputSchema = z.object({
  careerPath: z
    .string()
    .describe('The chosen career path for which to recommend learning strategies.'),
  interests: z.string().optional().describe('The interests of the student.'),
  academicBackground: z
    .string()
    .optional()
    .describe('The academic background of the student.'),
  personalityTraits: z
    .string()
    .optional()
    .describe('The personality traits of the student.'),
  goals: z.string().optional().describe('The goals of the student.'),
});
export type RecommendLearningStrategiesInput = z.infer<
  typeof RecommendLearningStrategiesInputSchema
>;

const RecommendLearningStrategiesOutputSchema = z.object({
  shortTermStrategies: z
    .array(z.string())
    .describe('A list of short-term learning strategies.'),
  longTermStrategies: z
    .array(z.string())
    .describe('A list of long-term learning strategies.'),
  onlineResources: z
    .array(z.string())
    .describe('A list of suggested online resources, certifications, internships, and projects.'),
  explanation: z
    .string()
    .describe('An explanation of why these strategies and resources are recommended.'),
});
export type RecommendLearningStrategiesOutput = z.infer<
  typeof RecommendLearningStrategiesOutputSchema
>;

export async function recommendLearningStrategies(
  input: RecommendLearningStrategiesInput
): Promise<RecommendLearningStrategiesOutput> {
  return recommendLearningStrategiesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'recommendLearningStrategiesPrompt',
  input: {schema: RecommendLearningStrategiesInputSchema},
  output: {schema: RecommendLearningStrategiesOutputSchema},
  prompt: `You are an expert career advisor specializing in recommending learning strategies for students.

You will use the student's chosen career path, interests, academic background, personality traits, and goals to recommend short-term and long-term learning strategies, as well as online resources, certifications, internships, and projects.

Explain why these strategies and resources are recommended.

Chosen Career Path: {{{careerPath}}}
Student Interests: {{{interests}}}
Academic Background: {{{academicBackground}}}
Personality Traits: {{{personalityTraits}}}
Student Goals: {{{goals}}}

Short-Term Learning Strategies:
{{#each shortTermStrategies}}- {{this}}\n{{/each}}

Long-Term Learning Strategies:
{{#each longTermStrategies}}- {{this}}\n{{/each}}

Online Resources, Certifications, Internships, and Projects:
{{#each onlineResources}}- {{this}}\n{{/each}}

Explanation: {{{explanation}}} `,
});

const recommendLearningStrategiesFlow = ai.defineFlow(
  {
    name: 'recommendLearningStrategiesFlow',
    inputSchema: RecommendLearningStrategiesInputSchema,
    outputSchema: RecommendLearningStrategiesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
