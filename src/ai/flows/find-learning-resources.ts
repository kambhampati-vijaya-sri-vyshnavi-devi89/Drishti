
'use server';

/**
 * @fileOverview A flow for finding various learning resources based on a query.
 *
 * - findLearningResources - A function that searches for videos, books, articles, and courses.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import {
  FindLearningResourcesInputSchema,
  FindLearningResourcesOutputSchema,
  VideoSchema,
  type FindLearningResourcesInput,
  type FindLearningResourcesOutput
} from '@/ai/schemas/learning-resources';

// Tool: Search YouTube
async function fetchYoutubeVideos(query: string): Promise<{ videos: z.infer<typeof VideoSchema>[] }> {
    const apiKey = process.env.YOUTUBE_API_KEY;
    if (!apiKey || apiKey === 'YOUR_YOUTUBE_API_KEY_HERE') {
        // To avoid breaking the demo, return empty array if key is not set.
        // In a real app, you'd want to throw an error.
        console.warn('YOUTUBE_API_KEY is not set. YouTube search will be skipped.');
        return { videos: [] };
    }
    
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&type=video&maxResults=6&key=${apiKey}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            const errorBody = await response.json();
            console.error('YouTube API Error:', errorBody);
            // In a real app, you might want a more robust error handling that informs the user.
            // For now, we return empty to not break the whole flow.
            return { videos: [] };
        }
        const data = await response.json();
        if (!data.items) {
          return { videos: [] };
        }
        const videos = data.items.map((item: any) => ({
            videoId: item.id.videoId,
            title: item.snippet.title,
            description: item.snippet.description,
            thumbnailUrl: item.snippet.thumbnails.high.url,
            channelTitle: item.snippet.channelTitle,
        }));

        return { videos };
    } catch (error) {
        console.error('Failed to fetch YouTube videos:', error);
        // Return empty array on failure to not break the whole flow.
        return { videos: [] };
    }
}

const searchYoutube = ai.defineTool(
    {
      name: 'searchYoutube',
      description: 'Searches YouTube for videos based on a query.',
      inputSchema: z.object({ query: z.string() }),
      outputSchema: z.object({ videos: z.array(VideoSchema) }),
    },
    async (input) => {
      return await fetchYoutubeVideos(input.query);
    }
);


// Main Flow
const findLearningResourcesFlow = ai.defineFlow(
  {
    name: 'findLearningResourcesFlow',
    inputSchema: FindLearningResourcesInputSchema,
    outputSchema: FindLearningResourcesOutputSchema,
  },
  async (input) => {
    const llmResponse = await ai.generate({
        prompt: [
            { toolRequest: { name: 'searchYoutube', input: { query: input.query } } },
        ],
        system: `You are an expert learning advisor. Your goal is to provide a comprehensive and high-quality list of learning resources for the user's requested topic.

You must perform the following actions:
1.  Use the 'searchYoutube' tool to find relevant YouTube videos for the user's query.
2.  Generate a list of 2-3 seminal books or highly-regarded articles. For each, provide a title, a URL, and a brief, compelling description explaining why it's a valuable resource.
3.  Generate a list of 2-3 top online courses. Prioritize free courses if available (like NPTEL, SWAYAM). For each, provide a title, a URL, and a brief, compelling description of what the course offers.

Your final output must conform to the specified JSON schema.
`,
        model: 'googleai/gemini-1.5-flash-latest',
        tools: [searchYoutube],
        output: {
            schema: FindLearningResourcesOutputSchema,
        },
    });

    return llmResponse.output || { videos: [], booksAndArticles: [], courses: [] };
  }
);


// Exported function to be called from the UI
export async function findLearningResources(input: FindLearningResourcesInput): Promise<FindLearningResourcesOutput> {
  return findLearningResourcesFlow(input);
}
