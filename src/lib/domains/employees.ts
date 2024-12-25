import { Employee } from '@/lib/db/schema/employees';

export const toFullName = (e?: Pick<Employee, 'lastName' | 'firstName'>) =>
  e?.lastName ? [e.lastName, e.firstName].join(', ') : e?.firstName;
