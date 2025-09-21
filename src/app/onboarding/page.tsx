
'use client';

import { useState } from 'react';
import { useForm, FormProvider, useFormContext } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AnimatePresence, motion } from 'framer-motion';
import { useRouter } from 'next/navigation';


import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Rocket } from 'lucide-react';

// --- Validation Schemas ---
const personalDetailsSchema = z.object({
    firstName: z.string().min(1, 'First name is required.'),
    lastName: z.string().min(1, 'Last name is required.'),
    email: z.string().email('Please enter a valid email.'),
    age: z.string().min(1, 'Age is required.'),
    gender: z.string().min(1, 'Gender is required.'),
});

const academicSchema = z.object({
  educationLevel: z.string().min(1, 'Education level is required.'),
  fieldOfStudy: z.string().min(1, 'Field of study is required.'),
  enjoyedSubjects: z.string().min(1, 'This field is required.'),
  challengingSubjects: z.string().min(1, 'This field is required.'),
  specialTraining: z.string().optional(),
});

const interestsSchema = z.object({
  excitingTopics: z.string().min(1, 'This field is required.'),
  workPreference: z.enum(['numbers', 'people', 'technology', 'creativity']),
  interestedIndustries: z.array(z.string()).min(1, 'Select at least one industry.'),
  dreamCareer: z.string().min(1, 'This field is required.'),
});

const skillsSchema = z.object({
    technicalSkills: z.string().min(1, 'This field is required.'),
    softSkills: z.string().min(1, 'This field is required.'),
    workExperience: z.string().optional(),
    taskPreference: z.enum(['structured', 'creative']),
});

const formSchema = personalDetailsSchema
    .merge(academicSchema)
    .merge(interestsSchema)
    .merge(skillsSchema);

// --- Form Steps ---
const steps = [
    {
        id: 'personalDetails',
        title: 'Personal Details',
        description: 'Let\'s start with the basics.',
        fields: ['firstName', 'lastName', 'email', 'age', 'gender'],
        schema: personalDetailsSchema,
    },
  {
    id: 'academics',
    title: 'Academic Background',
    description: 'Tell us about your educational journey.',
    fields: ['educationLevel', 'fieldOfStudy', 'enjoyedSubjects', 'challengingSubjects', 'specialTraining'],
    schema: academicSchema,
  },
  {
    id: 'interests',
    title: 'Interests & Passions',
    description: 'Help us understand what drives you.',
    fields: ['excitingTopics', 'workPreference', 'interestedIndustries', 'dreamCareer'],
    schema: interestsSchema,
  },
  {
    id: 'skills',
    title: 'Skills & Strengths',
    description: 'What are you good at?',
    fields: ['technicalSkills', 'softSkills', 'workExperience', 'taskPreference'],
    schema: skillsSchema,
  },
  {
    id: 'summary',
    title: 'Ready to Go!',
    description: 'Your profile is all set.',
  },
];

const industryOptions = [
    { id: 'it', label: 'IT / Tech' },
    { id: 'healthcare', label: 'Healthcare' },
    { id: 'finance', label: 'Finance' },
    { id: 'design', label: 'Design' },
    { id: 'research', label: 'Research' },
    { id: 'marketing', label: 'Marketing' },
    { id: 'education', label: 'Education' },
    { id: 'engineering', label: 'Engineering' },
];

function PersonalDetailsStep() {
    const { control } = useFormContext();
    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <FormField
                    control={control}
                    name="firstName"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>First Name</FormLabel>
                            <FormControl>
                                <Input placeholder="John" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={control}
                    name="lastName"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Last Name</FormLabel>
                            <FormControl>
                                <Input placeholder="Doe" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
            <FormField
                control={control}
                name="email"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                            <Input type="email" placeholder="john.doe@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <div className="grid grid-cols-2 gap-4">
                 <FormField
                    control={control}
                    name="age"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Age</FormLabel>
                            <FormControl>
                                <Input type="number" placeholder="21" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={control}
                    name="gender"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Gender</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                            <SelectTrigger>
                            <SelectValue placeholder="Select your gender" />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                            <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                        </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                    )}
                />
            </div>
        </div>
    );
}


function AcademicStep() {
  const { control } = useFormContext();
  return (
    <div className="space-y-4">
      <FormField
        control={control}
        name="educationLevel"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Current education level</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select your education level" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="high-school">High School</SelectItem>
                <SelectItem value="undergraduate">Undergraduate</SelectItem>
                <SelectItem value="postgraduate">Postgraduate</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="fieldOfStudy"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Field of study or specialization</FormLabel>
            <FormControl>
              <Input placeholder="e.g., Computer Science" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="enjoyedSubjects"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Which subjects do you enjoy the most?</FormLabel>
            <FormControl>
              <Input placeholder="e.g., Mathematics, Design" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
       <FormField
        control={control}
        name="challengingSubjects"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Which subjects do you find most challenging?</FormLabel>
            <FormControl>
              <Input placeholder="e.g., Physics, Literature" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="specialTraining"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Certifications or special training (optional)</FormLabel>
            <FormControl>
              <Textarea placeholder="List any relevant courses or certifications." {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}

function InterestsStep() {
    const { control } = useFormContext();
    return (
        <div className="space-y-6">
            <FormField
                control={control}
                name="excitingTopics"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>What topics or activities excite you the most?</FormLabel>
                        <FormControl>
                            <Textarea placeholder="e.g., building apps, analyzing data, creative writing..." {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={control}
                name="workPreference"
                render={({ field }) => (
                    <FormItem className="space-y-3">
                        <FormLabel>Do you prefer working with numbers, people, technology, or creativity?</FormLabel>
                        <FormControl>
                            <RadioGroup
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                className="flex flex-col space-y-1"
                            >
                                <FormItem className="flex items-center space-x-3 space-y-0">
                                    <FormControl><RadioGroupItem value="numbers" /></FormControl>
                                    <FormLabel className="font-normal">Numbers</FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center space-x-3 space-y-0">
                                    <FormControl><RadioGroupItem value="people" /></FormControl>
                                    <FormLabel className="font-normal">People</FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center space-x-3 space-y-0">
                                    <FormControl><RadioGroupItem value="technology" /></FormControl>
                                    <FormLabel className="font-normal">Technology</FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center space-x-3 space-y-0">
                                    <FormControl><RadioGroupItem value="creativity" /></FormControl>
                                    <FormLabel className="font-normal">Creativity</FormLabel>
                                </FormItem>
                            </RadioGroup>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={control}
                name="interestedIndustries"
                render={({ field }) => (
                    <FormItem>
                         <FormLabel>Which industries interest you most?</FormLabel>
                        <div className="grid grid-cols-2 gap-2">
                        {industryOptions.map((item) => (
                            <FormField
                            key={item.id}
                            control={control}
                            name="interestedIndustries"
                            render={({ field }) => {
                                return (
                                <FormItem
                                    key={item.id}
                                    className="flex flex-row items-start space-x-3 space-y-0"
                                >
                                    <FormControl>
                                    <Checkbox
                                        checked={field.value?.includes(item.id)}
                                        onCheckedChange={(checked) => {
                                        return checked
                                            ? field.onChange([...(field.value || []), item.id])
                                            : field.onChange(
                                                field.value?.filter(
                                                (value) => value !== item.id
                                                )
                                            )
                                        }}
                                    />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                    {item.label}
                                    </FormLabel>
                                </FormItem>
                                )
                            }}
                            />
                        ))}
                        </div>
                        <FormMessage />
                    </FormItem>
                )}
             />
             <FormField
                control={control}
                name="dreamCareer"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>If there were no limits, what career would you choose?</FormLabel>
                        <FormControl>
                            <Input placeholder="e.g., Astronaut, Game Developer" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </div>
    );
}

function SkillsStep() {
    const { control } = useFormContext();
    return (
        <div className="space-y-6">
            <FormField
                control={control}
                name="technicalSkills"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>What technical skills do you have?</FormLabel>
                        <FormControl>
                            <Input placeholder="e.g., Python, Figma, SQL" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={control}
                name="softSkills"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>What soft skills describe you best?</FormLabel>
                        <FormControl>
                            <Input placeholder="e.g., Communication, Teamwork, Leadership" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={control}
                name="workExperience"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Internships, projects, or part-time work (optional)</FormLabel>
                        <FormControl>
                            <Textarea placeholder="Describe any relevant experience you have." {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={control}
                name="taskPreference"
                render={({ field }) => (
                    <FormItem className="space-y-3">
                        <FormLabel>Do you prefer structured tasks or creative problem-solving?</FormLabel>
                        <FormControl>
                            <RadioGroup
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                className="flex flex-col space-y-1"
                            >
                                <FormItem className="flex items-center space-x-3 space-y-0">
                                    <FormControl><RadioGroupItem value="structured" /></FormControl>
                                    <FormLabel className="font-normal">Structured tasks (with clear steps)</FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center space-x-3 space-y-0">
                                    <FormControl><RadioGroupItem value="creative" /></FormControl>
                                    <FormLabel className="font-normal">Creative problem-solving</FormLabel>
                                </FormItem>
                            </RadioGroup>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </div>
    );
}

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [previousStep, setPreviousStep] = useState(0);
  const router = useRouter();


  const methods = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      age: '',
      gender: '',
      educationLevel: '',
      fieldOfStudy: '',
      enjoyedSubjects: '',
      challengingSubjects: '',
      specialTraining: '',
      excitingTopics: '',
      workPreference: undefined,
      interestedIndustries: [],
      dreamCareer: '',
      technicalSkills: '',
      softSkills: '',
      workExperience: '',
      taskPreference: undefined,
    },
    mode: 'onChange',
  });
  const { trigger, getValues } = methods;

  const next = async () => {
    const fields = steps[currentStep].fields;
    const output = await trigger(fields as any, { shouldFocus: true });

    if (!output) return;

    if (currentStep < steps.length - 1) {
        setPreviousStep(currentStep);
        setCurrentStep((step) => step + 1);
    }
  };

  const prev = () => {
    if (currentStep > 0) {
        setPreviousStep(currentStep);
        setCurrentStep((step) => step - 1);
    }
  };
  
  const onSubmit = (data: any) => {
    console.log('Form submitted:', data);
    // Here you would typically send the data to your backend/Firestore
    next();
  };

  const handleGoToDashboard = () => {
    localStorage.setItem('onboardingComplete', 'true');
    router.push('/dashboard');
  };

  const progress = ((currentStep + 1) / steps.length) * 100;
  const direction = currentStep > previousStep ? 1 : -1;

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <Progress value={progress} className="mb-4" />
          <CardTitle>{steps[currentStep].title}</CardTitle>
          <CardDescription>{steps[currentStep].description}</CardDescription>
        </CardHeader>
        <CardContent>
          <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-8">
              <AnimatePresence mode="wait">
                <motion.div
                    key={currentStep}
                    initial={{ x: `${direction * 100}%`, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: `${direction * -100}%`, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    {currentStep === 0 && <PersonalDetailsStep />}
                    {currentStep === 1 && <AcademicStep />}
                    {currentStep === 2 && <InterestsStep />}
                    {currentStep === 3 && <SkillsStep />}
                    {currentStep === 4 && (
                         <div className="text-center space-y-4">
                            <Rocket className="w-16 h-16 text-primary mx-auto" />
                            <h2 className="text-2xl font-bold">You're All Set!</h2>
                            <p className="text-muted-foreground">
                                We're now personalizing your career dashboard.
                            </p>
                        </div>
                    )}
                </motion.div>
              </AnimatePresence>
            </form>
          </FormProvider>
        </CardContent>
        <CardFooter className="flex justify-between">
            {currentStep > 0 && currentStep < steps.length - 1 && (
                <Button variant="outline" onClick={prev}>Back</Button>
            )}
            {currentStep === 0 && <div/>}
            
            {currentStep < steps.length - 2 && (
                 <Button onClick={next}>Next</Button>
            )}
             {currentStep === steps.length - 2 && (
                 <Button onClick={methods.handleSubmit(onSubmit)}>Submit & Finish</Button>
            )}
             {currentStep === steps.length - 1 && (
                 <Button onClick={handleGoToDashboard}>Go to Dashboard</Button>
            )}
        </CardFooter>
      </Card>
    </div>
  );
}

    
