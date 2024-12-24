import { db } from '@/lib/db/index';
import * as schema from '@/lib/db/schema/employees';

export const getEmployees = async () => {
  const e = await db.employee.findMany({});
  return { employees: e };
};

export const getEmployeeById = async (id: schema.EmployeeId) => {
  const { id: employeeId } = schema.employeeIdSchema.parse({ id });
  const e = await db.employee.findFirst({
    where: { id: employeeId },
  });
  return { employee: e };
};
