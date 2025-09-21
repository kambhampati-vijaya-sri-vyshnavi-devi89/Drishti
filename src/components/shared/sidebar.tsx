
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import {
  AreaChart,
  Atom,
  BookOpen,
  Briefcase,
  ClipboardList,
  FileText,
  LayoutDashboard,
  ListChecks,
  Mail,
  Route,
  Users,
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';

import { cn } from '@/lib/utils';

const DragonLogo = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M14.5 12a5 5 0 0 1-5-5 5 5 0 0 1-5 5" />
      <path d="M4 14v1a2 2 0 0 0 2 2h1" />
      <path d="m18 13-2.1 2.8a2.4 2.4 0 0 1-3.6.3" />
      <path d="M12 17v4" />
      <path d="M12 17h.5A1.5 1.5 0 0 0 14 15.5V15" />
      <path d="M8.5 14A2.5 2.5 0 0 0 6 16.5" />
      <path d="M18 10c0-1-1-2-2" />
      <path d="M14.5 12a5 5 0 0 0 5-5 5 5 0 0 0-5 5" />
      <path d="m19 7-1 1" />
      <path d="m22 9-1-1" />
      <path d="M4.2 11.5A6.5 6.5 0 0 1 10 4a6.5 6.5 0 0 1 7.4 5.5" />
      <path d="M10 4V2" />
    </svg>
  );

const menuItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/assessment', label: 'Skill Assessment', icon: ClipboardList },
  { href: '/careers', label: 'Career Paths', icon: Briefcase },
  { href: '/roadmaps', label: 'Roadmaps', icon: Route },
  { href: '/resume-checker', label: 'Resume Checker', icon: FileText },
  { href: '/cover-letter', label: 'Cover Letter Gen', icon: Mail },
  { href: '/tracker', label: 'Job Tracker', icon: ListChecks },
  { href: '/resources', label: 'Resources', icon: BookOpen },
  { href: '/explainable-ai', label: 'Explainable AI', icon: Atom },
];

export default function AppSidebar() {
  const pathname = usePathname();
  const { state } = useSidebar();

  const isActive = (href: string) => {
    return href === '/dashboard' ? pathname === href : pathname.startsWith(href);
  };

  return (
    <Sidebar variant="inset" collapsible="icon">
      <SidebarHeader className="h-16 justify-start">
        <DragonLogo className="size-8 shrink-0 text-primary" />
        <span
          className={cn(
            'text-lg font-headline font-semibold text-primary',
            state === 'collapsed' && 'hidden'
          )}
        >
          Project Drishti
        </span>
        <div className="flex-1" />
        <SidebarTrigger className="group-data-[collapsible=icon]:hidden" />
      </SidebarHeader>

      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.label}>
              <SidebarMenuButton
                asChild
                isActive={isActive(item.href)}
                tooltip={{ children: item.label }}
              >
                <Link href={item.href}>
                  <item.icon />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter>
       
      </SidebarFooter>
    </Sidebar>
  );
}
