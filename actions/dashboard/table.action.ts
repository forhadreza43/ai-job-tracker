'use server';

import { ApplicationStatus } from '@/generated/prisma/enums';
import { prisma } from '@/lib/prisma';
import { revalidatePath, updateTag } from 'next/cache';
import { z } from 'zod';

const STATUS = Object.values(ApplicationStatus);

const updateStatusSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  jobId: z.string().min(1, 'Job ID is required'),
  status: z.enum(STATUS),
});

export interface UpdateStatusResponse {
  success: boolean;
  message: string;
  error?: string;
}

export async function updateJobStatus(
  userId: string,
  jobId: string,
  status: string
): Promise<UpdateStatusResponse> {
  try {
    // 1. Validate inputs safely
    const validatedData = updateStatusSchema.parse({
      jobId,
      status,
      userId,
    });

    const updatedJob = await prisma.job.updateMany({
      where: {
        id: validatedData.jobId,
        userId: validatedData.userId,
      },
      data: {
        status: validatedData.status as ApplicationStatus,
      },
    });

    if (updatedJob.count === 0) {
      return {
        success: false,
        message: 'Job record not found or unauthorized.',
      };
    }

    revalidatePath('/dashboard');

    return {
      success: true,
      message: 'Job status updated successfully.',
    };
  } catch (error) {
    console.error('Error in updateJobStatus:', error);

    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: 'Validation failed.',
        error: error.issues[0]?.message || 'Invalid input data structure.',
      };
    }

    return {
      success: false,
      message: 'An internal server error occurred while updating the status.',
    };
  }
}

// Input validation schema
const deleteJobSchema = z.object({
  userId: z.string().min(1, 'User ID is required to authorize deletion'),
  jobId: z.string().min(1, 'Job ID is required'),
});

export interface DeleteJobResponse {
  success: boolean;
  message: string;
  error?: string;
}

export async function deleteJobAction(
  userId: string,
  jobId: string
): Promise<DeleteJobResponse> {
  try {
    const validatedData = deleteJobSchema.parse({ userId, jobId });

    const deletionResult = await prisma.job.deleteMany({
      where: {
        id: validatedData.jobId,
        userId: validatedData.userId,
      },
    });

    if (deletionResult.count === 0) {
      return {
        success: false,
        message: 'Job record not found or deletion unauthorized.',
      };
    }

    // updateTag(`jobs-${validatedData.jobId}`);
    revalidatePath('/dashboard');

    return {
      success: true,
      message: 'Job tracking reference deleted successfully.',
    };
  } catch (error) {
    console.error('Error in deleteJobAction:', error);

    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: 'Validation failed.',
        error: error.issues[0]?.message || 'Invalid IDs provided.',
      };
    }

    return {
      success: false,
      message: 'An internal server error occurred during data deletion.',
    };
  }
}

const updateInterviewDateSchema = z.object({
  userId: z.string().min(1, 'User ID is required to authorize update'),
  jobId: z.string().min(1, 'Job ID is required'),
  interviewDate: z.date().nullable(),
});

export interface UpdateInterviewDateResponse {
  success: boolean;
  message: string;
  error?: string;
}

export async function updateInterviewDate(
  userId: string,
  jobId: string,
  interviewDate: Date | null
): Promise<UpdateInterviewDateResponse> {
  try {
    const validatedData = updateInterviewDateSchema.parse({
      userId,
      jobId,
      interviewDate,
    });

    const updatedJob = await prisma.job.updateMany({
      where: {
        id: validatedData.jobId,
        userId: validatedData.userId,
      },
      data: {
        interviewDate: validatedData.interviewDate,
      },
    });

    if (updatedJob.count === 0) {
      return {
        success: false,
        message: 'Job record not found or unauthorized.',
      };
    }
    revalidatePath('/dashboard');
    return {
      success: true,
      message: 'Interview date updated successfully.',
    };
  } catch (error) {
    console.error('Error in updateInterviewDate:', error);

    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: 'Validation failed.',
        error: error.issues[0]?.message || 'Invalid input data structure.',
      };
    }

    return {
      success: false,
      message:
        'An internal server error occurred while updating the interview date.',
    };
  }
}
