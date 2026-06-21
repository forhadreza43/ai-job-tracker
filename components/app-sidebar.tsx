'use client';

import { Suspense } from 'react';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import {
  LayoutDashboardIcon,
  ListIcon,
  CommandIcon,
  CirclePlusIcon,
  BellIcon,
  Settings,
} from 'lucide-react';
import Link from 'next/link';
import { DashboardUserMenuSkeleton } from '@/components/skeleton/dashboard-user-skeleton';
import { SidebarNavigationSkeleton } from '@/components/skeleton/sidebar-navigation-skeleton';
import { logo } from './navbar/navbar.constants';

const data = {
  navMain: [
    {
      title: 'Dashboard',
      url: '/dashboard',
      icon: <LayoutDashboardIcon />,
    },
    {
      title: 'Manage Jobs',
      url: '/dashboard/manage-jobs',
      icon: <ListIcon />,
      prefetch: false,
    },
    {
      title: 'Create Job',
      url: '/dashboard/create-job',
      icon: <CirclePlusIcon />,
    },
    {
      title: 'Notifications',
      url: '/dashboard/notifications',
      icon: <BellIcon />,
    },
    {
      title: 'Settings',
      url: '/dashboard/settings',
      icon: <Settings />,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <Link href="/">
                <CommandIcon className="size-5!" />
                <span className="text-base font-semibold">{logo.title}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <Suspense fallback={<SidebarNavigationSkeleton />}>
          <NavMain items={data.navMain} />
        </Suspense>
      </SidebarContent>
      <SidebarFooter>
        <Suspense fallback={<DashboardUserMenuSkeleton />}>
          <NavUser />
        </Suspense>
      </SidebarFooter>
    </Sidebar>
  );
}
