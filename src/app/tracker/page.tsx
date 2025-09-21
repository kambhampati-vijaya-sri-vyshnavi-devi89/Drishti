
'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  ListChecks,
  Plus,
  MoreHorizontal,
  Trash2,
  Edit,
  Calendar as CalendarIcon,
} from 'lucide-react';
import { format } from 'date-fns';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

const applicationSchema = z.object({
  id: z.string().optional(),
  company: z.string().min(1, 'Company name is required.'),
  role: z.string().min(1, 'Role is required.'),
  dateApplied: z.date({ required_error: 'Application date is required.' }),
  status: z.enum(['Applied', 'Interviewing', 'Offer', 'Rejected']),
  notes: z.string().optional(),
});

type Application = z.infer<typeof applicationSchema>;

const statusColors: { [key: string]: string } = {
  Applied: 'bg-blue-500/20 text-blue-700 dark:text-blue-400 border-blue-500/30',
  Interviewing:
    'bg-yellow-500/20 text-yellow-700 dark:text-yellow-400 border-yellow-500/30',
  Offer: 'bg-green-500/20 text-green-700 dark:text-green-400 border-green-500/30',
  Rejected: 'bg-red-500/20 text-red-700 dark:text-red-400 border-red-500/30',
};

export default function JobTrackerPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [isClient, setIsClient] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingApplication, setEditingApplication] =
    useState<Application | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    setIsClient(true);
    try {
      const storedApps = localStorage.getItem('jobApplications');
      if (storedApps) {
        const parsedApps = JSON.parse(storedApps).map((app: any) => ({
          ...app,
          dateApplied: new Date(app.dateApplied),
        }));
        setApplications(parsedApps);
      }
    } catch (error) {
      console.error('Failed to load applications from localStorage', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not load saved applications.',
      });
    }
  }, [toast]);

  useEffect(() => {
    if (isClient) {
      try {
        localStorage.setItem('jobApplications', JSON.stringify(applications));
      } catch (error) {
        console.error('Failed to save applications to localStorage', error);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Could not save applications.',
        });
      }
    }
  }, [applications, isClient, toast]);

  const form = useForm<Application>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      company: '',
      role: '',
      dateApplied: new Date(),
      status: 'Applied',
      notes: '',
    },
  });

  const onSubmit = (values: Application) => {
    if (editingApplication) {
      setApplications(
        applications.map((app) =>
          app.id === editingApplication.id ? { ...values, id: app.id } : app
        )
      );
      toast({ title: 'Success', description: 'Application updated.' });
    } else {
      setApplications([
        ...applications,
        { ...values, id: new Date().toISOString() },
      ]);
      toast({ title: 'Success', description: 'Application added.' });
    }
    setIsDialogOpen(false);
    setEditingApplication(null);
    form.reset();
  };

  const handleAddNew = () => {
    setEditingApplication(null);
    form.reset({
      company: '',
      role: '',
      dateApplied: new Date(),
      status: 'Applied',
      notes: '',
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (app: Application) => {
    setEditingApplication(app);
    form.reset(app);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setApplications(applications.filter((app) => app.id !== id));
    toast({
      variant: 'destructive',
      title: 'Deleted',
      description: 'Application has been removed.',
    });
  };

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary/10 rounded-lg">
            <ListChecks className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight font-headline">
              Job Application Tracker
            </h1>
            <p className="text-muted-foreground">
              Manage your job applications from start to finish.
            </p>
          </div>
        </div>
        <Button onClick={handleAddNew}>
          <Plus className="mr-2" /> Add Application
        </Button>
      </div>

      <Dialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            form.reset();
            setEditingApplication(null);
          }
        }}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {editingApplication ? 'Edit' : 'Add'} Application
            </DialogTitle>
            <DialogDescription>
              {editingApplication
                ? 'Update the details of your job application.'
                : 'Track a new job application.'}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
              <FormField
                control={form.control}
                name="company"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Google" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Software Engineer" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dateApplied"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date Applied</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={'outline'}
                            className={cn(
                              'pl-3 text-left font-normal',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            {field.value ? (
                              format(field.value, 'PPP')
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date() || date < new Date('1900-01-01')
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.keys(statusColors).map((status) => (
                          <SelectItem key={status} value={status}>
                            {status}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., Contact person, application link, next steps..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <DialogFooter>
                <DialogClose asChild>
                    <Button type="button" variant="outline">Cancel</Button>
                </DialogClose>
                <Button type="submit">Save</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <Card>
        <CardHeader>
          <CardTitle>Your Applications</CardTitle>
          <CardDescription>
            A list of all the jobs you've applied for.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Company</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Date Applied</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isClient && applications.length > 0 ? (
                applications.map((app) => (
                  <TableRow key={app.id}>
                    <TableCell className="font-medium">{app.company}</TableCell>
                    <TableCell>{app.role}</TableCell>
                    <TableCell>{format(app.dateApplied, 'PP')}</TableCell>
                    <TableCell>
                      <Badge
                        className={cn(
                          'border',
                          statusColors[app.status] || ''
                        )}
                      >
                        {app.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(app)}>
                            <Edit className="mr-2" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDelete(app.id!)}
                            className="text-destructive"
                          >
                            <Trash2 className="mr-2" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    {isClient ? "No applications yet. Add one to get started!" : "Loading applications..."}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
