'use server';
import { auth } from '@/lib/auth';
import { signupSchema, loginSchema } from '@/lib/schema/auth.schema';
import { SignUpFormState, LoginFormState } from '@/types/auth.types';
import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { z } from 'zod';

export const session = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return session;
};

export const LogOut = async () => {
  await auth.api.signOut({
    headers: await headers(),
  });
  revalidatePath('/');
};

export async function logInEmailPassword(
  _prevState: LoginFormState,
  formData: FormData
): Promise<LoginFormState> {
  const rawFields = Object.fromEntries(formData.entries());
  const validatedFields = loginSchema.safeParse(rawFields);

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { email, password } = validatedFields.data;
  let isSuccessful = false;
  try {
    const data = await auth.api.signInEmail({
      body: {
        email,
        password,
        rememberMe: true,
      },
      headers: await headers(),
    });

    if (data?.user) {
      isSuccessful = true;
    }
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : 'Invalid credentials or server error.',
    };
  }
  if (isSuccessful) {
    redirect('/');
  }
  return { success: true, message: 'Logged in successfully!' };
}

export async function createAccount(
  _prevState: SignUpFormState,
  formData: FormData
) {
  const rawFields = Object.fromEntries(formData.entries());

  const validatedFields = signupSchema.safeParse(rawFields);

  if (!validatedFields.success) {
    return {
      success: false,
      errors: z.flattenError(validatedFields.error).fieldErrors,
    };
  }

  const { name, email, password } = validatedFields.data;
  let isSuccessful = false;

  try {
    const data = await auth.api.signUpEmail({
      body: {
        name,
        email,
        password,
      },
    });

    if (data?.user) {
      isSuccessful = true;
    }
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : 'Something went wrong on the server.',
    };
  }
  if (isSuccessful) {
    redirect('/');
  }
  return { success: true, message: 'Account created successfully!' };
}
