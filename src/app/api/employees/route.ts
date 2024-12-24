import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

import * as mutations from '@/lib/api/employees/mutations';
import * as schema from '@/lib/db/schema/employees';

export async function POST(req: Request) {
  try {
    const validatedData = schema.insertEmployeeParams.parse(await req.json());
    const { employee } = await mutations.createEmployee(validatedData);

    revalidatePath('/employees'); // optional - assumes you will have named route same as entity

    return NextResponse.json(employee, { status: 201 });
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

    const validatedData = schema.updateEmployeeParams.parse(await req.json());
    const validatedParams = schema.employeeIdSchema.parse({ id });

    const { employee } = await mutations.updateEmployee(validatedParams.id, validatedData);

    return NextResponse.json(employee, { status: 200 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues }, { status: 400 });
    } else {
      return NextResponse.json({ error: err }, { status: 500 });
    }
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    const validatedParams = schema.employeeIdSchema.parse({ id });
    const { employee } = await mutations.deleteEmployee(validatedParams.id);

    return NextResponse.json(employee, { status: 200 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues }, { status: 400 });
    } else {
      return NextResponse.json({ error: err }, { status: 500 });
    }
  }
}
