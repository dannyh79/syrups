import { Suspense } from 'react';

import Loading from '@/app/loading';
import PerformanceReviewList from '@/components/performanceReviews/PerformanceReviewList';
import { getPerformanceReviews } from '@/lib/api/performanceReviews/queries';
import { getEmployees } from '@/lib/api/employees/queries';
import { checkAuth } from '@/lib/auth/utils';

export const revalidate = 0;

export default async function PerformanceReviewsPage() {
  return (
    <main>
      <div className="relative">
        <div className="flex justify-between">
          <h1 className="font-semibold text-2xl my-2">Performance Reviews</h1>
        </div>
        <PerformanceReviews />
      </div>
    </main>
  );
}

const PerformanceReviews = async () => {
  await checkAuth();

  const { performanceReviews } = await getPerformanceReviews();
  const { employees } = await getEmployees();
  return (
    <Suspense fallback={<Loading />}>
      <PerformanceReviewList performanceReviews={performanceReviews} employees={employees} />
    </Suspense>
  );
};
