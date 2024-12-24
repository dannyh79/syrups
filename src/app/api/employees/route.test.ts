import { NextResponse } from 'next/server';
import { z } from 'zod';
import * as schema from '@/lib/db/schema/employees';
import * as mutations from '@/lib/api/employees/mutations';
import { DELETE, POST, PUT } from './route';

vi.mock('next/server', () => ({
  NextResponse: {
    json: vi.fn((data, { status }) => ({ data, status })),
  },
}));

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}));

vi.mock('@/lib/api/employees/mutations', () => ({
  createEmployee: vi.fn(),
  deleteEmployee: vi.fn(),
  updateEmployee: vi.fn(),
}));

afterEach(() => {
  vi.restoreAllMocks();
});

describe('POST()', () => {
  const validEmployeeData = {
    lastName: 'Doe',
    firstName: 'John',
    email: 'jdoe@example.com',
    role: '',
  };

  const mockCreatedEmployee = {
    id: 'cm4zskw1q00002q4jo2vf8p00',
    ...validEmployeeData,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  it('creates an employee and returns 201', async () => {
    vi.mocked(mutations.createEmployee).mockResolvedValue({ employee: mockCreatedEmployee });

    const req = {
      json: vi.fn().mockResolvedValue(validEmployeeData),
    } as unknown as Request;
    await POST(req);

    expect(mutations.createEmployee).toHaveBeenCalledWith(validEmployeeData);
    expect(NextResponse.json).toHaveBeenCalledWith(mockCreatedEmployee, { status: 201 });
  });

  it('returns 400 for data validation issue', async () => {
    const error = new z.ZodError([
      { message: 'Name is required', path: ['name'], code: 'not_finite' },
    ]);
    vi.spyOn(schema.insertEmployeeParams, 'parse').mockImplementation(() => {
      throw error;
    });

    const invalidData = {};
    const req = {
      json: vi.fn().mockResolvedValue(invalidData),
    } as unknown as Request;
    await POST(req);

    expect(NextResponse.json).toHaveBeenCalledWith({ error: error.issues }, { status: 400 });
  });

  it('returns 500 for unexpected errors', async () => {
    const errorMessage = 'Unexpected error.';
    vi.mocked(mutations.createEmployee).mockRejectedValue(errorMessage);

    const req = {
      json: vi.fn().mockResolvedValue(validEmployeeData),
    } as unknown as Request;
    await POST(req);

    expect(NextResponse.json).toHaveBeenCalledWith({ error: errorMessage }, { status: 500 });
  });
});

describe('PUT', () => {
  const employeeParams: schema.UpdateEmployeeParams = {
    id: mockEmployee.id,
    firstName: mockEmployee.firstName,
    lastName: mockEmployee.lastName,
    email: mockEmployee.email,
    role: mockEmployee.role,
  };

  it('updates an employee and returns 200', async () => {
    vi.mocked(mutations.updateEmployee).mockResolvedValue({ employee: mockEmployee });

    const req = {
      url: `http://localhost/api/employees?id=${mockEmployee.id}`,
      json: vi.fn().mockResolvedValue(employeeParams),
    } as unknown as Request;
    await PUT(req);

    expect(mutations.updateEmployee).toHaveBeenCalledWith(mockEmployee.id, employeeParams);
    expect(NextResponse.json).toHaveBeenCalledWith(mockEmployee, { status: 200 });
  });

  it('returns 400 for invalid query params', async () => {
    const req = {
      url: 'http://localhost/api/employees',
      json: vi.fn().mockResolvedValue(employeeParams),
    } as unknown as Request;

    const error = new z.ZodError([{ message: 'Invalid ID', path: ['id'], code: 'not_finite' }]);
    vi.spyOn(schema.updateEmployeeParams, 'parse').mockImplementation(() => {
      throw error;
    });
    await PUT(req);

    expect(NextResponse.json).toHaveBeenCalledWith({ error: error.issues }, { status: 400 });
  });

  it('returns 500 for unexpected errors', async () => {
    const errorMessage = 'Unexpected error.';
    vi.mocked(mutations.updateEmployee).mockRejectedValue(errorMessage);

    const req = {
      url: `http://localhost/api/employees?id=${mockEmployee.id}`,
      json: vi.fn().mockResolvedValue(employeeParams),
    } as unknown as Request;
    await PUT(req);

    expect(NextResponse.json).toHaveBeenCalledWith({ error: errorMessage }, { status: 500 });
  });
});

describe('DELETE', () => {
  it('deletes an employee and returns 200', async () => {
    vi.mocked(mutations.deleteEmployee).mockResolvedValue({ employee: mockEmployee });

    const req = {
      url: `http://localhost/api/employees?id=${mockEmployee.id}`,
    } as unknown as Request;
    await DELETE(req);

    expect(mutations.deleteEmployee).toHaveBeenCalledWith(mockEmployee.id);
    expect(NextResponse.json).toHaveBeenCalledWith(mockEmployee, { status: 200 });
  });

  it('returns 400 for invalid query params', async () => {
    const req = {
      url: 'http://localhost/api/employees',
    } as unknown as Request;

    const error = new z.ZodError([{ message: 'Invalid ID', path: ['id'], code: 'not_finite' }]);
    vi.spyOn(schema.employeeIdSchema, 'parse').mockImplementation(() => {
      throw error;
    });
    await DELETE(req);

    expect(NextResponse.json).toHaveBeenCalledWith({ error: error.issues }, { status: 400 });
  });

  it('returns 500 for unexpected errors', async () => {
    const errorMessage = 'Unexpected error.';
    vi.mocked(mutations.deleteEmployee).mockRejectedValue(errorMessage);

    const req = {
      url: `http://localhost/api/employees?id=${mockEmployee.id}`,
    } as unknown as Request;
    await DELETE(req);

    expect(NextResponse.json).toHaveBeenCalledWith({ error: errorMessage }, { status: 500 });
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
