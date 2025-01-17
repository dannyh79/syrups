'use client';

import { PlusIcon } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import * as React from 'react';

import { type Employee, CompleteEmployee } from '@/lib/db/schema/employees';

import { useOptimisticEmployees } from '@/app/(app)/employees/useOptimisticEmployees';

import { Button } from '@/components/ui/button';
import DataTable, { ColumnDef } from '@/components/shared/DataTable';
import Modal from '@/components/shared/Modal';

import EmployeeForm from './EmployeeForm';

type TOpenModal = (employee?: Employee) => void;

export default function EmployeeList({ employees }: { employees: CompleteEmployee[] }) {
  const { optimisticEmployees, addOptimisticEmployee } = useOptimisticEmployees(employees);
  const [open, setOpen] = React.useState(false);
  const [activeEmployee, setActiveEmployee] = React.useState<Employee | null>(null);
  const openModal = (employee?: Employee) => {
    setOpen(true);
    return employee ? setActiveEmployee(employee) : setActiveEmployee(null);
  };
  const closeModal = () => setOpen(false);

  return (
    <div>
      <Modal
        open={open}
        setOpen={setOpen}
        title={activeEmployee ? 'Edit Employee' : 'Create Employee'}
      >
        <EmployeeForm
          employee={activeEmployee}
          addOptimistic={addOptimisticEmployee}
          openModal={openModal}
          closeModal={closeModal}
        />
      </Modal>
      <div className="absolute right-0 top-0 ">
        <Button onClick={() => openModal()} variant={'outline'}>
          +
        </Button>
      </div>
      {optimisticEmployees.length === 0 ? (
        <EmptyState openModal={openModal} />
      ) : (
        <EmployeeDataTable data={optimisticEmployees} />
      )}
    </div>
  );
}

function EmployeeDataTable({ data }: { data: CompleteEmployee[] }) {
  const pathname = usePathname();
  const basePath = pathname.includes('employees') ? pathname : pathname + '/employees/';
  const columns = React.useMemo<ColumnDef<Employee>[]>(
    () => [
      { accessorKey: 'lastName', header: 'Last Name' },
      { accessorKey: 'firstName', header: 'First Name' },
      { accessorKey: 'email', header: 'Email' },
      {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => (
          <Button variant={'link'} asChild>
            <Link href={basePath + '/' + row.original.id}>View</Link>
          </Button>
        ),
      },
    ],
    [basePath],
  );

  return <DataTable columns={columns} data={data} />;
}

const EmptyState = ({ openModal }: { openModal: TOpenModal }) => {
  return (
    <div className="text-center">
      <h3 className="mt-2 text-sm font-semibold text-secondary-foreground">No employees</h3>
      <p className="mt-1 text-sm text-muted-foreground">Get started by creating a new employee.</p>
      <div className="mt-6">
        <Button onClick={() => openModal()}>
          <PlusIcon className="h-4" /> New Employees{' '}
        </Button>
      </div>
    </div>
  );
};
