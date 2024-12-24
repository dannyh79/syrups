import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

import * as mutations from '@/lib/api/performanceReviews/mutations';
import * as schema from '@/lib/db/schema/performanceReviews';

export async function POST(req: Request) {
  try {
    const validatedData = schema.insertPerformanceReviewParams.parse(await req.json());
    const { performanceReview } = await mutations.createPerformanceReview(validatedData);

    revalidatePath('/performanceReviews'); // optional - assumes you will have named route same as entity

    return NextResponse.json(performanceReview, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues }, { status: 400 });
    } else {
      return NextResponse.json({ error: err }, { status: 500 });
    }
  }
}

export async function PUT(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    const validatedData = schema.updatePerformanceReviewParams.parse(await req.json());
    const validatedParams = schema.performanceReviewIdSchema.parse({ id });

    const { performanceReview } = await mutations.updatePerformanceReview(
      validatedParams.id,
      validatedData,
    );

    return NextResponse.json(performanceReview, { status: 200 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues }, { status: 400 });
    } else {
      return NextResponse.json(err, { status: 500 });
    }
  }
}
