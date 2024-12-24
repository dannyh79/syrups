import { db } from '@/lib/db/index';
import * as schema from '@/lib/db/schema/performanceReviews';

export const getPerformanceReviews = async () => {
  const p = await db.performanceReview.findMany({
    include: { employee: true, assignee: true },
  });
  return { performanceReviews: p };
};

export const getPerformanceReviewById = async (id: schema.PerformanceReviewId) => {
  const { id: performanceReviewId } = schema.performanceReviewIdSchema.parse({ id });
  const p = await db.performanceReview.findFirst({
    where: { id: performanceReviewId },
    include: { employee: true, assignee: true },
  });
  return { performanceReview: p };
};
