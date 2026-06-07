'use client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import SignOut from '../auth/sign-out';
import { Button } from '../ui/button';
import { authClient } from '@/lib/auth-client';

const DesktopNavProfile = () => {
  const { data: session } = authClient.useSession();

  const user = session?.user;

  return (
    <>
      {session && session?.user ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className={'hover:cursor-pointer'}>
              <AvatarImage
                src={user?.image ?? undefined}
                alt={user?.name ?? '@user'}
              />
              <AvatarFallback className="bg-primary text-primary-foreground">
                {user?.name?.slice(0, 2).toUpperCase() ?? 'US'}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-48">
            <div className="px-2 py-1.5">
              <p className="text-sm font-medium">{user?.name ?? 'User'}</p>
              <p className="text-xs text-muted-foreground">{user?.email}</p>
            </div>
            <DropdownMenuSeparator />
            {/* <DropdownMenuItem>
              <Link
                href={`/alumni/${user?.id}`}
                className="item-center flex w-full gap-3"
              >
                <UserIcon />
                Profile
              </Link>
            </DropdownMenuItem>
             */}

            <DropdownMenuSeparator />
            <DropdownMenuItem className={'p-0 w-full'}>
              <SignOut className="w-full" />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <div className="">
          <Button asChild size="sm">
            <a href="/login">Login</a>
          </Button>
        </div>
      )}
    </>
  );
};

export default DesktopNavProfile;
