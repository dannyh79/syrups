'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { cn } from '@/lib/utils';
import {
  type PerformanceReview,
  CompletePerformanceReview,
} from '@/lib/db/schema/performanceReviews';
import Modal from '@/components/shared/Modal';
import { type Employee, type EmployeeId } from '@/lib/db/schema/employees';
import { useOptimisticPerformanceReviews } from '@/app/(app)/performance-reviews/useOptimisticPerformanceReviews';
import { Button } from '@/components/ui/button';
import PerformanceReviewForm from './PerformanceReviewForm';
import { PlusIcon } from 'lucide-react';

type TOpenModal = (performanceReview?: PerformanceReview) => void;

export default function PerformanceReviewList({
  performanceReviews,
  employees,
  employeeId,
  assigneeId,
}: {
  performanceReviews: CompletePerformanceReview[];
  employees: Employee[];
  employeeId?: EmployeeId;
  assigneeId?: EmployeeId;
}) {
  const { optimisticPerformanceReviews, addOptimisticPerformanceReview } =
    useOptimisticPerformanceReviews(performanceReviews, employees);
  const [open, setOpen] = useState(false);
  const [activePerformanceReview, setActivePerformanceReview] = useState<PerformanceReview | null>(
    null,
  );
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
      <div className="absolute right-0 top-0 ">
        <Button onClick={() => openModal()} variant={'outline'}>
          +
        </Button>
      </div>
      {optimisticPerformanceReviews.length === 0 ? (
        <EmptyState openModal={openModal} />
      ) : (
        <ul>
          {optimisticPerformanceReviews.map((performanceReview) => (
            <PerformanceReview performanceReview={performanceReview} key={performanceReview.id} />
          ))}
        </ul>
      )}
    </div>
  );
}

const PerformanceReview = ({
  performanceReview,
}: {
  performanceReview: CompletePerformanceReview;
}) => {
  const optimistic = performanceReview.id === 'optimistic';
  const deleting = performanceReview.id === 'delete';
  const mutating = optimistic || deleting;
  const pathname = usePathname();
  const basePath = pathname.includes('performance-reviews')
    ? pathname
    : pathname + '/performance-reviews/';

  return (
    <li
      className={cn(
        'flex justify-between my-2',
        mutating ? 'opacity-30 animate-pulse' : '',
        deleting ? 'text-destructive' : '',
      )}
    >
      <div className="w-full">
        <div>{performanceReview.employeeId}</div>
      </div>
      <Button variant={'link'} asChild>
        <Link href={basePath + '/' + performanceReview.id}>Edit</Link>
      </Button>
    </li>
  );
};

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
