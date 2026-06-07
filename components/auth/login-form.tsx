'use client';

import { authClient } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import React, { useTransition } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import GitHubAuth from './github';
import GoogleAuth from './google';
import Link from 'next/link';
import { loginSchema } from '@/lib/schema/auth.schema';
import { z } from 'zod';

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [formErrors, setFormErrors] = React.useState<
    Record<string, string[]> | undefined
  >();
  const [error, setError] = React.useState<string | null>(null);

  const pendingJob =
    typeof window !== 'undefined'
      ? localStorage.getItem('pendingJobData')
      : null;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    const rawFields = Object.fromEntries(formData.entries());
    const validatedFields = loginSchema.safeParse(rawFields);

    if (!validatedFields.success) {
      setFormErrors(z.flattenError(validatedFields.error).fieldErrors);
      return;
    }

    setFormErrors(undefined);
    const { email, password } = validatedFields.data;

    startTransition(async () => {
      const result = await authClient.signIn.email({
        email,
        password,
        rememberMe: true,
      });

      if (result?.error) {
        const err = result.error as { message?: string; status?: number };
        setError(err?.message || 'Invalid credentials');
        return;
      }

      if (pendingJob) {
        router.push('/?pending=true');
      } else {
        router.push('/');
      }
      router.refresh();
    });
  };

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle>Login to your account</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="m@example.com"
                  required
                />
                {formErrors?.email && (
                  <p className="text-sm font-medium text-destructive mt-1">
                    {formErrors.email[0]}
                  </p>
                )}
              </Field>

              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input id="password" type="password" name="password" required />
                {formErrors?.password && (
                  <p className="text-sm font-medium text-destructive mt-1">
                    {formErrors.password[0]}
                  </p>
                )}
              </Field>

              {error && (
                <p className="text-sm font-medium text-center text-destructive">
                  {error}
                </p>
              )}

              <Field>
                <Button type="submit" className="w-full" disabled={isPending}>
                  {isPending ? 'Logging in...' : 'Login'}
                </Button>
              </Field>

              <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
                Or continue with
              </FieldSeparator>
              <div className="grid grid-cols-2 gap-4">
                <GitHubAuth />
                <GoogleAuth />
              </div>
              <FieldDescription className="text-center">
                Don&apos;t have an account?{' '}
                {/* FIX: Persists the redirect string on the sign-up conversion path */}
                <Link
                  href={pendingJob ? '/signup?pending=true' : '/signup'}
                  className="underline"
                >
                  Sign up
                </Link>
              </FieldDescription>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
