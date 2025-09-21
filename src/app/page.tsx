import Image from 'next/image';
import Link from 'next/link';
import { Check, BarChart, Rocket, User, Search, ListChecks } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';

const features = [
  {
    icon: <Check className="w-8 h-8 text-primary" />,
    title: 'Personalized Guidance',
    description: 'AI-powered recommendations based on your unique skills, interests, and personality.',
  },
  {
    icon: <BarChart className="w-8 h-8 text-primary" />,
    title: 'Skill Mapping',
    description: 'Understand your strengths and identify skill gaps for your desired career path.',
  },
  {
    icon: <Rocket className="w-8 h-8 text-primary" />,
    title: 'Dynamic Roadmaps',
    description: 'Get step-by-step, actionable roadmaps to guide you toward your future career.',
  },
];

const howItWorks = [
  {
    step: 1,
    title: 'Build Your Profile',
    description: 'Complete assessments to create your unique "Student DNA" profile.',
    icon: <User className="w-10 h-10 text-primary" />,
  },
  {
    step: 2,
    title: 'Get AI Analysis',
    description: 'Our AI analyzes your profile to provide personalized career recommendations.',
    icon: <Search className="w-10 h-10 text-primary" />,
  },
  {
    step: 3,
    title: 'Receive Your Roadmap',
    description: 'Explore detailed, step-by-step roadmaps for your recommended careers.',
    icon: <ListChecks className="w-10 h-10 text-primary" />,
  },
];

export default function LandingPage() {
  return (
    <div className="bg-background text-foreground">
      <header className="container mx-auto px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold font-headline text-primary">
          Project Drishti
        </h1>
        <nav className="flex items-center space-x-6">
          <Link href="#" className="text-sm font-medium hover:text-primary">
            About
          </Link>
          <Button asChild>
            <Link href="/dashboard">Get Started</Link>
          </Button>
        </nav>
      </header>

      <main>
        <section className="container mx-auto px-6 py-16 md:py-24">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-4xl md:text-6xl font-bold font-headline">
                Your AI Career Co-Pilot
              </h2>
              <p className="text-lg text-muted-foreground">
                Navigate your career with personalized guidance, dynamic roadmaps, and AI-powered tools.
              </p>
              <Button size="lg" asChild>
                <Link href="/onboarding">Start Your Journey</Link>
              </Button>
            </div>
            <div>
              <Image
                src="https://picsum.photos/seed/career-advisor/600/450"
                alt="AI career advisor illustration"
                width={600}
                height={450}
                className="rounded-lg shadow-2xl"
                data-ai-hint="woman laptop"
              />
            </div>
          </div>
        </section>

        <section className="bg-muted/50 py-16 md:py-24">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-bold font-headline text-center mb-12">
              How Project Drishti Works
            </h2>
            <div className="relative">
                 <div className="absolute top-1/2 left-0 w-full h-0.5 bg-border -translate-y-1/2 hidden md:block" />
                <div className="grid md:grid-cols-3 gap-8 text-center relative">
                {howItWorks.map((step) => (
                    <div key={step.step} className="flex flex-col items-center p-4">
                    <div className="w-20 h-20 bg-background border-2 border-primary/20 rounded-full flex items-center justify-center mb-4 relative shadow-lg">
                        <span className="absolute -top-2 -left-2 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">
                        {step.step}
                        </span>
                        {step.icon}
                    </div>
                    <h3 className="text-xl font-semibold font-headline">{step.title}</h3>
                    <p className="text-muted-foreground mt-2 text-sm">{step.description}</p>
                    </div>
                ))}
                </div>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-bold font-headline text-center mb-12">
              Features to Accelerate Your Career
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {features.map((feature) => (
                <div key={feature.title} className="flex items-start space-x-4">
                  <div className="bg-primary/10 p-3 rounded-lg">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold font-headline">{feature.title}</h3>
                    <p className="text-muted-foreground mt-1">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-muted/50 py-16 md:py-24">
          <div className="container mx-auto px-6 max-w-3xl text-center">
            <h2 className="text-3xl md:text-4xl font-bold font-headline mb-8">
              What Our Users Say
            </h2>
            <Card className="bg-background">
              <CardContent className="p-8">
                <Avatar className="w-20 h-20 mx-auto mb-4 border-4 border-primary/20">
                  <AvatarImage src="https://picsum.photos/seed/jane-doe/80/80" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <blockquote className="text-lg italic text-foreground">
                  "Project Drishti didn't just show me a career path; it gave me the confidence and the step-by-step plan to actually follow it. The AI resume checker was a game-changer!"
                </blockquote>
                <div className="mt-4">
                  <p className="font-semibold">Jane Doe</p>
                  <p className="text-sm text-muted-foreground">Software Engineer at TechCorp</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <footer className="container mx-auto px-6 py-8 text-center text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Project Drishti. All rights reserved.</p>
      </footer>
    </div>
  );
}
