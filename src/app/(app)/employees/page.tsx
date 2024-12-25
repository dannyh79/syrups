import { notFound } from 'next/navigation';
import { Suspense } from 'react';

import Loading from '@/app/loading';
import EmployeeList from '@/components/employees/EmployeeList';
import { getEmployees } from '@/lib/api/employees/queries';
import { getUserAuth } from '@/lib/auth/utils';

export const revalidate = 0;

export default async function EmployeesPage() {
  const { session } = await getUserAuth();
  if (session?.user?.role !== 'admin') {
    notFound();
  }

  return (
    <main>
      <div className="relative">
        <div className="flex justify-between">
          <h1 className="font-semibold text-2xl my-2">Employees</h1>
        </div>
        <Employees />
      </div>
    </main>
  );
}

const Employees = async () => {
  const { employees } = await getEmployees();

  return (
    <Suspense fallback={<Loading />}>
      <EmployeeList employees={employees} />
    </Suspense>
  );
};
