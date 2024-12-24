import { db } from '@/__mocks__/db';
import { getEmployeeById, getEmployees } from './queries';

describe('getEmployees()', () => {
  beforeEach(() => {
    db.employee.findMany.mockResolvedValue([mockEmployee]);
  });

  it('returns employees', async () => {
    const result = await getEmployees();
    expect(result).toEqual({ employees: [mockEmployee] });
  });
});

describe('getEmployeeById()', () => {
  beforeEach(() => {
    db.employee.findFirst = vi.fn((args) => {
      if (args?.where?.id === 'cm4zskw1q00002q4jo2vf8p00') {
        return Promise.resolve(mockEmployee);
      }
      return Promise.resolve(null);
    }) as typeof db.employee.findFirst;
  });

  it('returns an employee', async () => {
    const result = await getEmployeeById('cm4zskw1q00002q4jo2vf8p00');
    expect(result).toEqual({ employee: mockEmployee });
  });

  it('returns { employee: undefined } if none found', async () => {
    const result = await getEmployeeById('cm4zsla8200012q4j963n4gn0');
    expect(result).toEqual({ employee: null });
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
