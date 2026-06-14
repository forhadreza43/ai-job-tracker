import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import { Skeleton } from '@/components/ui/skeleton';

interface SidebarNavigationSkeletonProps {
  count?: number;
}

export function SidebarNavigationSkeleton({
  count = 4,
}: SidebarNavigationSkeletonProps) {
  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarMenu>
          {Array.from({ length: count }).map((_, idx) => (
            <SidebarMenuItem key={idx}>
              <SidebarMenuButton className="pointer-events-none">
                {/* Icon Placeholder (Matches standard Lucide icon sizes) */}
                <Skeleton className="h-4 w-4 shrink-0 rounded" />

                {/* Text Title Placeholder */}
                <Skeleton
                  className={`h-4 ${idx % 2 === 0 ? 'w-28' : 'w-24'}`}
                />
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
