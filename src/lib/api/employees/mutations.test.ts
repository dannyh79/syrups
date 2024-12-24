import { db } from '@/__mocks__/db';
import { createEmployee, deleteEmployee, updateEmployee } from './mutations';
import { NewEmployeeParams, UpdateEmployeeParams } from '@/lib/db/schema/employees';

const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

describe('createEmployee()', () => {
  const employeeParams: NewEmployeeParams = {
    firstName: mockEmployee.firstName,
    lastName: mockEmployee.lastName,
    email: mockEmployee.email,
    role: mockEmployee.role,
  };

  it('returns created employee', async () => {
    db.employee.create.mockResolvedValue(mockEmployee);

    const result = await createEmployee(employeeParams);
    expect(result).toEqual({ employee: mockEmployee });
  });

  it('returns error', async () => {
    const errorMessage = 'Some error.';
    db.employee.create = vi
      .fn()
      .mockRejectedValue(new Error(errorMessage)) as typeof db.employee.create;

    await expect(createEmployee(employeeParams)).rejects.toEqual({
      error: errorMessage,
    });
    expect(consoleErrorSpy).toHaveBeenNthCalledWith(1, errorMessage);
  });
});

describe('updateEmployee()', () => {
  const employeeParams: UpdateEmployeeParams = {
    id: mockEmployee.id,
    firstName: mockEmployee.firstName,
    lastName: mockEmployee.lastName,
    email: mockEmployee.email,
    role: mockEmployee.role,
  };

  it('returns updated employee', async () => {
    db.employee.update.mockResolvedValue(mockEmployee);

    const result = await updateEmployee('cm4zskw1q00002q4jo2vf8p00', employeeParams);
    expect(result).toEqual({ employee: mockEmployee });
  });

  it('returns error', async () => {
    const errorMessage = 'Some error.';
    db.employee.update = vi
      .fn()
      .mockRejectedValue(new Error(errorMessage)) as typeof db.employee.update;

    await expect(updateEmployee('', employeeParams)).rejects.toEqual({
      error: errorMessage,
    });
    expect(consoleErrorSpy).toHaveBeenNthCalledWith(1, errorMessage);
  });
});

describe('deleteEmployee()', () => {
  it('returns deleted employee', async () => {
    db.employee.delete.mockResolvedValue(mockEmployee);

    const result = await deleteEmployee('cm4zskw1q00002q4jo2vf8p00');
    expect(result).toEqual({ employee: mockEmployee });
  });

  it('returns error', async () => {
    const errorMessage = 'Some error.';
    db.employee.delete = vi
      .fn()
      .mockRejectedValue(new Error(errorMessage)) as typeof db.employee.delete;

    await expect(deleteEmployee('')).rejects.toEqual({
      error: errorMessage,
    });
    expect(consoleErrorSpy).toHaveBeenNthCalledWith(1, errorMessage);
  });
});

const mockEmployee = {
  id: 'cm4zskw1q00002q4jo2vf8p00',
  firstName: 'John',
  lastName: 'Doe',
  email: 'jdoe@example.com',
  role: '',
  createdAt: new Date('2024-12-22T15:57:39.518Z'),
  updatedAt: new Date('2024-12-22T15:57:39.518Z'),
};
