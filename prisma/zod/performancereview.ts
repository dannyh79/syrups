import * as z from 'zod';
import { CompleteEmployee, relatedEmployeeSchema } from './index';

export const performanceReviewSchema = z.object({
  id: z.string(),
  employeeId: z.string(),
  assigneeId: z.string(),
  submittedAt: z.date(),
  feedback: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export interface CompletePerformanceReview extends z.infer<typeof performanceReviewSchema> {
  employee: CompleteEmployee;
  assignee: CompleteEmployee;
}

/**
 * relatedPerformanceReviewSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedPerformanceReviewSchema: z.ZodSchema<CompletePerformanceReview> = z.lazy(() =>
  performanceReviewSchema.extend({
    employee: relatedEmployeeSchema,
    assignee: relatedEmployeeSchema,
  }),
);
