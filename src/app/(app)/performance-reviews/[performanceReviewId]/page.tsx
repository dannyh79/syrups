import { Suspense } from 'react';
import { notFound } from 'next/navigation';

import { getPerformanceReviewById } from '@/lib/api/performanceReviews/queries';
import { getEmployees } from '@/lib/api/employees/queries';
import OptimisticPerformanceReview from './OptimisticPerformanceReview';
import { checkAuth } from '@/lib/auth/utils';

import { BackButton } from '@/components/shared/BackButton';
import Loading from '@/app/loading';

export const revalidate = 0;

export default async function PerformanceReviewPage(props: {
  params: Promise<{ performanceReviewId: string }>;
}) {
  const params = await props.params;
  return (
    <main className="overflow-auto">
      <PerformanceReview id={params.performanceReviewId} />
    </main>
  );
}

const PerformanceReview = async ({ id }: { id: string }) => {
  await checkAuth();

  const { performanceReview } = await getPerformanceReviewById(id);
  const { employees } = await getEmployees();

  if (!performanceReview) notFound();
  return (
    <Suspense fallback={<Loading />}>
      <div className="relative">
        <BackButton currentResource="performance-reviews" />
        <OptimisticPerformanceReview performanceReview={performanceReview} employees={employees} />
      </div>
    </Suspense>
  );
};
