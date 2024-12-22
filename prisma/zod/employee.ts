import * as z from 'zod';

export const employeeSchema = z.object({
  id: z.string(),
  lastName: z.string().nullish(),
  firstName: z.string(),
  role: z.string().nullish(),
  createdAt: z.date(),
  updatedAt: z.date(),
});
