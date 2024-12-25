import { performanceReviewSchema } from '@/zodAutoGenSchemas';
import { z } from 'zod';
import { timestamps } from '@/lib/utils';
import { getPerformanceReviews } from '@/lib/api/performanceReviews/queries';

// Schema for performanceReviews - used to validate API requests
const baseSchema = performanceReviewSchema.omit(timestamps);

export const insertPerformanceReviewSchema = baseSchema.omit({ id: true });
export const insertPerformanceReviewParams = baseSchema
  .extend({
    employeeId: z.coerce.string().min(1),
    assigneeId: z.coerce.string().min(1),
  })
  .omit({
    id: true,
  });

export const updatePerformanceReviewSchema = baseSchema;
export const updatePerformanceReviewParams = updatePerformanceReviewSchema.extend({
  employeeId: z.coerce.string().min(1),
  assigneeId: z.coerce.string().min(1),
  submittedAt: z.coerce.date(),
});
export const performanceReviewIdSchema = baseSchema.pick({ id: true });

// Types for performanceReviews - used to type API request params and within Components
export type PerformanceReview = z.infer<typeof performanceReviewSchema>;
export type NewPerformanceReview = z.infer<typeof insertPerformanceReviewSchema>;
export type NewPerformanceReviewParams = z.infer<typeof insertPerformanceReviewParams>;
export type UpdatePerformanceReviewParams = z.infer<typeof updatePerformanceReviewParams>;
export type PerformanceReviewId = z.infer<typeof performanceReviewIdSchema>['id'];

// this type infers the return from getPerformanceReviews() - meaning it will include any joins
export type CompletePerformanceReview = Awaited<
  ReturnType<typeof getPerformanceReviews>
>['performanceReviews'][number];
