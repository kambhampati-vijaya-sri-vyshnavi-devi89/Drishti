
'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Route,
  LoaderCircle,
  Lightbulb,
  Award,
  Book,
  Wrench,
  Rocket,
  Check,
} from 'lucide-react';
import {
  generateRoadmap,
  GenerateRoadmapOutput,
} from '@/ai/flows/generate-roadmap';
import { useToast } from '@/hooks/use-toast';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';


const formSchema = z.object({
  careerPath: z
    .string()
    .min(3, 'Please enter a career path with at least 3 characters.'),
});

const milestoneIcons: { [key: string]: React.ElementType } = {
  foundation: Book,
  'core skills': Wrench,
  specialization: Award,
  'job readiness': Rocket,
  default: Lightbulb,
};

const getIconForMilestone = (title: string) => {
  const lowerTitle = title.toLowerCase();
  for (const key in milestoneIcons) {
    if (lowerTitle.includes(key)) {
      return milestoneIcons[key];
    }
  }
  return milestoneIcons.default;
};

type CheckedItems = {
  [milestoneIndex: number]: {
    skills: string[];
    projects: string[];
  };
};

export default function RoadmapsPage() {
  const [roadmap, setRoadmap] = useState<GenerateRoadmapOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [checkedItems, setCheckedItems] = useState<CheckedItems>({});
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      careerPath: '',
    },
  });
  
  useEffect(() => {
    if (roadmap) {
      try {
        const storedProgress = localStorage.getItem(`roadmapProgress_${roadmap.title}`);
        if (storedProgress) {
            const parsedData = JSON.parse(storedProgress);
             // Ensure we only load checkedItems, not the entire roadmap from storage
            if(parsedData.checkedItems) {
                setCheckedItems(parsedData.checkedItems);
            } else {
                 // Handle legacy format if only checkedItems were stored
                setCheckedItems(parsedData);
            }
        } else {
           // Initialize empty state if nothing is stored
          const initialCheckedState: CheckedItems = {};
          roadmap.milestones.forEach((_, index) => {
            initialCheckedState[index] = { skills: [], projects: [] };
          });
          setCheckedItems(initialCheckedState);
        }
      } catch (e) {
        console.error("Failed to parse roadmap progress from localStorage", e);
        // Initialize to empty state on error
        const initialCheckedState: CheckedItems = {};
        roadmap.milestones.forEach((_, index) => {
            initialCheckedState[index] = { skills: [], projects: [] };
        });
        setCheckedItems(initialCheckedState);
      }
    }
  }, [roadmap]);

  useEffect(() => {
    if (roadmap && Object.keys(checkedItems).length > 0) {
        try {
            // Save both the roadmap structure and the checked items
            const dataToStore = {
                roadmap: roadmap,
                checkedItems: checkedItems
            };
            localStorage.setItem(`roadmapProgress_${roadmap.title}`, JSON.stringify(dataToStore));
        } catch (e) {
            console.error("Failed to save roadmap progress to localStorage", e);
        }
    }
  }, [checkedItems, roadmap]);


  const handleCheckChange = (
    milestoneIndex: number,
    type: 'skills' | 'projects',
    item: string
  ) => {
    setCheckedItems(prev => {
      const newChecked = { ...prev };
      if (!newChecked[milestoneIndex]) {
        newChecked[milestoneIndex] = { skills: [], projects: [] };
      }
      
      const currentItems = newChecked[milestoneIndex][type];
      if (currentItems.includes(item)) {
        newChecked[milestoneIndex][type] = currentItems.filter(i => i !== item);
      } else {
        newChecked[milestoneIndex][type] = [...currentItems, item];
      }
      return newChecked;
    });
  };

  const getMilestoneProgress = (milestoneIndex: number) => {
    if (!roadmap || !checkedItems[milestoneIndex]) return 0;
    
    const milestone = roadmap.milestones[milestoneIndex];
    const totalItems = milestone.skills.length + milestone.projects.length;
    if (totalItems === 0) return 100;

    const checkedSkills = checkedItems[milestoneIndex].skills?.length || 0;
    const checkedProjects = checkedItems[milestoneIndex].projects?.length || 0;
    const totalChecked = checkedSkills + checkedProjects;
    
    return (totalChecked / totalItems) * 100;
  };


  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setRoadmap(null);
    setCheckedItems({});
    try {
      const result = await generateRoadmap({ careerPath: values.careerPath });
      setRoadmap(result);
    } catch (error) {
      console.error('Error generating roadmap:', error);
      toast({
        variant: 'destructive',
        title: 'An Error Occurred',
        description:
          'Failed to generate the career roadmap. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-primary/10 rounded-lg">
          <Route className="w-8 h-8 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-headline">
            AI-Powered Roadmaps
          </h1>
          <p className="text-muted-foreground">
            Generate a personalized, step-by-step guide to your dream career.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Create Your Career Roadmap</CardTitle>
          <CardDescription>
            Enter a career path to get a detailed plan from our AI advisor.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex items-start gap-4"
            >
              <FormField
                control={form.control}
                name="careerPath"
                render={({ field }) => (
                  <FormItem className="flex-grow">
                    <FormLabel className="sr-only">Career Path</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., 'Software Engineer' or 'Data Scientist'"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="mt-2" />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading} className="w-48">
                {isLoading ? (
                  <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  'Generate Roadmap'
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {isLoading && (
        <div className="text-center py-20">
          <LoaderCircle className="w-12 h-12 text-primary animate-spin mx-auto" />
          <p className="mt-4 text-muted-foreground">
            Building your personalized roadmap...
          </p>
        </div>
      )}

      {roadmap && (
        <div className="space-y-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold font-headline">
              {roadmap.title}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {roadmap.description}
            </p>
          </div>
          <div className="relative pl-6">
            <div className="absolute left-9 top-0 bottom-0 w-0.5 bg-border -translate-x-1/2"></div>
            {roadmap.milestones.map((milestone, index) => {
              const Icon = getIconForMilestone(milestone.title);
              const progress = getMilestoneProgress(index);
              return (
                <div key={index} className="relative mb-12">
                  <div className="absolute left-9 top-1 w-6 h-6 bg-background border-2 border-primary rounded-full -translate-x-1/2 flex items-center justify-center">
                    <Icon className="w-4 h-4 text-primary" />
                  </div>
                  <div className="pl-12">
                    <Card>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-xl">
                              {milestone.title}
                            </CardTitle>
                            <CardDescription>
                              Est. Duration: {milestone.duration}
                            </CardDescription>
                          </div>
                        </div>
                         <div className="space-y-1 pt-2">
                           <div className="flex justify-between items-center">
                                <span className="text-xs font-medium text-muted-foreground">Milestone Progress</span>
                                <span className="text-xs font-semibold">{Math.round(progress)}%</span>
                           </div>
                            <Progress value={progress} className="h-2" />
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-muted-foreground">
                          {milestone.description}
                        </p>
                        <Separator />
                        <div>
                          <h4 className="font-semibold mb-2">Skills to Learn</h4>
                          <div className="space-y-2">
                            {milestone.skills.map((skill) => {
                               const isChecked = checkedItems[index]?.skills.includes(skill);
                               return (
                                <div key={skill} className="flex items-center gap-3">
                                  <Checkbox 
                                    id={`skill-${index}-${skill}`} 
                                    checked={isChecked}
                                    onCheckedChange={() => handleCheckChange(index, 'skills', skill)}
                                  />
                                  <label htmlFor={`skill-${index}-${skill}`} className={cn("text-sm text-muted-foreground cursor-pointer", isChecked && "line-through text-muted-foreground/70")}>
                                    {skill}
                                  </label>
                                </div>
                               )
                            })}
                          </div>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">
                            Suggested Projects
                          </h4>
                           <div className="space-y-2">
                             {milestone.projects.map((project) => {
                               const isChecked = checkedItems[index]?.projects.includes(project);
                               return (
                                <div
                                    key={project}
                                    className="flex items-start gap-3"
                                >
                                    <Checkbox
                                        id={`project-${index}-${project}`} 
                                        className="mt-1"
                                        checked={isChecked}
                                        onCheckedChange={() => handleCheckChange(index, 'projects', project)}
                                    />
                                    <label htmlFor={`project-${index}-${project}`} className={cn("text-sm text-muted-foreground cursor-pointer", isChecked && "line-through text-muted-foreground/70")}>
                                        {project}
                                    </label>
                                </div>
                               )}
                            )}
                           </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
