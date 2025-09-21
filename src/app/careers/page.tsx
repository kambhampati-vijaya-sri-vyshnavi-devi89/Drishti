
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Briefcase, LoaderCircle, Sparkles } from 'lucide-react';

import { Button } from '@/components/ui/button';
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
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { generateCareerRecommendations, GenerateCareerRecommendationsInput, GenerateCareerRecommendationsOutput } from '@/ai/flows/generate-career-recommendations';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  interests: z.string().min(10, 'Please describe your interests in more detail.'),
  academicBackground: z.string().min(10, 'Please describe your academic background.'),
  personalityTraits: z.string().min(10, 'Please describe your personality traits.'),
  goals: z.string().min(10, 'Please describe your goals.'),
});

export default function CareersPage() {
  const [recommendations, setRecommendations] = useState<GenerateCareerRecommendationsOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      interests: '',
      academicBackground: '',
      personalityTraits: '',
      goals: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setRecommendations(null);
    try {
      const result = await generateCareerRecommendations(values as GenerateCareerRecommendationsInput);
      setRecommendations(result);
    } catch (error) {
      console.error('Error generating recommendations:', error);
      toast({
        variant: 'destructive',
        title: 'An Error Occurred',
        description: 'Failed to generate career recommendations. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-primary/10 rounded-lg">
          <Briefcase className="w-8 h-8 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-headline">
            Career Paths
          </h1>
          <p className="text-muted-foreground">
            Explore AI-powered career paths that match your profile.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        <Card className="lg:sticky top-6">
          <CardHeader>
            <CardTitle>Discover Your Career</CardTitle>
            <CardDescription>
              Fill out your profile, and our AI will suggest career paths for you.
            </CardDescription>
          </CardHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="interests"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Interests</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="e.g., Technology, art, creative writing, video games, outdoor activities..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="academicBackground"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Academic Background</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="e.g., B.S. in Computer Science, favorite subjects were algorithms and data structures..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="personalityTraits"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Personality Traits</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="e.g., Introverted, analytical, enjoy teamwork, creative problem-solver..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="goals"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Career Goals</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="e.g., Work in a fast-paced environment, achieve financial stability, contribute to a social cause..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={isLoading}>
                  {isLoading && (
                    <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Get Recommendations
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>

        {isLoading && (
            <div className="flex items-center justify-center h-96">
                <LoaderCircle className="w-12 h-12 text-primary animate-spin" />
            </div>
        )}

        {recommendations && (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Sparkles className="text-primary" />
                        Your Recommended Paths
                    </CardTitle>
                    <CardDescription>
                       Based on your profile, here are some career paths you might excel in.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div>
                        <h3 className="font-semibold text-lg mb-2">Top Suggestions</h3>
                        <div className="flex flex-wrap gap-2">
                            {recommendations.careerPaths.map((path) => (
                                <div key={path} className="bg-primary/10 text-primary-foreground py-1 px-3 rounded-full text-sm font-medium">
                                    {path}
                                </div>
                            ))}
                        </div>
                    </div>
                     <div>
                        <h3 className="font-semibold text-lg mb-2">Why these were chosen</h3>
                        <p className="text-muted-foreground text-sm">{recommendations.explanation}</p>
                    </div>
                </CardContent>
            </Card>
        )}
      </div>
    </div>
  );
}
