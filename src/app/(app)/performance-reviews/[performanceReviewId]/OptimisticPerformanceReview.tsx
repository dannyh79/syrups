'use client';

import { useOptimistic, useState } from 'react';
import { TAddOptimistic } from '@/app/(app)/performance-reviews/useOptimisticPerformanceReviews';
import { type PerformanceReview } from '@/lib/db/schema/performanceReviews';
import { cn } from '@/lib/utils';

import { Button } from '@/components/ui/button';
import Modal from '@/components/shared/Modal';
import PerformanceReviewForm from '@/components/performanceReviews/PerformanceReviewForm';
import { type Employee, type EmployeeId } from '@/lib/db/schema/employees';

export default function OptimisticPerformanceReview({
  performanceReview,
  employees,
}: {
  performanceReview: PerformanceReview;

  employees: Employee[];
  employeeId?: EmployeeId;
  assigneeId?: EmployeeId;
}) {
  const [open, setOpen] = useState(false);
  const openModal = () => {
    setOpen(true);
  };
  const closeModal = () => setOpen(false);
  const [optimisticPerformanceReview, setOptimisticPerformanceReview] =
    useOptimistic(performanceReview);
  const updatePerformanceReview: TAddOptimistic = (input) =>
    setOptimisticPerformanceReview({ ...input.data });

  return (
    <div className="m-4">
      <Modal open={open} setOpen={setOpen}>
        <PerformanceReviewForm
          performanceReview={optimisticPerformanceReview}
          employees={employees}
          employeeId={optimisticPerformanceReview.employeeId}
          assigneeId={optimisticPerformanceReview.assigneeId}
          closeModal={closeModal}
          openModal={openModal}
          addOptimistic={updatePerformanceReview}
        />
      </Modal>
      <div className="flex justify-between items-end mb-4">
        <h1 className="font-semibold text-2xl">{optimisticPerformanceReview.employeeId}</h1>
        <Button className="" onClick={() => setOpen(true)}>
          Edit
        </Button>
      </div>
      <pre
        className={cn(
          'bg-secondary p-4 rounded-lg break-all text-wrap',
          optimisticPerformanceReview.id === 'optimistic' ? 'animate-pulse' : '',
        )}
      >
        {JSON.stringify(optimisticPerformanceReview, null, 2)}
      </pre>
    </div>
  );
}
