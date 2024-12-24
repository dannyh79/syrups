import { NextResponse } from 'next/server';
import { z } from 'zod';
import * as schema from '@/lib/db/schema/performanceReviews';
import * as mutations from '@/lib/api/performanceReviews/mutations';
import { POST, PUT } from './route';

vi.mock('next/server', () => ({
  NextResponse: {
    json: vi.fn((data, { status }) => ({ data, status })),
  },
}));

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}));

vi.mock('@/lib/api/performanceReviews/mutations', () => ({
  createPerformanceReview: vi.fn(),
  updatePerformanceReview: vi.fn(),
}));

afterEach(() => {
  vi.restoreAllMocks();
});

describe('POST()', () => {
  const validPerformanceReviewData = {
    submittedAt: new Date(),
    feedback: 'Some feedback.',
    employeeId: mockEmployee1.id,
    assigneeId: mockEmployee2.id,
  };

  const mockCreatedPerformanceReview = {
    id: 'cm4zskw1q00002q4jo2vf8p00',
    ...validPerformanceReviewData,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  it('creates a performance review and returns 201', async () => {
    vi.mocked(mutations.createPerformanceReview).mockResolvedValue({
      performanceReview: mockCreatedPerformanceReview,
    });

    const req = {
      json: vi.fn().mockResolvedValue(validPerformanceReviewData),
    } as unknown as Request;
    await POST(req);

    expect(mutations.createPerformanceReview).toHaveBeenCalledWith(validPerformanceReviewData);
    expect(NextResponse.json).toHaveBeenCalledWith(mockCreatedPerformanceReview, { status: 201 });
  });

  it('returns 400 for data validation issue', async () => {
    const error = new z.ZodError([
      { message: 'Name is required', path: ['name'], code: 'not_finite' },
    ]);
    vi.spyOn(schema.insertPerformanceReviewParams, 'parse').mockImplementation(() => {
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
    vi.mocked(mutations.createPerformanceReview).mockRejectedValue(errorMessage);

    const req = {
      json: vi.fn().mockResolvedValue(validPerformanceReviewData),
    } as unknown as Request;
    await POST(req);

    expect(NextResponse.json).toHaveBeenCalledWith({ error: errorMessage }, { status: 500 });
  });
});

describe('PUT', () => {
  const performanceReviewParams: schema.UpdatePerformanceReviewParams = {
    id: mockPerformanceReview.id,
    submittedAt: mockPerformanceReview.submittedAt,
    feedback: mockPerformanceReview.feedback,
    employeeId: mockEmployee1.id,
    assigneeId: mockEmployee2.id,
  };

  it('updates a performance review and returns 200', async () => {
    vi.mocked(mutations.updatePerformanceReview).mockResolvedValue({
      performanceReview: mockPerformanceReview,
    });

    const req = {
      url: `http://localhost/api/performance-reviews?id=${mockPerformanceReview.id}`,
      json: vi.fn().mockResolvedValue(performanceReviewParams),
    } as unknown as Request;
    await PUT(req);

    expect(mutations.updatePerformanceReview).toHaveBeenCalledWith(
      mockPerformanceReview.id,
      performanceReviewParams,
    );
    expect(NextResponse.json).toHaveBeenCalledWith(mockPerformanceReview, { status: 200 });
  });

  it('returns 400 for invalid query params', async () => {
    const req = {
      url: 'http://localhost/api/performance-reviews',
      json: vi.fn().mockResolvedValue(performanceReviewParams),
    } as unknown as Request;

    const error = new z.ZodError([{ message: 'Invalid ID', path: ['id'], code: 'not_finite' }]);
    vi.spyOn(schema.updatePerformanceReviewParams, 'parse').mockImplementation(() => {
      throw error;
    });
    await PUT(req);

    expect(NextResponse.json).toHaveBeenCalledWith({ error: error.issues }, { status: 400 });
  });

  it('returns 500 for unexpected errors', async () => {
    const errorMessage = 'Unexpected error.';
    vi.mocked(mutations.updatePerformanceReview).mockRejectedValue(errorMessage);

    const req = {
      url: `http://localhost/api/performance-reviews?id=${mockPerformanceReview.id}`,
      json: vi.fn().mockResolvedValue(performanceReviewParams),
    } as unknown as Request;
    await PUT(req);

    expect(NextResponse.json).toHaveBeenCalledWith({ error: errorMessage }, { status: 500 });
  });
});

const mockEmployee1 = {
  id: 'cm4zskw1q00002q4jo2vf8p00',
  firstName: 'John',
  lastName: 'Doe',
  email: 'jdoe@example.com',
  role: '',
  createdAt: new Date('2024-12-22T15:57:39.518Z'),
  updatedAt: new Date('2024-12-22T15:57:39.518Z'),
};

const mockEmployee2 = {
  id: 'cm4zsla8200012q4j963n4gn0',
  firstName: 'Jane',
  lastName: 'Doe',
  email: 'janedoe@example.com',
  role: '',
  createdAt: new Date('2024-12-22T15:57:39.518Z'),
  updatedAt: new Date('2024-12-22T15:57:39.518Z'),
};

const mockPerformanceReview = {
  id: 'cm52qujk500032q00utlpa2mj',
  submittedAt: new Date('2024-12-23T14:57:39.518Z'),
  feedback: 'Some feedback.',
  employeeId: mockEmployee1.id,
  assigneeId: mockEmployee2.id,
  createdAt: new Date('2024-12-23T15:57:39.518Z'),
  updatedAt: new Date('2024-12-23T15:57:39.518Z'),
};
