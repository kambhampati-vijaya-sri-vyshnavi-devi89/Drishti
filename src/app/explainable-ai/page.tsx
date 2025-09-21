
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Atom, LoaderCircle } from 'lucide-react';

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
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { explainCareerSkillRecommendation, ExplainCareerSkillRecommendationInput } from '@/ai/flows/explain-career-skill-recommendations';

const formSchema = z.object({
  profile: z.string().min(10, 'Please provide a more detailed profile.'),
  recommendation: z.string().min(2, 'Please enter a recommendation to explain.'),
});

export default function ExplainableAIPage() {
  const [explanation, setExplanation] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      profile: '',
      recommendation: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setExplanation('');
    try {
      const result = await explainCareerSkillRecommendation(values as ExplainCareerSkillRecommendationInput);
      setExplanation(result.explanation);
    } catch (error) {
      console.error('Error getting explanation:', error);
      setExplanation('An error occurred while generating the explanation. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="p-4 md:p-8 space-y-6">
       <div className="flex items-center gap-4">
        <div className="p-3 bg-primary/10 rounded-lg">
            <Atom className="w-8 h-8 text-primary" />
        </div>
        <div>
            <h1 className="text-3xl font-bold tracking-tight font-headline">
                Explainable AI
            </h1>
            <p className="text-muted-foreground">
                Understand the "why" behind your career and skill recommendations.
            </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Get an Explanation</CardTitle>
            <CardDescription>
              Enter a student profile and a recommendation to understand the reasoning behind it.
            </CardDescription>
          </CardHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="profile"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Student Profile</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="e.g., Interests in creative arts, strong in communication, background in marketing..."
                          className="h-32"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="recommendation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Career or Skill Recommendation</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 'UX Designer' or 'Learn Python'" {...field} />
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
                  Explain Recommendation
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>

        <Card className="flex flex-col">
            <CardHeader>
                <CardTitle>Explanation</CardTitle>
                <CardDescription>
                    The AI's reasoning will appear here.
                </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
                {isLoading ? (
                    <div className="flex items-center justify-center h-full">
                        <LoaderCircle className="w-10 h-10 text-primary animate-spin" />
                    </div>
                ) : (
                    explanation && (
                        <div className="prose prose-sm max-w-none text-foreground">
                            <p>{explanation}</p>
                        </div>
                    )
                )}
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
