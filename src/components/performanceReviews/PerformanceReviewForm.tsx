import { z } from 'zod';

import { CalendarIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { useFormStatus } from 'react-dom';
import { toast } from 'sonner';

import * as domain from '@/lib/domains/';

import { type Action, cn } from '@/lib/utils';

import { useValidatedForm } from '@/lib/hooks/useValidatedForm';
import { type TAddOptimistic } from '@/app/(app)/performance-reviews/useOptimisticPerformanceReviews';

import { useBackPath } from '@/components/shared/BackButton';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';

import {
  type PerformanceReview,
  UpdatePerformanceReviewParams,
  insertPerformanceReviewParams,
  updatePerformanceReviewParams,
} from '@/lib/db/schema/performanceReviews';
import {
  createPerformanceReviewAction,
  updatePerformanceReviewAction,
} from '@/lib/actions/performanceReviews';
import { type Employee, type EmployeeId } from '@/lib/db/schema/employees';

export type PerformanceReviewFormProps = {
  performanceReview?: PerformanceReview | null;
  employees: Employee[];
  employeeId?: EmployeeId;
  assigneeId?: EmployeeId;
  openModal?: (performanceReview?: PerformanceReview) => void;
  closeModal?: () => void;
  addOptimistic?: TAddOptimistic;
  postSuccess?: () => void;
};

const PerformanceReviewForm = (props: PerformanceReviewFormProps) => {
  const {
    employees,
    employeeId,
    assigneeId,
    performanceReview,
    openModal,
    closeModal,
    addOptimistic,
    postSuccess,
  } = props;

  const { errors, hasErrors, setErrors, handleChange } = useValidatedForm<PerformanceReview>(
    insertPerformanceReviewParams,
  );
  const editing = !!performanceReview?.id;
  const [submittedAt, setSubmittedAt] = useState<Date | undefined>(
    performanceReview?.submittedAt ?? undefined,
  );

  const [, startMutation] = useTransition();

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
    const performanceReviewParsed = await (
      editing ? updatePerformanceReviewParams : insertPerformanceReviewParams
    ).safeParseAsync({
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
          ? await updatePerformanceReviewAction({
              ...(values as UpdatePerformanceReviewParams),
              id: performanceReview.id,
            })
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
                  {domain.toFullName(employee)}
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
              <SelectValue placeholder="Select an employee" />
            </SelectTrigger>
            <SelectContent>
              {employees.map((employee) => (
                <SelectItem key={employee.id} value={employee.id.toString()}>
                  {domain.toFullName(employee)}
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
      {editing && (
        <>
          <Input name="id" readOnly value={performanceReview.id} className="hidden" />
          <div>
            <Label
              className={cn('mb-2 inline-block', errors?.submittedAt ? 'text-destructive' : '')}
            >
              Submitted At
            </Label>
            <br />
            <Popover>
              <Input
                name="submittedAt"
                onChange={() => {}}
                readOnly
                value={submittedAt?.toUTCString()}
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
                  {submittedAt ? (
                    <span>{format(submittedAt, 'PPP')}</span>
                  ) : (
                    <span>Pick a date</span>
                  )}
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
        </>
      )}
      {/* Schema fields end */}

      {/* Save Button */}
      <SaveButton errors={hasErrors} editing={editing} />
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
