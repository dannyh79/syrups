'use client';

import { useActionState, useEffect } from 'react';
import { useFormStatus } from 'react-dom';

import * as domain from '@/lib/domains';

import { AccountCard, AccountCardFooter, AccountCardBody } from './AccountCard';
import { updateUser } from '@/lib/actions/users';

import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';
import { SelectValue } from '@radix-ui/react-select';

const disclaimer = 'Note: RBAC role selection not implemented.';

export default function UpdateRoleCard({ role }: { role?: domain.Role }) {
  const [state, formAction] = useActionState(updateUser, {
    error: '',
  });

  useEffect(() => {
    if (state.success == true) toast.success('Updated Role.');
    if (state.error) toast.error('Error', { description: state.error });
  }, [state]);

  return (
    <AccountCard
      params={{
        header: 'Your Role',
        description: 'Please select your role.',
      }}
    >
      <form action={formAction}>
        <AccountCardBody>
          <Select defaultValue={role ?? undefined} name="role">
            <SelectTrigger>
              <SelectValue placeholder="Select a role" />
            </SelectTrigger>
            <SelectContent>
              {domain.roles.map((role, index) => (
                <SelectItem key={`${index}-${role}`} value={role}>
                  {role}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </AccountCardBody>
        <AccountCardFooter description={disclaimer}>
          <Submit />
        </AccountCardFooter>
      </form>
    </AccountCard>
  );
}

const Submit = () => {
  const { pending } = useFormStatus();
  return <Button disabled={pending}>Update Role</Button>;
};
