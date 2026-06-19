import { NextResponse } from 'next/server';
import { checkEmailsForInterviews } from '@/actions/cron/cron.action';

// cron-job.org বা EasyCron থেকে GET request আসবে
// Authorization header এ Bearer token দিয়ে secure করা হয়েছে
export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');

  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    const result = await checkEmailsForInterviews();

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: 'Email check failed' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Email check completed',
      processingTime: result.processingTime,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Cron job failed:', error);
    return NextResponse.json(
      { success: false, error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
