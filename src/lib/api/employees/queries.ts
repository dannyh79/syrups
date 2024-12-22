import { db } from '@/lib/db/index';
import { type EmployeeId, employeeIdSchema } from '@/lib/db/schema/employees';

export const getEmployees = async () => {
  const e = await db.employee.findMany({});
  return { employees: e };
};

export const getEmployeeById = async (id: EmployeeId) => {
  const { id: employeeId } = employeeIdSchema.parse({ id });
  const e = await db.employee.findFirst({
    where: { id: employeeId },
  });
  return { employee: e };
};
