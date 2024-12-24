import { z } from 'zod';

import { useState, useTransition } from 'react';
import { useFormStatus } from 'react-dom';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useValidatedForm } from '@/lib/hooks/useValidatedForm';

import { type Action, cn } from '@/lib/utils';
import { type TAddOptimistic } from '@/app/(app)/employees/useOptimisticEmployees';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useBackPath } from '@/components/shared/BackButton';

import { type Employee, insertEmployeeParams } from '@/lib/db/schema/employees';
import {
  createEmployeeAction,
  deleteEmployeeAction,
  updateEmployeeAction,
} from '@/lib/actions/employees';

const EmployeeForm = ({
  employee,
  openModal,
  closeModal,
  addOptimistic,
  postSuccess,
}: {
  employee?: Employee | null;

  openModal?: (employee?: Employee) => void;
  closeModal?: () => void;
  addOptimistic?: TAddOptimistic;
  postSuccess?: () => void;
}) => {
  const { errors, hasErrors, setErrors, handleChange } =
    useValidatedForm<Employee>(insertEmployeeParams);
  const editing = !!employee?.id;

  const [isDeleting, setIsDeleting] = useState(false);
  const [pending, startMutation] = useTransition();

  const router = useRouter();
  const backpath = useBackPath('employees');

  const onSuccess = (action: Action, data?: { error: string; values: Employee }) => {
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
      toast.success(`Employee ${action}d!`);
      if (action === 'delete') router.push(backpath);
    }
  };

  const handleSubmit = async (data: FormData) => {
    setErrors(null);

    const payload = Object.fromEntries(data.entries());
    const employeeParsed = await insertEmployeeParams.safeParseAsync({ ...payload });
    if (!employeeParsed.success) {
      setErrors(employeeParsed?.error.flatten().fieldErrors);
      return;
    }

    if (closeModal) {
      closeModal();
    }
    const values = employeeParsed.data;
    const pendingEmployee: Employee = {
      updatedAt: employee?.updatedAt ?? new Date(),
      createdAt: employee?.createdAt ?? new Date(),
      id: employee?.id ?? '',
      ...values,
    };
    try {
      startMutation(async () => {
        if (addOptimistic) {
          addOptimistic({
            data: pendingEmployee,
            action: editing ? 'update' : 'create',
          });
        }

        const error = editing
          ? await updateEmployeeAction({ ...values, id: employee.id })
          : await createEmployeeAction(values);

        const errorFormatted = {
          error: error ?? 'Error',
          values: pendingEmployee,
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
      <div>
        <Label className={cn('mb-2 inline-block', errors?.lastName ? 'text-destructive' : '')}>
          Last Name
        </Label>
        <Input
          type="text"
          name="lastName"
          className={cn(errors?.lastName ? 'ring ring-destructive' : '')}
          defaultValue={employee?.lastName ?? ''}
        />
        {errors?.lastName ? (
          <p className="text-xs text-destructive mt-2">{errors.lastName[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div>
      <div>
        <Label className={cn('mb-2 inline-block', errors?.firstName ? 'text-destructive' : '')}>
          First Name
        </Label>
        <Input
          type="text"
          name="firstName"
          className={cn(errors?.firstName ? 'ring ring-destructive' : '')}
          defaultValue={employee?.firstName ?? ''}
        />
        {errors?.firstName ? (
          <p className="text-xs text-destructive mt-2">{errors.firstName[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div>
      <div>
        <Label className={cn('mb-2 inline-block', errors?.firstName ? 'text-destructive' : '')}>
          Email
        </Label>
        <Input
          type="text"
          name="email"
          className={cn(errors?.email ? 'ring ring-destructive' : '')}
          defaultValue={employee?.email ?? ''}
        />
        {errors?.firstName ? (
          <p className="text-xs text-destructive mt-2">{errors.firstName[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div>
      <div>
        <Label className={cn('mb-2 inline-block', errors?.role ? 'text-destructive' : '')}>
          Role
        </Label>
        <Input
          type="text"
          name="role"
          className={cn(errors?.role ? 'ring ring-destructive' : '')}
          defaultValue={employee?.role ?? ''}
        />
        {errors?.role ? (
          <p className="text-xs text-destructive mt-2">{errors.role[0]}</p>
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
                addOptimistic({ action: 'delete', data: employee });
              }
              const error = await deleteEmployeeAction(employee.id);
              setIsDeleting(false);
              const errorFormatted = {
                error: error ?? 'Error',
                values: employee,
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

export default EmployeeForm;

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
