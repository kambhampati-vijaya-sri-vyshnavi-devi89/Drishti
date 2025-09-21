
'use client';

import { useEffect, useState } from 'react';
import { Briefcase, ListChecks, Route, Users, LoaderCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

type CheckedItems = {
  [milestoneIndex: string]: {
    skills: string[];
    projects: string[];
  };
};

type RoadmapData = {
  title: string;
  description: string;
  milestones: {
    title: string;
    duration: string;
    description: string;
    skills: string[];
    projects: string[];
  }[];
};

type StoredRoadmap = {
  roadmap: RoadmapData;
  checkedItems: CheckedItems;
};

type MilestoneProgress = {
    title: string;
    progress: number;
}

type ProgressDetail = {
  title: string;
  overallProgress: number;
  milestones: MilestoneProgress[];
};

const getProgressFromStorage = (): StoredRoadmap[] => {
  if (typeof window === 'undefined') {
    return [];
  }

  const storedRoadmaps: StoredRoadmap[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith('roadmapProgress_')) {
      try {
        const fullData = localStorage.getItem(key);
        if (fullData) {
          const parsed = JSON.parse(fullData);
          if (parsed.checkedItems && parsed.roadmap) {
            storedRoadmaps.push({
              roadmap: parsed.roadmap,
              checkedItems: parsed.checkedItems,
            });
          }
        }
      } catch (e) {
        console.error(`Failed to parse roadmap from localStorage for key: ${key}`, e);
      }
    }
  }
  return storedRoadmaps;
};

const calculateOverallProgress = (roadmaps: StoredRoadmap[]): { average: number, details: ProgressDetail[] } => {
  if (roadmaps.length === 0) {
    return { average: 0, details: [] };
  }

  const details: ProgressDetail[] = [];
  let totalProgressSum = 0;

  roadmaps.forEach(({ roadmap, checkedItems }) => {
    let totalItemsOverall = 0;
    let totalCheckedOverall = 0;
    const milestoneProgressDetails: MilestoneProgress[] = [];

    roadmap.milestones.forEach((milestone, index) => {
      const totalMilestoneItems = milestone.skills.length + milestone.projects.length;
      totalItemsOverall += totalMilestoneItems;
      
      const checkedMilestoneSkills = checkedItems[index]?.skills?.length || 0;
      const checkedMilestoneProjects = checkedItems[index]?.projects?.length || 0;
      const totalMilestoneChecked = checkedMilestoneSkills + checkedMilestoneProjects;
      totalCheckedOverall += totalMilestoneChecked;
      
      const milestoneProgress = totalMilestoneItems > 0 ? (totalMilestoneChecked / totalMilestoneItems) * 100 : 0;
      milestoneProgressDetails.push({ title: milestone.title, progress: Math.round(milestoneProgress) });
    });

    const overallRoadmapProgress = totalItemsOverall > 0 ? (totalCheckedOverall / totalItemsOverall) * 100 : 0;
    details.push({
        title: roadmap.title,
        overallProgress: Math.round(overallRoadmapProgress),
        milestones: milestoneProgressDetails
    });
    totalProgressSum += overallRoadmapProgress;
  });
  
  const average = roadmaps.length > 0 ? Math.round(totalProgressSum / roadmaps.length) : 0;

  return { average, details };
};


export default function OverviewCards() {
  const [progress, setProgress] = useState({ average: 0, details: [] as ProgressDetail[] });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedRoadmaps = getProgressFromStorage();
    const calculatedProgress = calculateOverallProgress(storedRoadmaps);
    setProgress(calculatedProgress);
    setIsLoading(false);
  }, []);

  if (isLoading) {
      return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
             {Array.from({ length: 4 }).map((_, i) => (
                <Card key={i}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <LoaderCircle className="h-4 w-4 text-muted-foreground animate-spin" />
                    </CardHeader>
                    <CardContent>
                         <div className="h-8 w-1/2 bg-muted rounded-md animate-pulse mt-1"></div>
                         <div className="h-4 w-3/4 bg-muted/50 rounded-md animate-pulse mt-2"></div>
                    </CardContent>
                </Card>
             ))}
        </div>
      );
  }

  return (
    <>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Match</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-headline">Software Engineer</div>
            <p className="text-xs text-muted-foreground">
              Based on your skills and interests
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Roadmap Progress</CardTitle>
            <Route className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{progress.average}%</div>
            <p className="text-xs text-muted-foreground">
              Average completion of goals
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Applications Sent</CardTitle>
            <ListChecks className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+12</div>
            <p className="text-xs text-muted-foreground">in the last 30 days</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Interviews</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+2</div>
            <p className="text-xs text-muted-foreground">scheduled this month</p>
          </CardContent>
        </Card>
      </div>

      {progress.details.length > 0 && (
         <Card>
            <CardHeader>
                <CardTitle className="font-headline">Your Active Roadmaps</CardTitle>
                <CardDescription>
                    A detailed look at your progress for each career path you're exploring.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {progress.details.map((roadmap) => (
                <div key={roadmap.title} className="space-y-3 p-4 border rounded-lg">
                    <div>
                        <div className="flex justify-between items-center mb-1">
                            <h3 className="font-semibold">{roadmap.title}</h3>
                            <span className="text-sm font-bold text-primary">
                                {roadmap.overallProgress}% Complete
                            </span>
                        </div>
                        <Progress value={roadmap.overallProgress} className="h-2" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 pt-2">
                        {roadmap.milestones.map(milestone => (
                            <div key={milestone.title}>
                                <div className="flex justify-between items-center text-xs">
                                    <span className="text-muted-foreground">{milestone.title}</span>
                                    <span className="font-medium">{milestone.progress}%</span>
                                </div>
                                <Progress value={milestone.progress} className="h-1.5 mt-1" />
                            </div>
                        ))}
                    </div>
                </div>
                ))}
            </CardContent>
        </Card>
      )}
    </>
  );
}
