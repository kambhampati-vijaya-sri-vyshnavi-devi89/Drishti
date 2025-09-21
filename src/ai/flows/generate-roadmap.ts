'use server';

/**
 * @fileOverview Generates a career roadmap with milestones and learning resources.
 *
 * - generateRoadmap - A function that generates a career roadmap.
 * - GenerateRoadmapInput - The input type for the generateRoadmap function.
 * - GenerateRoadmapOutput - The return type for the generateRoadmap function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateRoadmapInputSchema = z.object({
  careerPath: z.string().describe('The career path to generate a roadmap for.'),
});
export type GenerateRoadmapInput = z.infer<typeof GenerateRoadmapInputSchema>;

const MilestoneSchema = z.object({
  title: z.string().describe('The title of the milestone.'),
  duration: z.string().describe('Estimated duration to complete the milestone (e.g., 1-3 Months).'),
  description: z.string().describe('A brief description of what this milestone entails.'),
  skills: z.array(z.string()).describe('A list of key skills to acquire during this stage.'),
  projects: z.array(z.string()).describe('A list of suggested projects to build practical experience.'),
});

const GenerateRoadmapOutputSchema = z.object({
  title: z.string().describe('The title of the generated roadmap.'),
  description: z.string().describe('A brief overview of the roadmap.'),
  milestones: z.array(MilestoneSchema).describe('A list of milestones that form the roadmap.'),
});
export type GenerateRoadmapOutput = z.infer<typeof GenerateRoadmapOutputSchema>;

export async function generateRoadmap(input: GenerateRoadmapInput): Promise<GenerateRoadmapOutput> {
  return generateRoadmapFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateRoadmapPrompt',
  input: { schema: GenerateRoadmapInputSchema },
  output: { schema: GenerateRoadmapOutputSchema },
  prompt: `You are an expert career counselor who creates detailed and actionable roadmaps for students aspiring to enter a specific career field.

Generate a comprehensive roadmap for a student aspiring to become a "{{careerPath}}".

The roadmap should have a clear title and a brief, encouraging description.

It should be broken down into distinct milestones (e.g., "Foundation", "Core Skills", "Specialization", "Job Readiness"). For each milestone, provide:
- A title.
- An estimated duration (e.g., "1-3 Months").
- A concise description of the goals for that stage.
- A list of key skills to learn.
- A list of example projects to apply those skills.

The roadmap should be practical, encouraging, and provide a clear path from beginner to job-ready.
`,
});

const generateRoadmapFlow = ai.defineFlow(
  {
    name: 'generateRoadmapFlow',
    inputSchema: GenerateRoadmapInputSchema,
    outputSchema: GenerateRoadmapOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
