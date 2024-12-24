import * as z from 'zod';
import { CompletePerformanceReview, relatedPerformanceReviewSchema } from './index';

export const employeeSchema = z.object({
  id: z.string(),
  lastName: z.string().nullish(),
  firstName: z.string(),
  email: z.string(),
  role: z.string().nullish(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export interface CompleteEmployee extends z.infer<typeof employeeSchema> {
  performanceReviews: CompletePerformanceReview[];
  assignedReviews: CompletePerformanceReview[];
}

/**
 * relatedEmployeeSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedEmployeeSchema: z.ZodSchema<CompleteEmployee> = z.lazy(() =>
  employeeSchema.extend({
    performanceReviews: relatedPerformanceReviewSchema.array(),
    assignedReviews: relatedPerformanceReviewSchema.array(),
  }),
);
