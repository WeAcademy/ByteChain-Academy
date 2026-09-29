import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';

export interface AdminOverview {
  total_users: number;
  total_courses: number;
  total_enrollments: number;
  certificates_issued: number;
}

export interface LearnerActivityPoint {
  date: string;
  active_users: number;
}

export interface CoursePerformance {
  course_id: string;
  title: string;
  enrollments: number;
  completion_rate?: number;
}

export interface TopLearner {
  user_id: string;
  name: string;
  email?: string;
  enrollments: number;
  certificates: number;
}

async function fetchOverview(): Promise<AdminOverview> {
  const { data } = await apiClient.get<AdminOverview>('/admin/analytics/overview');
  return data;
}

async function fetchLearnerActivity(): Promise<LearnerActivityPoint[]> {
  const { data } = await apiClient.get<LearnerActivityPoint[]>(
    '/admin/analytics/learner-activity'
  );
  return data;
}

async function fetchCoursePerformance(): Promise<CoursePerformance[]> {
  const { data } = await apiClient.get<CoursePerformance[]>(
    '/admin/analytics/course-performance'
  );
  return data;
}

async function fetchTopLearners(): Promise<TopLearner[]> {
  const { data } = await apiClient.get<TopLearner[]>('/admin/analytics/top-learners');
  return data;
}

export function useAdminAnalytics() {
  const overview = useQuery({
    queryKey: ['admin', 'analytics', 'overview'],
    queryFn: fetchOverview,
  });

  const learnerActivity = useQuery({
    queryKey: ['admin', 'analytics', 'learner-activity'],
    queryFn: fetchLearnerActivity,
  });

  const coursePerformance = useQuery({
    queryKey: ['admin', 'analytics', 'course-performance'],
    queryFn: fetchCoursePerformance,
  });

  const topLearners = useQuery({
    queryKey: ['admin', 'analytics', 'top-learners'],
    queryFn: fetchTopLearners,
  });

  return {
    overview,
    learnerActivity,
    coursePerformance,
    topLearners,
  };
}
