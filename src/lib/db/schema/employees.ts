import { employeeSchema } from '@/zodAutoGenSchemas';
import { z } from 'zod';
import { timestamps } from '@/lib/utils';
import { getEmployees } from '@/lib/api/employees/queries';

// Schema for employees - used to validate API requests
const baseSchema = employeeSchema.omit(timestamps);

export const insertEmployeeSchema = baseSchema.omit({ id: true });
export const insertEmployeeParams = baseSchema.extend({}).omit({
  id: true,
});

export const updateEmployeeSchema = baseSchema;
export const updateEmployeeParams = updateEmployeeSchema.extend({});
export const employeeIdSchema = baseSchema.pick({ id: true });

// Types for employees - used to type API request params and within Components
export type Employee = z.infer<typeof employeeSchema>;
export type NewEmployee = z.infer<typeof insertEmployeeSchema>;
export type NewEmployeeParams = z.infer<typeof insertEmployeeParams>;
export type UpdateEmployeeParams = z.infer<typeof updateEmployeeParams>;
export type EmployeeId = z.infer<typeof employeeIdSchema>['id'];

// this type infers the return from getEmployees() - meaning it will include any joins
export type CompleteEmployee = Awaited<ReturnType<typeof getEmployees>>['employees'][number];
