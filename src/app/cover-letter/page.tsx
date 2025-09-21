
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, LoaderCircle, Sparkles, Clipboard, Check } from 'lucide-react';

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
import { generateCoverLetter, GenerateCoverLetterInput } from '@/ai/flows/generate-cover-letter';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  profile: z.string().min(20, 'Please provide a more detailed profile.'),
  resume: z.string().min(20, 'Please paste in your resume content.'),
  jobDescription: z.string().min(20, 'Please provide a more detailed job description.'),
});

export default function CoverLetterPage() {
    const [coverLetter, setCoverLetter] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [hasCopied, setHasCopied] = useState(false);
    const { toast } = useToast();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            profile: '',
            resume: '',
            jobDescription: '',
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true);
        setCoverLetter('');
        try {
            const result = await generateCoverLetter(values as GenerateCoverLetterInput);
            setCoverLetter(result.coverLetter);
        } catch (error) {
            console.error('Error generating cover letter:', error);
            toast({
                variant: 'destructive',
                title: 'An Error Occurred',
                description: 'Failed to generate the cover letter. Please try again.',
            });
        } finally {
            setIsLoading(false);
        }
    }

    const handleCopy = () => {
        navigator.clipboard.writeText(coverLetter);
        setHasCopied(true);
        setTimeout(() => setHasCopied(false), 2000);
    };

    return (
        <div className="p-4 md:p-8 space-y-6">
            <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                    <Mail className="w-8 h-8 text-primary" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight font-headline">
                        Cover Letter Generator
                    </h1>
                    <p className="text-muted-foreground">
                        Create personalized cover letters in seconds.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                <Card className="lg:sticky top-6">
                    <CardHeader>
                        <CardTitle>Generate Your Cover Letter</CardTitle>
                        <CardDescription>
                            Fill in your details, and our AI will craft a compelling cover letter for you.
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
                                            <FormLabel>Your Profile</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Briefly describe your background, skills, and career goals..."
                                                    className="h-24"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="resume"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Your Resume</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Paste the text content of your resume here..."
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
                                    name="jobDescription"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Job Description</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Paste the job description you're applying for..."
                                                    className="h-32"
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
                                    {isLoading && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                                    Generate Cover Letter
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
                
                {coverLetter && (
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle className="flex items-center gap-2">
                                    <Sparkles className="text-primary" />
                                    Your Generated Cover Letter
                                </CardTitle>
                                <CardDescription>Review and copy your new cover letter.</CardDescription>
                            </div>
                            <Button variant="outline" size="sm" onClick={handleCopy}>
                                {hasCopied ? <Check className="mr-2"/> : <Clipboard className="mr-2" />}
                                {hasCopied ? 'Copied!' : 'Copy'}
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <div className="prose prose-sm max-w-none text-foreground whitespace-pre-wrap p-4 bg-muted/50 rounded-md">
                                {coverLetter}
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}
