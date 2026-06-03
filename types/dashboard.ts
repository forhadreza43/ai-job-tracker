/**
 * Dashboard Types
 * Data structures for dashboard queries and statistics
 */

/**
 * Job status statistics
 */
export interface JobStatusStats {
  status: string;
  count: number;
  percentage: number;
}

/**
 * Job status breakdown
 */
export interface StatusDistribution {
  saved: number;
  applied: number;
  shortlisted: number;
  interview: number;
  assessment: number;
  offer: number;
  rejected: number;
  withdrawn: number;
  total: number;
}

/**
 * Quick statistics
 */
export interface QuickStats {
  totalJobs: number;
  savedJobs: number;
  appliedJobs: number;
  interviewJobs: number;
  offerJobs: number;
  rejectedJobs: number;
  bookmarkedJobs: number;
}

/**
 * Upcoming deadline
 */
export interface UpcomingDeadline {
  jobId: string;
  jobTitle: string;
  companyName: string;
  applicationDeadline: Date;
  daysUntilDeadline: number;
  status: string;
  companyLogo?: string;
}

/**
 * Recent job
 */
export interface RecentJob {
  jobId: string;
  jobTitle: string;
  companyName: string;
  companyId: string;
  status: string;
  createdAt: Date;
  applicationDeadline: Date | null;
  location?: string;
  workMode?: string;
}

/**
 * Job trend data point
 */
export interface JobTrendPoint {
  date: Date;
  count: number;
  status: string;
}

/**
 * Dashboard overview
 */
export interface DashboardOverview {
  stats: QuickStats;
  statusDistribution: StatusDistribution;
  upcomingDeadlines: UpcomingDeadline[];
  recentJobs: RecentJob[];
  jobTrends: JobTrendPoint[];
}

/**
 * Deadline alert
 */
export interface DeadlineAlert {
  urgency: 'critical' | 'high' | 'medium' | 'low';
  jobId: string;
  jobTitle: string;
  daysRemaining: number;
  deadline: Date;
}

/**
 * Job summary for analytics
 */
export interface JobAnalytics {
  averageTimeToApply: number; // days
  averageTimeToInterview: number;
  averageTimeToOffer: number;
  offerRate: number; // percentage
  interviewRate: number;
  rejectRate: number;
}

/**
 * Company statistics
 */
export interface CompanyStats {
  companyId: string;
  companyName: string;
  totalJobs: number;
  appliedJobs: number;
  offers: number;
  rejections: number;
}

/**
 * Dashboard query options
 */
export interface DashboardQueryOptions {
  userId: string;
  includeUpcomingDeadlines?: boolean;
  upcomingDeadlinesLimit?: number;
  includeRecentJobs?: boolean;
  recentJobsLimit?: number;
  includeTrends?: boolean;
  trendDays?: number;
  includeAnalytics?: boolean;
}

/**
 * Dashboard cache entry
 */
export interface DashboardCache {
  userId: string;
  data: DashboardOverview;
  timestamp: number;
  ttl: number;
}

/**
 * Query performance metrics
 */
export interface QueryMetrics {
  queryTime: number; // milliseconds
  cached: boolean;
  queryCount: number;
}
