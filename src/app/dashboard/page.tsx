
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  BookOpen,
  Briefcase,
  ListChecks,
  Route,
  Users,
} from 'lucide-react';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MarketChart } from '@/components/dashboard/market-chart';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import OverviewCards from '@/components/dashboard/overview-cards';

const careerMatches = [
  { name: 'Software Engineer', imageId: 'software-engineer' },
  { name: 'Data Scientist', imageId: 'data-scientist' },
  { name: 'UX Designer', imageId: 'ux-designer' },
  { name: 'Product Manager', imageId: 'product-manager' },
];

const recommendedResources = [
  { title: 'MDN Web Docs', platform: 'Documentation', href: '/resources' },
  { title: 'Advanced SQL for Data Scientists', platform: 'Coursera', href: '#' },
  { title: 'React Native - The Practical Guide', platform: 'Udemy', href: '#' },
];

export default function Home() {
  return (
    <div className="space-y-6 p-4 md:p-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between space-y-2 md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-headline">
            Dashboard
          </h1>
          <p className="text-muted-foreground">
            Welcome back! Here&apos;s your personalized career overview.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button>Download Report</Button>
        </div>
      </div>

      <OverviewCards />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="font-headline">Top Career Matches</CardTitle>
            <CardDescription>
              Explore careers that align with your profile.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {careerMatches.map((career) => {
              const image = PlaceHolderImages.find((p) => p.id === career.imageId);
              return (
                <Link href="#" key={career.name} className="group">
                  <Card className="overflow-hidden transition-all hover:shadow-xl hover:-translate-y-1">
                    <div className="relative h-40 w-full">
                      {image && (
                        <Image
                          src={image.imageUrl}
                          alt={image.description}
                          fill
                          className="object-cover"
                          data-ai-hint={image.imageHint}
                        />
                      )}
                    </div>
                    <CardHeader>
                      <CardTitle className="text-lg font-semibold">{career.name}</CardTitle>
                    </CardHeader>
                  </Card>
                </Link>
              );
            })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Job Market Snapshot</CardTitle>
            <CardDescription>
              Average salaries for top recommended roles.
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <MarketChart />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="font-headline">Recommended Resources</CardTitle>
            <CardDescription>
              Courses and articles to boost your skills.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {recommendedResources.map((resource) => (
                <li
                  key={resource.title}
                  className="flex items-center space-x-3"
                >
                  <div className="flex-shrink-0">
                    <div className="p-2 bg-primary/10 rounded-md">
                      <BookOpen className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-sm">{resource.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {resource.platform}
                    </p>
                  </div>
                  <Button variant="ghost" size="icon" asChild>
                    <Link href={resource.href}>
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
