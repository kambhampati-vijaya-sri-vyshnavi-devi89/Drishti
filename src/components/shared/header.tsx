
'use client';

import Link from 'next/link';
import { Bell, ChevronDown, Search } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';

const notifications = [
    {
        title: "New Job Alert: Frontend Developer at Google",
        description: "A new job matching your profile has been posted.",
        time: "5m ago",
    },
    {
        title: "Application Viewed: UX Designer at Meta",
        description: "Your application has been viewed by the recruiter.",
        time: "1h ago",
    },
    {
        title: "Mentor Session Confirmed",
        description: "Your session with Jane Doe is confirmed for tomorrow.",
        time: "1d ago",
    },
];

export default function AppHeader() {
  return (
    <header className="flex h-16 items-center justify-between border-b bg-background px-4 md:px-8">
      <div className="flex items-center gap-4">
        {/* Can add breadcrumbs or page title here */}
      </div>

      <div className="flex items-center gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <input
            placeholder="Search..."
            className="h-10 w-full rounded-md border border-input bg-background pl-10 pr-4 text-sm"
          />
        </div>
        
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="icon">
                    <Bell className="h-5 w-5" />
                    <span className="sr-only">Toggle notifications</span>
                     <span className="absolute top-1 right-1 flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                    </span>
                </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-80">
                 <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <h4 className="font-medium text-sm">Notifications</h4>
                        <Link href="#" className="text-xs text-muted-foreground hover:text-primary">
                            Mark all as read
                        </Link>
                    </div>
                    <Separator />
                    <div className="space-y-3">
                    {notifications.map((notification, index) => (
                        <div key={index} className="grid grid-cols-[25px_1fr] items-start">
                             <div className="h-2 w-2 rounded-full bg-primary mt-1.5" />
                             <div className="space-y-1">
                                <p className="text-sm font-medium leading-none">{notification.title}</p>
                                <p className="text-sm text-muted-foreground">{notification.description}</p>
                                <p className="text-xs text-muted-foreground/70">{notification.time}</p>
                            </div>
                        </div>
                    ))}
                    </div>
                 </div>
            </PopoverContent>
        </Popover>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src="https://picsum.photos/seed/avatar/40/40" alt="User Avatar" />
                <AvatarFallback>S</AvatarFallback>
              </Avatar>
              <div className="flex flex-col items-start">
                <span className="font-medium text-sm">Student</span>
                <span className="text-xs text-muted-foreground">View Profile</span>
              </div>
              <ChevronDown className="ml-auto h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Log out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
