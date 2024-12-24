import { z } from 'zod';

import { useState, useTransition } from 'react';
import { useFormStatus } from 'react-dom';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useValidatedForm } from '@/lib/hooks/useValidatedForm';

import { type Action, cn } from '@/lib/utils';
import { type TAddOptimistic } from '@/app/(app)/performance-reviews/useOptimisticPerformanceReviews';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useBackPath } from '@/components/shared/BackButton';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';

import {
  type PerformanceReview,
  insertPerformanceReviewParams,
} from '@/lib/db/schema/performanceReviews';
import {
  createPerformanceReviewAction,
  deletePerformanceReviewAction,
  updatePerformanceReviewAction,
} from '@/lib/actions/performanceReviews';
import { type Employee, type EmployeeId } from '@/lib/db/schema/employees';

const PerformanceReviewForm = ({
  employees,
  employeeId,
  assigneeId,
  performanceReview,
  openModal,
  closeModal,
  addOptimistic,
  postSuccess,
}: {
  performanceReview?: PerformanceReview | null;
  employees: Employee[];
  employeeId?: EmployeeId;
  assigneeId?: EmployeeId;
  openModal?: (performanceReview?: PerformanceReview) => void;
  closeModal?: () => void;
  addOptimistic?: TAddOptimistic;
  postSuccess?: () => void;
}) => {
  const { errors, hasErrors, setErrors, handleChange } = useValidatedForm<PerformanceReview>(
    insertPerformanceReviewParams,
  );
  const editing = !!performanceReview?.id;
  const [submittedAt, setSubmittedAt] = useState<Date | undefined>(performanceReview?.submittedAt);

  const [isDeleting, setIsDeleting] = useState(false);
  const [pending, startMutation] = useTransition();

  const router = useRouter();
  const backpath = useBackPath('performance-reviews');

  const onSuccess = (action: Action, data?: { error: string; values: PerformanceReview }) => {
    const failed = Boolean(data?.error);
    if (failed) {
      if (openModal) {
        openModal(data?.values);
      }
      toast.error(`Failed to ${action}`, {
        description: data?.error ?? 'Error',
      });
    } else {
      router.refresh();
      if (postSuccess) {
        postSuccess();
      }
      toast.success(`PerformanceReview ${action}d!`);
      if (action === 'delete') router.push(backpath);
    }
  };

  const handleSubmit = async (data: FormData) => {
    setErrors(null);

    const payload = Object.fromEntries(data.entries());
    const performanceReviewParsed = await insertPerformanceReviewParams.safeParseAsync({
      employeeId,
      assigneeId,
      ...payload,
    });
    if (!performanceReviewParsed.success) {
      setErrors(performanceReviewParsed?.error.flatten().fieldErrors);
      return;
    }

    if (closeModal) {
      closeModal();
    }
    const values = performanceReviewParsed.data;
    const pendingPerformanceReview: PerformanceReview = {
      updatedAt: performanceReview?.updatedAt ?? new Date(),
      createdAt: performanceReview?.createdAt ?? new Date(),
      id: performanceReview?.id ?? '',
      ...values,
    };
    try {
      startMutation(async () => {
        if (addOptimistic) {
          addOptimistic({
            data: pendingPerformanceReview,
            action: editing ? 'update' : 'create',
          });
        }

        const error = editing
          ? await updatePerformanceReviewAction({ ...values, id: performanceReview.id })
          : await createPerformanceReviewAction(values);

        const errorFormatted = {
          error: error ?? 'Error',
          values: pendingPerformanceReview,
        };
        onSuccess(editing ? 'update' : 'create', error ? errorFormatted : undefined);
      });
    } catch (e) {
      if (e instanceof z.ZodError) {
        setErrors(e.flatten().fieldErrors);
      }
    }
  };

  return (
    <form action={handleSubmit} onChange={handleChange} className={'space-y-8'}>
      {/* Schema fields start */}

      {employeeId ? null : (
        <div>
          <Label className={cn('mb-2 inline-block', errors?.employeeId ? 'text-destructive' : '')}>
            Employee
          </Label>
          <Select defaultValue={performanceReview?.employeeId} name="employeeId">
            <SelectTrigger className={cn(errors?.employeeId ? 'ring ring-destructive' : '')}>
              <SelectValue placeholder="Select a employee" />
            </SelectTrigger>
            <SelectContent>
              {employees.map((employee) => (
                <SelectItem key={employee.id} value={employee.id.toString()}>
                  {employee.id}
                  {/* TODO: Replace with a field from the employee model */}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors?.employeeId ? (
            <p className="text-xs text-destructive mt-2">{errors.employeeId[0]}</p>
          ) : (
            <div className="h-6" />
          )}
        </div>
      )}

      {assigneeId ? null : (
        <div>
          <Label className={cn('mb-2 inline-block', errors?.employeeId ? 'text-destructive' : '')}>
            Assignee
          </Label>
          <Select defaultValue={performanceReview?.assigneeId} name="assigneeId">
            <SelectTrigger className={cn(errors?.assigneeId ? 'ring ring-destructive' : '')}>
              <SelectValue placeholder="Select an assignee" />
            </SelectTrigger>
            <SelectContent>
              {employees.map((employee) => (
                <SelectItem key={employee.id} value={employee.id.toString()}>
                  {employee.id}
                  {/* TODO: Replace with a field from the assignee model */}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors?.assigneeId ? (
            <p className="text-xs text-destructive mt-2">{errors.assigneeId[0]}</p>
          ) : (
            <div className="h-6" />
          )}
        </div>
      )}
      <div>
        <Label className={cn('mb-2 inline-block', errors?.submittedAt ? 'text-destructive' : '')}>
          Submitted At
        </Label>
        <br />
        <Popover>
          <Input
            name="submittedAt"
            onChange={() => {}}
            readOnly
            value={submittedAt?.toUTCString() ?? new Date().toUTCString()}
            className="hidden"
          />

          <PopoverTrigger asChild>
            <Button
              variant={'outline'}
              className={cn(
                'w-[240px] pl-3 text-left font-normal',
                !performanceReview?.submittedAt && 'text-muted-foreground',
              )}
            >
              {submittedAt ? <span>{format(submittedAt, 'PPP')}</span> : <span>Pick a date</span>}
              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              onSelect={(e) => setSubmittedAt(e)}
              selected={submittedAt}
              disabled={(date) => date > new Date() || date < new Date('1900-01-01')}
            />
          </PopoverContent>
        </Popover>
        {errors?.submittedAt ? (
          <p className="text-xs text-destructive mt-2">{errors.submittedAt[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div>
      <div>
        <Label className={cn('mb-2 inline-block', errors?.feedback ? 'text-destructive' : '')}>
          Feedback
        </Label>
        <Input
          type="text"
          name="feedback"
          className={cn(errors?.feedback ? 'ring ring-destructive' : '')}
          defaultValue={performanceReview?.feedback ?? ''}
        />
        {errors?.feedback ? (
          <p className="text-xs text-destructive mt-2">{errors.feedback[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div>
      {/* Schema fields end */}

      {/* Save Button */}
      <SaveButton errors={hasErrors} editing={editing} />

      {/* Delete Button */}
      {editing ? (
        <Button
          type="button"
          disabled={isDeleting || pending || hasErrors}
          variant={'destructive'}
          onClick={() => {
            setIsDeleting(true);
            if (closeModal) {
              closeModal();
            }
            startMutation(async () => {
              if (addOptimistic) {
                addOptimistic({ action: 'delete', data: performanceReview });
              }
              const error = await deletePerformanceReviewAction(performanceReview.id);
              setIsDeleting(false);
              const errorFormatted = {
                error: error ?? 'Error',
                values: performanceReview,
              };

              onSuccess('delete', error ? errorFormatted : undefined);
            });
          }}
        >
          Delet{isDeleting ? 'ing...' : 'e'}
        </Button>
      ) : null}
    </form>
  );
};

export default PerformanceReviewForm;

const SaveButton = ({ editing, errors }: { editing: boolean; errors: boolean }) => {
  const { pending } = useFormStatus();
  const isCreating = pending && editing === false;
  const isUpdating = pending && editing === true;
  return (
    <Button
      type="submit"
      className="mr-2"
      disabled={isCreating || isUpdating || errors}
      aria-disabled={isCreating || isUpdating || errors}
    >
      {editing ? `Sav${isUpdating ? 'ing...' : 'e'}` : `Creat${isCreating ? 'ing...' : 'e'}`}
    </Button>
  );
};
