
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FileText, LoaderCircle, Upload, Check, ThumbsUp, Lightbulb, Bot, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
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
import { parseAndScoreResume, ParseAndScoreResumeOutput } from '@/ai/flows/parse-and-score-resume';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const formSchema = z.object({
  resume: z.instanceof(File).refine(file => file.size > 0, 'Please upload your resume.'),
});

function fileToDataUri(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve(reader.result as string);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

type FeedbackCategory = {
  title: string;
  key: keyof Omit<ParseAndScoreResumeOutput, 'overallScore'>;
  icon: React.ElementType;
};

const feedbackCategories: FeedbackCategory[] = [
    { title: 'ATS Compatibility', key: 'atsCompatibility', icon: Bot },
    { title: 'Impact & Action Verbs', key: 'impact', icon: Sparkles },
    { title: 'Brevity & Conciseness', key: 'brevity', icon: Check },
];

export default function ResumeCheckerPage() {
  const [feedback, setFeedback] = useState<ParseAndScoreResumeOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [fileName, setFileName] = useState('');
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setFeedback(null);

    try {
      const resumeDataUri = await fileToDataUri(values.resume);
      const result = await parseAndScoreResume({ 
        resumeDataUri, 
      });
      setFeedback(result);
    } catch (error) {
      console.error('Error getting feedback:', error);
      toast({
        variant: 'destructive',
        title: 'An Error Occurred',
        description: 'Failed to get resume feedback. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      form.setValue('resume', file);
      form.clearErrors('resume');
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-primary/10 rounded-lg">
          <FileText className="w-8 h-8 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-headline">
            AI Resume Checker
          </h1>
          <p className="text-muted-foreground">
            Get instant feedback on your resume's quality and formatting.
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        <Card className="lg:sticky top-6">
          <CardHeader>
            <CardTitle>Analyze Your Resume</CardTitle>
            <CardDescription>
              Upload your resume to get instant feedback.
            </CardDescription>
          </CardHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="resume"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Resume</FormLabel>
                      <FormControl>
                        <label className={cn(
                            "flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer",
                            "hover:bg-accent/50",
                             form.formState.errors.resume ? "border-destructive" : "border-input"
                        )}>
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <Upload className="w-8 h-8 mb-3 text-muted-foreground" />
                            {fileName ? (
                                <p className="font-semibold text-primary">{fileName}</p>
                            ) : (
                                <>
                                <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                <p className="text-xs text-muted-foreground">PDF, DOC, DOCX (MAX. 5MB)</p>
                                </>
                            )}
                          </div>
                          <input type="file" className="hidden" onChange={handleFileChange} accept=".pdf,.doc,.docx" />
                        </label>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardContent>
                 <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading && (
                    <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Analyze Resume
                </Button>
              </CardContent>
            </form>
          </Form>
        </Card>

        <AnimatePresence>
            {isLoading ? (
                <div className="flex items-center justify-center h-96">
                    <LoaderCircle className="w-12 h-12 text-primary animate-spin" />
                </div>
            ) : feedback ? (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                    <Card>
                        <CardHeader>
                            <CardTitle>Analysis Report</CardTitle>
                            <CardDescription>
                                Here is your detailed resume feedback.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex flex-col items-center justify-center space-y-4 p-6 bg-accent/20 rounded-lg">
                                 <p className="text-sm font-medium text-muted-foreground">Overall Score</p>
                                 <div className="relative h-32 w-32">
                                    <svg className="h-full w-full" viewBox="0 0 36 36">
                                        <path
                                            className="text-border"
                                            strokeWidth="3" fill="none" stroke="currentColor" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                        />
                                        <motion.path
                                            className={getScoreColor(feedback.overallScore)}
                                            stroke="currentColor" strokeWidth="3" fill="none"
                                            strokeLinecap="round"
                                            initial={{ strokeDasharray: '0, 100' }}
                                            animate={{ strokeDasharray: `${feedback.overallScore}, 100`}}
                                            transition={{ duration: 1, ease: 'easeOut' }}
                                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                        />
                                    </svg>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <span className={`text-4xl font-bold ${getScoreColor(feedback.overallScore)}`}>
                                            {feedback.overallScore}
                                        </span>
                                    </div>
                                 </div>
                            </div>
                            <Accordion type="multiple" defaultValue={feedbackCategories.map(c => c.key)} className="w-full">
                                {feedbackCategories.map(({ title, key, icon: Icon }) => {
                                    const categoryFeedback = feedback[key];
                                    if (!categoryFeedback) return null;
                                    return (
                                        <AccordionItem value={key} key={key}>
                                            <AccordionTrigger className="text-base font-semibold">
                                                <div className="flex items-center gap-3">
                                                    <Icon className="h-5 w-5"/>
                                                    {title}
                                                    <span className={`font-bold ml-auto pr-4 ${getScoreColor(categoryFeedback.score)}`}>
                                                        {categoryFeedback.score}/100
                                                    </span>
                                                </div>
                                            </AccordionTrigger>
                                            <AccordionContent className="space-y-4">
                                                <div>
                                                    <h4 className="font-semibold flex items-center gap-2 mb-2"><ThumbsUp className="h-4 w-4 text-green-500"/> Strengths</h4>
                                                    <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                                                        {categoryFeedback.strengths.map((item, i) => <li key={i}>{item}</li>)}
                                                    </ul>
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold flex items-center gap-2 mb-2"><Lightbulb className="h-4 w-4 text-yellow-500"/> Suggestions</h4>
                                                    <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                                                        {categoryFeedback.suggestions.map((item, i) => <li key={i}>{item}</li>)}
                                                    </ul>
                                                </div>
                                            </AccordionContent>
                                        </AccordionItem>
                                    )
                                })}
                            </Accordion>
                        </CardContent>
                    </Card>
                </motion.div>
            ) : (
                <div className="flex items-center justify-center h-96 border-2 border-dashed rounded-lg">
                    <p className="text-muted-foreground">Your analysis report will appear here...</p>
                </div>
            )}
        </AnimatePresence>
      </div>
    </div>
  );
}
