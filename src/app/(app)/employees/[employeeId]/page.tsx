import { notFound } from 'next/navigation';
import { Suspense } from 'react';

import { getEmployeeById } from '@/lib/api/employees/queries';
import OptimisticEmployee from './OptimisticEmployee';

import { BackButton } from '@/components/shared/BackButton';
import Loading from '@/app/loading';
import { getUserAuth } from '@/lib/auth/utils';

export const revalidate = 0;

export default async function EmployeePage(props: { params: Promise<{ employeeId: string }> }) {
  const { session } = await getUserAuth();
  if (session?.user?.role !== 'admin') {
    notFound();
  }

  const params = await props.params;
  return (
    <main className="overflow-auto">
      <Employee id={params.employeeId} />
    </main>
  );
}

const Employee = async ({ id }: { id: string }) => {
  const { employee } = await getEmployeeById(id);

  if (!employee) notFound();
  return (
    <Suspense fallback={<Loading />}>
      <div className="relative">
        <BackButton currentResource="employees" />
        <OptimisticEmployee employee={employee} />
      </div>
    </Suspense>
  );
};
