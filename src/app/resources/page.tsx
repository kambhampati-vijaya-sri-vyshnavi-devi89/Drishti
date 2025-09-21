
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Image from 'next/image';
import Link from 'next/link';
import { BookOpen, LoaderCircle, Search, Youtube, BookCopy, Award, ArrowRight, BrainCircuit } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { findLearningResources } from '@/ai/flows/find-learning-resources';
import type { FindLearningResourcesOutput } from '@/ai/schemas/learning-resources';
import { useSearchParams } from 'next/navigation';
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const formSchema = z.object({
  query: z.string().min(3, 'Please enter a search term with at least 3 characters.'),
});

type Resources = FindLearningResourcesOutput;

const suggestedTopics = [
    'Data Structures in Python',
    'React Native for Beginners',
    'Advanced SQL Queries',
    'UX Design Principles',
    'Machine Learning Fundamentals'
];


import { Suspense } from 'react';

function ResourcesPageInner() {
  const [resources, setResources] = useState<Resources | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const searchParams = useSearchParams();
  const queryParam = searchParams.get('query');

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      query: queryParam || '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setError(null);
    setResources(null);
    try {
      const result = await findLearningResources({ query: values.query });
      if (result.videos.length === 0 && result.booksAndArticles.length === 0 && result.courses.length === 0) {
        setError('No resources found for your query. Try a different search term.');
      }
      setResources(result);
    } catch (err) {
        console.error('Error searching resources:', err);
        const errorMessage = (err as Error).message;
        if (errorMessage.includes('YOUTUBE_API_KEY')) {
            setError('The YouTube API Key is not configured. Please add it to your .env file.');
        } else {
            setError('An error occurred while fetching resources. Please try again.');
        }
    } finally {
      setIsLoading(false);
    }
  }

  React.useEffect(() => {
    if (queryParam) {
      form.setValue('query', queryParam);
      onSubmit({ query: queryParam });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryParam]);
  
  const handleSuggestionClick = (topic: string) => {
    form.setValue('query', topic);
    onSubmit({ query: topic });
  };

  const renderLoadingState = () => (
    <div className="space-y-8">
        <Card>
            <CardHeader>
                <Skeleton className="h-6 w-1/3" />
                <Skeleton className="h-4 w-2/3" />
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Skeleton className="h-40 rounded-lg" />
                <Skeleton className="h-40 rounded-lg" />
            </CardContent>
        </Card>
        <Card>
            <CardHeader>
                 <Skeleton className="h-6 w-1/3" />
                <Skeleton className="h-4 w-2/3" />
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Skeleton className="h-48 rounded-lg" />
                <Skeleton className="h-48 rounded-lg" />
                <Skeleton className="h-48 rounded-lg" />
            </CardContent>
        </Card>
    </div>
  );

  const renderEmptyState = () => (
    <div className="text-center py-20">
        <BrainCircuit className="w-16 h-16 text-primary/50 mx-auto mb-4" />
        <h3 className="text-xl font-semibold">Unlock Your Learning Potential</h3>
        <p className="text-muted-foreground mt-2 mb-6">Enter a topic above to discover curated learning resources.</p>
        <div className="space-y-2">
             <p className="text-sm font-medium">Or try one of these popular topics:</p>
             <div className="flex flex-wrap justify-center gap-2">
                {suggestedTopics.map(topic => (
                    <Button key={topic} variant="outline" size="sm" onClick={() => handleSuggestionClick(topic)}>
                        {topic}
                    </Button>
                ))}
             </div>
        </div>
    </div>
    );

  const renderErrorState = () => (
     <div className="flex justify-center py-20">
        <Card className="w-full max-w-md text-center">
            <CardHeader>
                <CardTitle>Something Went Wrong</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-destructive">{error}</p>
            </CardContent>
        </Card>
    </div>
  );

  const renderResults = () => (
    <div className="space-y-8">
        {resources && resources.booksAndArticles.length > 0 && (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><BookCopy /> Recommended Reading</CardTitle>
                    <CardDescription>
                        Curated books and articles to deepen your understanding.
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {resources.booksAndArticles.map((item, index) => (
                         <Card key={`${item.title}-${index}`} className="flex flex-col">
                            <CardHeader>
                                <CardTitle className="text-lg">{item.title}</CardTitle>
                            </CardHeader>
                            <CardContent className="flex-grow">
                                <p className="text-sm text-muted-foreground">{item.description}</p>
                            </CardContent>
                            <CardFooter>
                                <Button asChild variant="outline" className="w-full">
                                    <Link href={item.url} target="_blank" rel="noopener noreferrer">
                                        Go to Resource <ArrowRight className="ml-2 h-4 w-4" />
                                    </Link>
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </CardContent>
            </Card>
        )}

        {resources && resources.courses.length > 0 && (
             <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Award /> Top Online Courses</CardTitle>
                    <CardDescription>
                       Top courses to build your skills. Prioritizing free options where available.
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {resources.courses.map((item, index) => (
                        <Card key={`${item.title}-${index}`} className="flex flex-col">
                            <CardHeader>
                                <CardTitle className="text-lg">{item.title}</CardTitle>
                            </CardHeader>
                            <CardContent className="flex-grow">
                                <p className="text-sm text-muted-foreground">{item.description}</p>
                            </CardContent>
                            <CardFooter>
                                <Button asChild variant="outline" className="w-full">
                                    <Link href={item.url} target="_blank" rel="noopener noreferrer">
                                        Explore Course <ArrowRight className="ml-2 h-4 w-4" />
                                    </Link>
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </CardContent>
            </Card>
        )}

        {resources && resources.videos.length > 0 && (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Youtube /> Recommended Videos</CardTitle>
                    <CardDescription>
                        Top video tutorials from YouTube to learn visually.
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {resources.videos.map((video) => (
                        <Card key={video.videoId} className="overflow-hidden transition-all hover:shadow-xl hover:-translate-y-1">
                        <Link href={`https://www.youtube.com/watch?v=${video.videoId}`} target="_blank" rel="noopener noreferrer" className="group">
                            <div className="relative aspect-video">
                            <Image
                                src={video.thumbnailUrl}
                                alt={video.title}
                                fill
                                className="object-cover"
                            />
                            </div>
                            <CardHeader>
                            <CardTitle className="text-base font-semibold group-hover:text-primary transition-colors">{video.title}</CardTitle>
                            <CardDescription className="text-xs pt-1">{video.channelTitle}</CardDescription>
                            </CardHeader>
                        </Link>
                        </Card>
                    ))}
                </CardContent>
            </Card>
        )}
    </div>
  );

  return (
    <div className="p-4 md:p-8 space-y-8">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-primary/10 rounded-lg">
          <BookOpen className="w-8 h-8 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-headline">
            Learning Resources
          </h1>
          <p className="text-muted-foreground">
            Find courses, articles, and videos to help you grow.
          </p>
        </div>
      </div>

       <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm -mx-8 px-8 py-4 -mt-8">
          <Card>
            <CardContent className="pt-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-start gap-4">
                  <FormField
                    control={form.control}
                    name="query"
                    render={({ field }) => (
                      <FormItem className="flex-grow">
                        <FormControl>
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <Input placeholder="e.g., 'React hooks' or 'Data structures in Python'" className="pl-10" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage className="mt-2" />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" disabled={isLoading} className="w-32">
                    {isLoading ? (
                      <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      'Search'
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
       </div>
      
      {isLoading ? renderLoadingState() : error ? renderErrorState() : resources ? renderResults() : renderEmptyState()}

    </div>
  );
}

export default function ResourcesPage() {
  return (
    <Suspense>
      <ResourcesPageInner />
    </Suspense>
  );
}
