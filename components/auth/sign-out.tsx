'use client';

import { authClient } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const SignOut = ({ className }: { className?: string }) => {
  const router = useRouter();

  const handleSignOut = async () => {
    await authClient.signOut();
    router.refresh();
  };

  return (
    <Button onClick={handleSignOut} className={cn(`${className}`)}>
      Sign Out
    </Button>
  );
};

export default SignOut;
