import { db } from '@/lib/db/index';
import * as schema from '@/lib/db/schema/employees';

export const createEmployee = async (employee: schema.NewEmployeeParams) => {
  const newEmployee = schema.insertEmployeeSchema.parse(employee);
  try {
    const e = await db.employee.create({ data: newEmployee });
    return { employee: e };
  } catch (err) {
    const message = (err as Error).message ?? 'Error, please try again';
    console.error(message);
    throw { error: message };
  }
};

export const updateEmployee = async (
  id: schema.EmployeeId,
  employee: schema.UpdateEmployeeParams,
) => {
  const { id: employeeId } = schema.employeeIdSchema.parse({ id });
  const newEmployee = schema.updateEmployeeSchema.parse(employee);
  try {
    const e = await db.employee.update({ where: { id: employeeId }, data: newEmployee });
    return { employee: e };
  } catch (err) {
    const message = (err as Error).message ?? 'Error, please try again';
    console.error(message);
    throw { error: message };
  }
};

export const deleteEmployee = async (id: schema.EmployeeId) => {
  const { id: employeeId } = schema.employeeIdSchema.parse({ id });
  try {
    const e = await db.employee.delete({ where: { id: employeeId } });
    return { employee: e };
  } catch (err) {
    const message = (err as Error).message ?? 'Error, please try again';
    console.error(message);
    throw { error: message };
  }
};
