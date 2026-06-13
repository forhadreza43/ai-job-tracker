import { SidebarMenuButton } from '@/components/ui/sidebar';
import { Skeleton } from '@/components/ui/skeleton';

export function DashboardUserMenuSkeleton() {
  return (
    <SidebarMenuButton size="lg" className="pointer-events-none">
      {/* Avatar Skeleton */}
      <Skeleton className="h-8 w-8 rounded-lg" />

      {/* Name and Email Skeletons */}
      <div className="grid flex-1 text-left gap-1">
        {/* User Name */}
        <Skeleton className="h-4 w-24" />
        {/* User Email */}
        <Skeleton className="h-3 w-32" />
      </div>

      {/* Actions Icon Skeleton (Ellipsis) */}
      <Skeleton className="ml-auto size-4 rounded-sm" />
    </SidebarMenuButton>
  );
}
