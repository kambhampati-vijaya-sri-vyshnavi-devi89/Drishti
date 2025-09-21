
'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Check, CheckCircle, Lightbulb, Target, Youtube } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { CAREER_PATHS, SKILLS_LIST } from '@/lib/career-data';
import type { CareerPath, Skill } from '@/lib/career-data';
import Link from 'next/link';

const COLORS = ['hsl(var(--primary))', 'hsl(var(--muted))'];

type CareerRecommendation = CareerPath & {
  matchScore: number;
  matchingSkills: Skill[];
  gapSkills: Skill[];
};

export default function AssessmentPage() {
  const [selectedSkills, setSelectedSkills] = useState<Skill[]>([]);
  const [recommendations, setRecommendations] = useState<CareerRecommendation[]>([]);
  const [selectedCareer, setSelectedCareer] = useState<CareerRecommendation | null>(null);
  const [step, setStep] = useState(1);

  const toggleSkill = (skill: Skill) => {
    setSelectedSkills((prev) =>
      prev.some((s) => s.id === skill.id)
        ? prev.filter((s) => s.id !== skill.id)
        : [...prev, skill]
    );
  };

  const handleFindCareerPath = () => {
    const calculatedRecommendations: CareerRecommendation[] = CAREER_PATHS.map((career) => {
      const matchingSkills = career.skills.filter((cs) =>
        selectedSkills.some((ss) => ss.id === cs.id)
      );
      const gapSkills = career.skills.filter((cs) =>
        !selectedSkills.some((ss) => ss.id === cs.id)
      );
      const matchScore = (matchingSkills.length / career.skills.length) * 100;
      return { ...career, matchScore, matchingSkills, gapSkills };
    }).sort((a, b) => b.matchScore - a.matchScore);

    setRecommendations(calculatedRecommendations);
    setStep(2);
  };

  const handleSelectCareer = (career: CareerRecommendation) => {
    setSelectedCareer(career);
    setStep(3);
  };

  const handleBack = () => {
    if (step === 3) {
      setSelectedCareer(null);
      setStep(2);
    } else if (step === 2) {
      setRecommendations([]);
      setStep(1);
    }
  };

  const chartData = useMemo(() => {
    if (!selectedCareer) return [];
    return [
      { name: 'Your Skills', value: selectedCareer.matchingSkills.length },
      { name: 'To Develop', value: selectedCareer.gapSkills.length },
    ];
  }, [selectedCareer]);

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <motion.div key="step1" initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 50 }}>
            <Card>
              <CardHeader>
                <CardTitle>What are your skills?</CardTitle>
                <CardDescription>Select at least 3 skills to get personalized career recommendations.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {SKILLS_LIST.map((skill) => (
                    <button
                      key={skill.id}
                      onClick={() => toggleSkill(skill)}
                      className={cn(
                        "px-4 py-2 rounded-full border text-sm font-medium transition-colors",
                        selectedSkills.some(s => s.id === skill.id)
                          ? "bg-primary text-primary-foreground border-transparent"
                          : "bg-background hover:bg-accent"
                      )}
                    >
                      {skill.name}
                    </button>
                  ))}
                </div>
              </CardContent>
              <CardContent>
                <Button
                  size="lg"
                  className="w-full"
                  disabled={selectedSkills.length < 3}
                  onClick={handleFindCareerPath}
                >
                  Find My Career Path
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        );
      case 2:
        return (
          <motion.div key="step2" initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }}>
            <h2 className="text-2xl font-bold mb-4">Recommended Career Paths</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendations.map((career) => (
                <Card key={career.id} className="cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-transform" onClick={() => handleSelectCareer(career)}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        {career.name}
                        <Badge variant="secondary">{Math.round(career.matchScore)}% Match</Badge>
                    </CardTitle>
                    <CardDescription>{career.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm font-semibold mb-2">Top Matching Skills:</p>
                    <div className="flex flex-wrap gap-1">
                      {career.matchingSkills.slice(0, 3).map(skill => (
                        <Badge key={skill.id} variant="outline">{skill.name}</Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>
        );
      case 3:
        if (!selectedCareer) return null;
        return (
          <motion.div key="step3" initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }}>
            <h2 className="text-2xl font-bold mb-1">{selectedCareer.name}</h2>
            <p className="text-muted-foreground mb-6">{selectedCareer.description}</p>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-1 h-fit">
                <CardHeader>
                  <CardTitle>Skill Match</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="w-full h-56">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={70} fill="#8884d8" paddingAngle={5}>
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Legend iconType="circle" />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
              </Card>
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2"><CheckCircle className="text-green-500"/> Your Matching Skills</CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-wrap gap-2">
                    {selectedCareer.matchingSkills.map(skill => <Badge key={skill.id} variant="secondary">{skill.name}</Badge>)}
                     {selectedCareer.matchingSkills.length === 0 && <p className="text-sm text-muted-foreground">No direct skill matches found.</p>}
                  </CardContent>
                </Card>
                 <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Lightbulb className="text-amber-500" /> Skills to Develop</CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-wrap gap-2">
                    {selectedCareer.gapSkills.map(skill => <Badge key={skill.id}>{skill.name}</Badge>)}
                    {selectedCareer.gapSkills.length === 0 && <p className="text-sm text-muted-foreground">You have all the required skills!</p>}
                  </CardContent>
                </Card>
                 <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Target className="text-blue-500" /> Recommended Learning</CardTitle>
                    <CardDescription>Tailored resources to help you bridge the skill gap.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                     {selectedCareer.gapSkills.slice(0,3).map(skill => (
                        <div key={skill.id} className="flex items-center justify-between p-2 rounded-md bg-accent/50">
                            <p className="font-semibold">{skill.name}</p>
                            <Button size="sm" asChild>
                                <Link href={`/resources?query=${encodeURIComponent(skill.name)}`} target="_blank">
                                    <Youtube className="mr-2 h-4 w-4"/> Find Resources
                                </Link>
                            </Button>
                        </div>
                     ))}
                     {selectedCareer.gapSkills.length === 0 && <p className="text-sm text-muted-foreground">No specific learning recommendations needed. Great job!</p>}
                  </CardContent>
                </Card>
              </div>
            </div>
          </motion.div>
        );
    }
  };

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div className="flex items-center gap-4">
        {step > 1 && (
            <Button variant="outline" size="icon" onClick={handleBack}>
                <ArrowLeft className="h-4 w-4" />
            </Button>
        )}
        <div className="p-3 bg-primary/10 rounded-lg">
          <Check className="w-8 h-8 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-headline">
            Personalized Advisor
          </h1>
          <p className="text-muted-foreground">
            From skills assessment to a tailored career roadmap.
          </p>
        </div>
      </div>
      
      <AnimatePresence mode="wait">
        {renderStep()}
      </AnimatePresence>
    </div>
  );
}
