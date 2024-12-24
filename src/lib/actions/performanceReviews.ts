'use server';

import { revalidatePath } from 'next/cache';
import * as mutations from '@/lib/api/performanceReviews/mutations';
import * as schema from '@/lib/db/schema/performanceReviews';

const handleErrors = (e: unknown) => {
  const errMsg = 'Error, please try again.';
  if (e instanceof Error) return e.message.length > 0 ? e.message : errMsg;
  if (e && typeof e === 'object' && 'error' in e) {
    const errAsStr = e.error as string;
    return errAsStr.length > 0 ? errAsStr : errMsg;
  }
  return errMsg;
};

const revalidatePerformanceReviews = () => revalidatePath('/performance-reviews');

export const createPerformanceReviewAction = async (input: schema.NewPerformanceReviewParams) => {
  try {
    const payload = schema.insertPerformanceReviewParams.parse(input);
    await mutations.createPerformanceReview(payload);
    revalidatePerformanceReviews();
  } catch (e) {
    return handleErrors(e);
  }
};

export const updatePerformanceReviewAction = async (
  input: schema.UpdatePerformanceReviewParams,
) => {
  try {
    const payload = schema.updatePerformanceReviewParams.parse(input);
    await mutations.updatePerformanceReview(payload.id, payload);
    revalidatePerformanceReviews();
  } catch (e) {
    return handleErrors(e);
  }
};

export const deletePerformanceReviewAction = async (input: schema.PerformanceReviewId) => {
  try {
    const payload = schema.performanceReviewIdSchema.parse({ id: input });
    await mutations.deletePerformanceReview(payload.id);
    revalidatePerformanceReviews();
  } catch (e) {
    return handleErrors(e);
  }
};
