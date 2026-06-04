'use client';

import { authClient } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import React, { useTransition } from 'react';
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
import { signupSchema } from '@/lib/schema/auth.schema';
import { z } from 'zod';

export function SignupForm({ ...props }: React.ComponentProps<typeof Card>) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [formErrors, setFormErrors] = React.useState<
    Record<string, string[]> | undefined
  >();
  const [error, setError] = React.useState<string | null>(null);

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    const rawFields = Object.fromEntries(formData.entries());
    const validatedFields = signupSchema.safeParse(rawFields);

    if (!validatedFields.success) {
      setFormErrors(z.flattenError(validatedFields.error).fieldErrors);
      return;
    }

    setFormErrors(undefined);
    const { name, email, password } = validatedFields.data;

    startTransition(async () => {
      const result = await authClient.signUp.email({
        name,
        email,
        password,
      });

      if (result?.error) {
        const err = result.error as { message?: string; status?: number };
        setError(err?.message || 'Failed to create account');
        return;
      }

      router.push('/');
      router.refresh();
    });
  };

  return (
    <Card {...props}>
      <CardHeader className="text-center">
        <CardTitle>Create an account</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="name">Full Name</FieldLabel>
              <Input
                id="name"
                type="text"
                name="name"
                placeholder="John Doe"
                required
              />
              {formErrors?.name && (
                <p className="text-sm font-medium text-destructive mt-1">
                  {formErrors.name[0]}
                </p>
              )}
            </Field>

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
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <Input id="password" type="password" name="password" required />
              {formErrors?.password && (
                <p className="text-sm font-medium text-destructive mt-1">
                  {formErrors.password[0]}
                </p>
              )}
            </Field>

            <Field>
              <FieldLabel htmlFor="confirm-password">
                Confirm Password
              </FieldLabel>
              <Input
                id="confirm-password"
                type="password"
                name="confirmPassword"
                required
              />
              {formErrors?.confirmPassword && (
                <p className="text-sm font-medium text-destructive mt-1">
                  {formErrors.confirmPassword[0]}
                </p>
              )}
            </Field>

            {error && (
              <p className="text-sm font-medium text-center text-destructive">
                {error}
              </p>
            )}
            <Field>
              <Button type="submit" disabled={isPending}>
                {isPending ? 'Creating Account...' : 'Create Account'}
              </Button>
            </Field>

            <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
              Or continue with
            </FieldSeparator>
            <Field className="grid grid-cols-2 gap-4">
              <GitHubAuth />
              <GoogleAuth />
            </Field>
            <FieldDescription className="text-center">
              Already have an account? <Link href="/login">Sign in</Link>
            </FieldDescription>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
