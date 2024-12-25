'use client';

import { PlusIcon } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import * as React from 'react';

import * as domain from '@/lib/domains/';

import { type Employee, type EmployeeId } from '@/lib/db/schema/employees';
import {
  type PerformanceReview,
  CompletePerformanceReview,
} from '@/lib/db/schema/performanceReviews';

import { useOptimisticPerformanceReviews } from '@/app/(app)/performance-reviews/useOptimisticPerformanceReviews';

import { Button } from '@/components/ui/button';
import DataTable, { ColumnDef } from '@/components/shared/DataTable';
import Modal from '@/components/shared/Modal';

import PerformanceReviewForm from './PerformanceReviewForm';

type TOpenModal = (performanceReview?: PerformanceReview) => void;

export type PerformanceReviewListProps = {
  isAdmin: boolean;
  performanceReviews: CompletePerformanceReview[];
  employees: Employee[];
  employeeId?: EmployeeId;
  assigneeId?: EmployeeId;
};

export default function PerformanceReviewList({
  isAdmin,
  performanceReviews,
  employees,
  employeeId,
  assigneeId,
}: PerformanceReviewListProps) {
  const { optimisticPerformanceReviews, addOptimisticPerformanceReview } =
    useOptimisticPerformanceReviews(performanceReviews, employees);
  const [open, setOpen] = React.useState(false);
  const [activePerformanceReview, setActivePerformanceReview] =
    React.useState<PerformanceReview | null>(null);
  const openModal = (performanceReview?: PerformanceReview) => {
    setOpen(true);
    return performanceReview
      ? setActivePerformanceReview(performanceReview)
      : setActivePerformanceReview(null);
  };
  const closeModal = () => setOpen(false);

  return (
    <div>
      <Modal
        open={open}
        setOpen={setOpen}
        title={activePerformanceReview ? 'Edit PerformanceReview' : 'Create Performance Review'}
      >
        <PerformanceReviewForm
          performanceReview={activePerformanceReview}
          addOptimistic={addOptimisticPerformanceReview}
          openModal={openModal}
          closeModal={closeModal}
          employees={employees}
          employeeId={employeeId}
          assigneeId={assigneeId}
        />
      </Modal>
      {isAdmin && (
        <div className="absolute right-0 top-0">
          <Button onClick={() => openModal()} variant="outline">
            +
          </Button>
        </div>
      )}
      {optimisticPerformanceReviews.length === 0 && isAdmin ? (
        <EmptyState openModal={openModal} />
      ) : (
        <PerformanceReviewDataTable data={optimisticPerformanceReviews} employees={employees} />
      )}
    </div>
  );
}

const toDateTime = (t: Date | null | undefined, placeholder = 'N/A') =>
  t
    ? Intl.DateTimeFormat('en', {
        dateStyle: 'short',
        timeStyle: 'short',
      }).format(t)
    : placeholder;

function PerformanceReviewDataTable({
  data,
  employees,
}: {
  data: CompletePerformanceReview[];
  employees: Employee[];
}) {
  const pathname = usePathname();
  const basePath = pathname.includes('performance-reviews')
    ? pathname
    : pathname + '/performance-reviews/';
  const columns = React.useMemo<ColumnDef<PerformanceReview>[]>(() => {
    const employeeMap = new Map(employees.map((e) => [e.id, e]));
    return [
      {
        accessorKey: 'employeeId',
        header: 'Employee',
        cell: ({ row }) => domain.toFullName(employeeMap.get(row.original.employeeId)),
      },
      {
        accessorKey: 'assigneeId',
        header: 'Assignee',
        cell: ({ row }) => domain.toFullName(employeeMap.get(row.original.assigneeId)),
      },
      {
        accessorKey: 'submittedAt',
        header: 'Submitted At',
        cell: ({ row }) => toDateTime(row.original.submittedAt),
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => (
          <Button variant={'link'} asChild>
            <Link href={basePath + '/' + row.original.id}>View</Link>
          </Button>
        ),
      },
    ];
  }, [basePath, employees]);

  return <DataTable columns={columns} data={data} />;
}

const EmptyState = ({ openModal }: { openModal: TOpenModal }) => {
  return (
    <div className="text-center">
      <h3 className="mt-2 text-sm font-semibold text-secondary-foreground">
        No performance reviews
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Get started by creating a new performance review.
      </p>
      <div className="mt-6">
        <Button onClick={() => openModal()}>
          <PlusIcon className="h-4" /> New Performance Reviews{' '}
        </Button>
      </div>
    </div>
  );
};
