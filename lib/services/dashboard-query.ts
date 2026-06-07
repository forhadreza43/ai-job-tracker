/**
 * Dashboard Query Service
 * Optimized queries for dashboard statistics and analytics
 */

import {
  QuickStats,
  StatusDistribution,
  UpcomingDeadline,
  RecentJob,
  DashboardOverview,
  DeadlineAlert,
  JobAnalytics,
  CompanyStats,
  DashboardQueryOptions,
  JobStatusStats,
} from '@/types/dashboard';
import { prisma } from '@/lib/prisma';

/**
 * Dashboard Query Service
 * Provides optimized database queries for dashboard operations
 */
export class DashboardQueryService {
  private static instance: DashboardQueryService;

  private constructor() {}

  static getInstance(): DashboardQueryService {
    if (!DashboardQueryService.instance) {
      DashboardQueryService.instance = new DashboardQueryService();
    }
    return DashboardQueryService.instance;
  }

  /**
   * Get quick statistics for user
   * Single optimized query using aggregation
   */
  async getQuickStats(userId: string): Promise<QuickStats> {
    const result = await prisma.$queryRaw<
      Array<{
        status: string;
        count: bigint;
        is_bookmarked: boolean;
      }>
    >`
      SELECT 
        status,
        COUNT(*)::bigint as count,
        COALESCE(is_bookmarked, false) as is_bookmarked
      FROM job
      WHERE user_id = ${userId}
      GROUP BY status, is_bookmarked
    `;

    const stats: QuickStats = {
      totalJobs: 0,
      savedJobs: 0,
      appliedJobs: 0,
      interviewJobs: 0,
      offerJobs: 0,
      rejectedJobs: 0,
      bookmarkedJobs: 0,
    };

    let bookmarkedCount = 0;

    for (const row of result) {
      const count = Number(row.count);
      stats.totalJobs += count;

      if (row.status === 'SAVED') {
        stats.savedJobs = count;
      } else if (row.status === 'APPLIED') {
        stats.appliedJobs = count;
      } else if (row.status === 'INTERVIEW') {
        stats.interviewJobs = count;
      } else if (row.status === 'OFFER') {
        stats.offerJobs = count;
      } else if (row.status === 'REJECTED') {
        stats.rejectedJobs = count;
      }

      if (row.is_bookmarked) {
        bookmarkedCount += count;
      }
    }

    stats.bookmarkedJobs = bookmarkedCount;

    return stats;
  }

  /**
   * Get status distribution
   * Breakdown of all job statuses
   */
  async getStatusDistribution(userId: string): Promise<StatusDistribution> {
    const result = await prisma.$queryRaw<
      Array<{ status: string; count: bigint }>
    >`
      SELECT status, COUNT(*)::bigint as count
      FROM job
      WHERE user_id = ${userId}
      GROUP BY status
    `;

    const distribution: StatusDistribution = {
      saved: 0,
      applied: 0,
      shortlisted: 0,
      interview: 0,
      assessment: 0,
      offer: 0,
      rejected: 0,
      withdrawn: 0,
      total: 0,
    };

    for (const row of result) {
      const count = Number(row.count);
      distribution.total += count;

      switch (row.status) {
        case 'SAVED':
          distribution.saved = count;
          break;
        case 'APPLIED':
          distribution.applied = count;
          break;
        case 'SHORTLISTED':
          distribution.shortlisted = count;
          break;
        case 'INTERVIEW':
          distribution.interview = count;
          break;
        case 'ASSESSMENT':
          distribution.assessment = count;
          break;
        case 'OFFER':
          distribution.offer = count;
          break;
        case 'REJECTED':
          distribution.rejected = count;
          break;
        case 'WITHDRAWN':
          distribution.withdrawn = count;
          break;
      }
    }

    return distribution;
  }

  /**
   * Get upcoming deadlines
   * Jobs with application deadlines in the next N days
   */
  async getUpcomingDeadlines(
    userId: string,
    limit: number = 15
  ): Promise<UpcomingDeadline[]> {
    const now = new Date();

    const jobs = await prisma.$queryRaw<
      Array<{
        job_id: string;
        title: string;
        company_name: string;
        application_deadline: Date;
        status: string;
        website?: string;
      }>
    >`
      SELECT 
        j.id as job_id,
        j.title,
        c.name as company_name,
        j.application_deadline,
        j.status
      FROM job j
      INNER JOIN company c ON j.company_id = c.id
      WHERE j.user_id = ${userId}
      AND j.application_deadline IS NOT NULL
      AND j.application_deadline > ${now}
      ORDER BY j.application_deadline ASC
      LIMIT ${limit}
    `;

    return jobs.map((job) => {
      const daysUntil = Math.ceil(
        (new Date(job.application_deadline).getTime() - now.getTime()) /
          (1000 * 60 * 60 * 24)
      );

      return {
        jobId: job.job_id,
        jobTitle: job.title,
        companyName: job.company_name,
        applicationDeadline: new Date(job.application_deadline),
        daysUntilDeadline: daysUntil,
        status: job.status,
      };
    });
  }

  /**
   * Get deadline alerts
   * Jobs with critical deadlines (< 7 days)
   */
  async getDeadlineAlerts(userId: string): Promise<DeadlineAlert[]> {
    const now = new Date();
    const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    const jobs = await prisma.$queryRaw<
      Array<{
        job_id: string;
        title: string;
        application_deadline: Date;
      }>
    >`
      SELECT 
        j.id as job_id,
        j.title,
        j.application_deadline
      FROM job j
      WHERE j.user_id = ${userId}
      AND j.application_deadline IS NOT NULL
      AND j.application_deadline > ${now}
      AND j.application_deadline <= ${sevenDaysFromNow}
      ORDER BY j.application_deadline ASC
    `;

    return jobs.map((job) => {
      const deadline = new Date(job.application_deadline);
      const daysRemaining = Math.ceil(
        (deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
      );

      let urgency: 'critical' | 'high' | 'medium' | 'low' = 'low';
      if (daysRemaining <= 1) urgency = 'critical';
      else if (daysRemaining <= 3) urgency = 'high';
      else if (daysRemaining <= 5) urgency = 'medium';

      return {
        urgency,
        jobId: job.job_id,
        jobTitle: job.title,
        daysRemaining,
        deadline,
      };
    });
  }

  /**
   * Get recent jobs
   * Latest jobs added by user
   */
  async getRecentJobs(
    userId: string,
    limit: number = 15
  ): Promise<RecentJob[]> {
    const jobs = await prisma.$queryRaw<
      Array<{
        job_id: string;
        title: string;
        company_id: string;
        company_name: string;
        status: string;
        created_at: Date;
        application_deadline: Date | null;
        location?: string;
        work_mode?: string;
      }>
    >`
      SELECT 
        j.id as job_id,
        j.title,
        j.company_id,
        c.name as company_name,
        j.status,
        j.created_at,
        j.application_deadline,
        j.location,
        j.work_mode
      FROM job j
      INNER JOIN company c ON j.company_id = c.id
      WHERE j.user_id = ${userId}
      ORDER BY j.created_at DESC
      LIMIT ${limit}
    `;

    return jobs.map((job) => ({
      jobId: job.job_id,
      jobTitle: job.title,
      companyId: job.company_id,
      companyName: job.company_name,
      status: job.status,
      createdAt: new Date(job.created_at),
      applicationDeadline: job.application_deadline
        ? new Date(job.application_deadline)
        : null,
      location: job.location,
      workMode: job.work_mode,
    }));
  }

  /**
   * Get job trends (daily count over N days)
   */
  async getJobTrends(
    userId: string,
    days: number = 30
  ): Promise<
    Array<{
      date: Date;
      count: number;
      status: string;
    }>
  > {
    const fromDate = new Date();
    fromDate.setDate(fromDate.getDate() - days);

    const result = await prisma.$queryRaw<
      Array<{
        trend_date: Date;
        count: bigint;
        status: string;
      }>
    >`
      SELECT 
        DATE(j.created_at) as trend_date,
        j.status,
        COUNT(*)::bigint as count
      FROM job j
      WHERE j.user_id = ${userId}
      AND j.created_at >= ${fromDate}
      GROUP BY DATE(j.created_at), j.status
      ORDER BY trend_date DESC, status
    `;

    return result.map((row) => ({
      date: new Date(row.trend_date),
      count: Number(row.count),
      status: row.status,
    }));
  }

  /**
   * Get job analytics
   * Time-based metrics and conversion rates
   */
  async getJobAnalytics(userId: string): Promise<JobAnalytics> {
    // Get average time to each stage
    const timeMetrics = await prisma.$queryRaw<
      Array<{
        metric: string;
        days: number;
      }>
    >`
      SELECT 
        'time_to_apply' as metric,
        ROUND(AVG(EXTRACT(DAY FROM (
          CASE 
            WHEN j.status IN ('APPLIED', 'SHORTLISTED', 'INTERVIEW', 'ASSESSMENT', 'OFFER', 'REJECTED', 'WITHDRAWN')
            THEN j.updated_at - j.created_at
            ELSE NULL
          END
        ))))::integer as days
      FROM job j
      WHERE j.user_id = ${userId}
      
      UNION ALL
      
      SELECT 
        'time_to_interview' as metric,
        ROUND(AVG(EXTRACT(DAY FROM (
          CASE 
            WHEN j.status IN ('INTERVIEW', 'ASSESSMENT', 'OFFER', 'REJECTED')
            THEN j.updated_at - j.created_at
            ELSE NULL
          END
        ))))::integer as days
      FROM job j
      WHERE j.user_id = ${userId}
      
      UNION ALL
      
      SELECT 
        'time_to_offer' as metric,
        ROUND(AVG(EXTRACT(DAY FROM (
          CASE 
            WHEN j.status IN ('OFFER', 'REJECTED')
            THEN j.updated_at - j.created_at
            ELSE NULL
          END
        ))))::integer as days
      FROM job j
      WHERE j.user_id = ${userId}
    `;

    // Get conversion rates
    const rates = await prisma.$queryRaw<
      Array<{
        metric: string;
        rate: number;
      }>
    >`
      SELECT 
        'offer_rate' as metric,
        ROUND((COUNT(CASE WHEN status = 'OFFER' THEN 1 END)::float / 
               NULLIF(COUNT(*), 0) * 100)::numeric, 2)::float as rate
      FROM job
      WHERE user_id = ${userId}
      
      UNION ALL
      
      SELECT 
        'interview_rate' as metric,
        ROUND((COUNT(CASE WHEN status IN ('INTERVIEW', 'ASSESSMENT', 'OFFER') THEN 1 END)::float / 
               NULLIF(COUNT(*), 0) * 100)::numeric, 2)::float as rate
      FROM job
      WHERE user_id = ${userId}
      
      UNION ALL
      
      SELECT 
        'reject_rate' as metric,
        ROUND((COUNT(CASE WHEN status = 'REJECTED' THEN 1 END)::float / 
               NULLIF(COUNT(*), 0) * 100)::numeric, 2)::float as rate
      FROM job
      WHERE user_id = ${userId}
    `;

    let avgTimeToApply = 0;
    let avgTimeToInterview = 0;
    let avgTimeToOffer = 0;
    let offerRate = 0;
    let interviewRate = 0;
    let rejectRate = 0;

    for (const metric of timeMetrics) {
      if (metric.metric === 'time_to_apply') avgTimeToApply = metric.days;
      if (metric.metric === 'time_to_interview')
        avgTimeToInterview = metric.days;
      if (metric.metric === 'time_to_offer') avgTimeToOffer = metric.days;
    }

    for (const rate of rates) {
      if (rate.metric === 'offer_rate') offerRate = rate.rate;
      if (rate.metric === 'interview_rate') interviewRate = rate.rate;
      if (rate.metric === 'reject_rate') rejectRate = rate.rate;
    }

    return {
      avgTimeToApply,
      avgTimeToInterview,
      avgTimeToOffer,
      offerRate,
      interviewRate,
      rejectRate,
    };
  }

  /**
   * Get company statistics
   * How many jobs from each company
   */
  async getCompanyStats(userId: string): Promise<CompanyStats[]> {
    const result = await prisma.$queryRaw<
      Array<{
        company_id: string;
        company_name: string;
        total_jobs: bigint;
        applied_jobs: bigint;
        offers: bigint;
        rejections: bigint;
      }>
    >`
      SELECT 
        c.id as company_id,
        c.name as company_name,
        COUNT(*)::bigint as total_jobs,
        COUNT(CASE WHEN j.status IN ('APPLIED', 'SHORTLISTED', 'INTERVIEW', 'ASSESSMENT') THEN 1 END)::bigint as applied_jobs,
        COUNT(CASE WHEN j.status = 'OFFER' THEN 1 END)::bigint as offers,
        COUNT(CASE WHEN j.status = 'REJECTED' THEN 1 END)::bigint as rejections
      FROM company c
      LEFT JOIN job j ON c.id = j.company_id AND j.user_id = ${userId}
      WHERE c.id IN (
        SELECT DISTINCT company_id FROM job WHERE user_id = ${userId}
      )
      GROUP BY c.id, c.name
      ORDER BY total_jobs DESC
    `;

    return result.map((row) => ({
      companyId: row.company_id,
      companyName: row.company_name,
      totalJobs: Number(row.total_jobs),
      appliedJobs: Number(row.applied_jobs),
      offers: Number(row.offers),
      rejections: Number(row.rejections),
    }));
  }

  /**
   * Get complete dashboard overview
   * Combines all dashboard data
   */
  async getDashboardOverview(
    options: DashboardQueryOptions
  ): Promise<DashboardOverview> {
    const startTime = Date.now();

    const [
      stats,
      statusDistribution,
      upcomingDeadlines,
      recentJobs,
      jobTrends,
    ] = await Promise.all([
      this.getQuickStats(options.userId),
      this.getStatusDistribution(options.userId),
      options.includeUpcomingDeadlines !== false
        ? this.getUpcomingDeadlines(
            options.userId,
            options.upcomingDeadlinesLimit || 5
          )
        : Promise.resolve([]),
      options.includeRecentJobs !== false
        ? this.getRecentJobs(options.userId, options.recentJobsLimit || 5)
        : Promise.resolve([]),
      options.includeTrends !== false
        ? this.getJobTrends(options.userId, options.trendDays || 30)
        : Promise.resolve([]),
    ]);

    return {
      stats,
      statusDistribution,
      upcomingDeadlines,
      recentJobs,
      jobTrends,
    };
  }

  /**
   * Get status distribution with percentages
   */
  async getStatusDistributionWithPercentages(
    userId: string
  ): Promise<JobStatusStats[]> {
    const distribution = await this.getStatusDistribution(userId);
    const total = distribution.total || 1;

    return [
      {
        status: 'SAVED',
        count: distribution.saved,
        percentage: (distribution.saved / total) * 100,
      },
      {
        status: 'APPLIED',
        count: distribution.applied,
        percentage: (distribution.applied / total) * 100,
      },
      {
        status: 'SHORTLISTED',
        count: distribution.shortlisted,
        percentage: (distribution.shortlisted / total) * 100,
      },
      {
        status: 'INTERVIEW',
        count: distribution.interview,
        percentage: (distribution.interview / total) * 100,
      },
      {
        status: 'ASSESSMENT',
        count: distribution.assessment,
        percentage: (distribution.assessment / total) * 100,
      },
      {
        status: 'OFFER',
        count: distribution.offer,
        percentage: (distribution.offer / total) * 100,
      },
      {
        status: 'REJECTED',
        count: distribution.rejected,
        percentage: (distribution.rejected / total) * 100,
      },
      {
        status: 'WITHDRAWN',
        count: distribution.withdrawn,
        percentage: (distribution.withdrawn / total) * 100,
      },
    ].filter((s) => s.count > 0);
  }

  /**
   * Get jobs by status
   */
  async getJobsByStatus(
    userId: string,
    status: string,
    limit: number = 50,
    offset: number = 0
  ): Promise<RecentJob[]> {
    const jobs = await prisma.$queryRaw<
      Array<{
        job_id: string;
        title: string;
        company_id: string;
        company_name: string;
        status: string;
        created_at: Date;
        application_deadline: Date | null;
        location?: string;
        work_mode?: string;
      }>
    >`
      SELECT 
        j.id as job_id,
        j.title,
        j.company_id,
        c.name as company_name,
        j.status,
        j.created_at,
        j.application_deadline,
        j.location,
        j.work_mode
      FROM job j
      INNER JOIN company c ON j.company_id = c.id
      WHERE j.user_id = ${userId}
      AND j.status = ${status}
      ORDER BY j.created_at DESC
      LIMIT ${limit}
      OFFSET ${offset}
    `;

    return jobs.map((job) => ({
      jobId: job.job_id,
      jobTitle: job.title,
      companyId: job.company_id,
      companyName: job.company_name,
      status: job.status,
      createdAt: new Date(job.created_at),
      applicationDeadline: job.application_deadline
        ? new Date(job.application_deadline)
        : null,
      location: job.location,
      workMode: job.work_mode,
    }));
  }

  /**
   * Count jobs by status
   */
  async countJobsByStatus(userId: string, status: string): Promise<number> {
    const result = await prisma.$queryRaw<Array<{ count: bigint }>>`
      SELECT COUNT(*)::bigint as count
      FROM job
      WHERE user_id = ${userId}
      AND status = ${status}
    `;

    return Number(result[0]?.count || 0);
  }

  /**
   * Search jobs with filters
   */
  async searchJobs(
    userId: string,
    options: {
      searchTerm?: string;
      status?: string;
      companyId?: string;
      fromDate?: Date;
      toDate?: Date;
      limit?: number;
      offset?: number;
    }
  ): Promise<RecentJob[]> {
    let query = `
      SELECT 
        j.id as job_id,
        j.title,
        j.company_id,
        c.name as company_name,
        j.status,
        j.created_at,
        j.application_deadline,
        j.location,
        j.work_mode
      FROM job j
      INNER JOIN company c ON j.company_id = c.id
      WHERE j.user_id = $1
    `;

    const params: any[] = [userId];
    let paramCount = 2;

    if (options.searchTerm) {
      query += ` AND (j.title ILIKE $${paramCount} OR c.name ILIKE $${paramCount})`;
      params.push(`%${options.searchTerm}%`);
      paramCount++;
    }

    if (options.status) {
      query += ` AND j.status = $${paramCount}`;
      params.push(options.status);
      paramCount++;
    }

    if (options.companyId) {
      query += ` AND j.company_id = $${paramCount}`;
      params.push(options.companyId);
      paramCount++;
    }

    if (options.fromDate) {
      query += ` AND j.created_at >= $${paramCount}`;
      params.push(options.fromDate);
      paramCount++;
    }

    if (options.toDate) {
      query += ` AND j.created_at <= $${paramCount}`;
      params.push(options.toDate);
      paramCount++;
    }

    query += ` ORDER BY j.created_at DESC`;

    if (options.limit) {
      query += ` LIMIT $${paramCount}`;
      params.push(options.limit);
      paramCount++;
    }

    if (options.offset) {
      query += ` OFFSET $${paramCount}`;
      params.push(options.offset);
    }

    const jobs = await prisma.$queryRaw<
      Array<{
        job_id: string;
        title: string;
        company_id: string;
        company_name: string;
        status: string;
        created_at: Date;
        application_deadline: Date | null;
        location?: string;
        work_mode?: string;
      }>
    >(Prisma.raw(query, ...params));

    return jobs.map((job) => ({
      jobId: job.job_id,
      jobTitle: job.title,
      companyId: job.company_id,
      companyName: job.company_name,
      status: job.status,
      createdAt: new Date(job.created_at),
      applicationDeadline: job.application_deadline
        ? new Date(job.application_deadline)
        : null,
      location: job.location,
      workMode: job.work_mode,
    }));
  }
}

/**
 * Get dashboard service instance
 */
export function getDashboardService(): DashboardQueryService {
  return DashboardQueryService.getInstance();
}
