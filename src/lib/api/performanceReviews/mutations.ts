import { db } from '@/lib/db/index';
import * as schema from '@/lib/db/schema/performanceReviews';

export const createPerformanceReview = async (
  performanceReview: schema.NewPerformanceReviewParams,
) => {
  const newPerformanceReview = schema.insertPerformanceReviewSchema.parse({
    ...performanceReview,
  });
  try {
    const p = await db.performanceReview.create({ data: newPerformanceReview });
    return { performanceReview: p };
  } catch (err) {
    const message = (err as Error).message ?? 'Error, please try again';
    console.error(message);
    throw { error: message };
  }
};

export const updatePerformanceReview = async (
  id: schema.PerformanceReviewId,
  performanceReview: schema.UpdatePerformanceReviewParams,
) => {
  const { id: performanceReviewId } = schema.performanceReviewIdSchema.parse({ id });
  const newPerformanceReview = schema.updatePerformanceReviewSchema.parse({
    ...performanceReview,
  });
  try {
    const p = await db.performanceReview.update({
      where: { id: performanceReviewId },
      data: newPerformanceReview,
    });
    return { performanceReview: p };
  } catch (err) {
    const message = (err as Error).message ?? 'Error, please try again';
    console.error(message);
    throw { error: message };
  }
};
