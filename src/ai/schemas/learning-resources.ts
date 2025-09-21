/**
 * @fileOverview Schemas and types for the findLearningResources flow.
 *
 * This file defines the Zod schemas and derived TypeScript types for the
 * input and output of the learning resources feature. It is separated
 * to avoid issues with the 'use server' directive in the main flow file.
 */

import { z } from 'genkit';

// Input Schema
export const FindLearningResourcesInputSchema = z.object({
  query: z.string().describe('The search query for learning resources.'),
});
export type FindLearningResourcesInput = z.infer<typeof FindLearningResourcesInputSchema>;

// Video Schema
export const VideoSchema = z.object({
    videoId: z.string(),
    title: z.string(),
    description: z.string(),
    thumbnailUrl: z.string(),
    channelTitle: z.string(),
});

// Resource Item Schema (for books, articles, courses)
export const ResourceItemSchema = z.object({
    title: z.string().describe('The title of the resource.'),
    description: z.string().describe('A brief, compelling description of the resource.'),
    url: z.string().url().describe('The direct URL to access the resource.'),
});

// Output Schema
export const FindLearningResourcesOutputSchema = z.object({
  videos: z.array(VideoSchema).describe('A list of relevant YouTube videos.'),
  booksAndArticles: z.array(ResourceItemSchema).describe('A list of recommended books and articles.'),
  courses: z.array(ResourceItemSchema).describe('A list of recommended free or paid courses.'),
});
export type FindLearningResourcesOutput = z.infer<typeof FindLearningResourcesOutputSchema>;
