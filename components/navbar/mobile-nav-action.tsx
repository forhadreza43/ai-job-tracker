'use client';
import { Button } from '@/components/ui/button';
import { auth } from './navbar.constants';
import SignOut from '../auth/sign-out';
import { authClient } from '@/lib/auth-client';

const MobileNavAction = () => {
  const { data: session } = authClient.useSession();
  const user = session?.user;

  if (user) {
    return (
      <div className="flex flex-col gap-3 p-4">
        {/* <Link
          href={`/alumni/${user.id}`}
          className="flex w-full items-center gap-2 py-2 font-semibold"
        >
          <UserRound size={16} />
          Profile
        </Link>
        <Link
          href="/alumni/settings"
          className="flex w-full items-center gap-2 py-2 font-semibold"
        >
          <Settings size={16} /> Settings
        </Link> */}
        <div className="pt-2 w-full">
          <SignOut className="w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 px-4 py-6">
      <Button variant="outline" asChild>
        <a href={auth.login.url}>{auth.login.title}</a>
      </Button>
      <Button asChild>
        <a href={auth.signup.url}>{auth.signup.title}</a>
      </Button>
    </div>
  );
};

export default MobileNavAction;
