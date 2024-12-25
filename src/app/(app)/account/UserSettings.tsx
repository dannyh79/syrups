'use client';
import UpdateNameCard from './UpdateNameCard';
import UpdateEmailCard from './UpdateEmailCard';
import UpdateRoleCard from './UpdateRoleCard';
import { AuthSession } from '@/lib/auth/utils';

export default function UserSettings({ session }: { session: AuthSession['session'] }) {
  return (
    <>
      <UpdateNameCard name={session?.user.name ?? ''} />
      <UpdateEmailCard email={session?.user.email ?? ''} />
      <UpdateRoleCard role={session?.user.role} />
    </>
  );
}
