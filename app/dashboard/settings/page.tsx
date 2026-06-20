// app/dashboard/settings/page.tsx অথবা যেকোনো settings component এ
'use client';

import { authClient } from '@/lib/auth-client';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
// import { ChromeIcon, GithubIcon } from 'lucide-react';

function LinkedAccounts() {
  // const { data: session } = authClient.useSession();
  const [accounts, setAccounts] = useState<{ providerId: string }[]>([]);

  useEffect(() => {
    authClient.listAccounts().then((res) => {
      if (res.data) setAccounts(res.data);
    });
  }, []);

  const hasGoogle = accounts.some((a) => a.providerId === 'google');
  const hasGithub = accounts.some((a) => a.providerId === 'github');

  const linkGoogle = async () => {
    await authClient.linkSocial({
      provider: 'google',
      callbackURL: '/dashboard',
    });
  };

  const linkGithub = async () => {
    await authClient.linkSocial({
      provider: 'github',
      callbackURL: '/dashboard',
    });
  };

  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm font-medium text-foreground">Linked Accounts</p>
      <p className="text-xs text-muted-foreground">
        Link Google to your account from Settings
      </p>

      {/* Google */}
      <div className="flex items-center justify-between border border-border rounded-lg px-4 py-3">
        <div className="flex items-center gap-2">
          {/* <ChromeIcon className="size-4" /> */}
          <span className="text-sm">Google</span>
          {hasGoogle && (
            <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
              Linked
            </span>
          )}
        </div>
        {!hasGoogle && (
          <Button size="sm" variant="outline" onClick={linkGoogle}>
            Link
          </Button>
        )}
      </div>

      {/* GitHub */}
      <div className="flex items-center justify-between border border-border rounded-lg px-4 py-3">
        <div className="flex items-center gap-2">
          {/* <GithubIcon className="size-4" /> */}
          <span className="text-sm">GitHub</span>
          {hasGithub && (
            <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
              Linked
            </span>
          )}
        </div>
        {!hasGithub && (
          <Button size="sm" variant="outline" onClick={linkGithub}>
            Link
          </Button>
        )}
      </div>
    </div>
  );
}

export default LinkedAccounts;
