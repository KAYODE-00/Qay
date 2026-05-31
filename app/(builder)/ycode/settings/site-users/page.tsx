'use client';

import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { FieldDescription } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

type SiteUser = {
  id: string;
  email: string;
  full_name: string | null;
  provider: string;
  created_at: string | null;
  last_sign_in_at: string | null;
};

type SiteUserCounts = {
  total: number;
  password: number;
  social: number;
  active: number;
};

function formatDate(value: string | null) {
  if (!value) return 'Never';

  try {
    return new Intl.DateTimeFormat(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date(value));
  } catch {
    return value;
  }
}

export default function SiteUsersSettingsPage() {
  const searchParams = useSearchParams();
  const siteId = searchParams.get('site');
  const [users, setUsers] = useState<SiteUser[]>([]);
  const [counts, setCounts] = useState<SiteUserCounts>({ total: 0, password: 0, social: 0, active: 0 });
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const filteredUsers = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return users;

    return users.filter((user) => (
      user.email.toLowerCase().includes(needle)
      || (user.full_name || '').toLowerCase().includes(needle)
      || user.provider.toLowerCase().includes(needle)
    ));
  }, [users, query]);

  async function loadUsers() {
    if (!siteId) return;

    try {
      setIsLoading(true);
      const response = await fetch(`/api/qay/sites/${siteId}/auth/users`, { cache: 'no-store' });
      const result = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(result?.error || 'Unable to load site users');
      }

      setUsers(result?.data?.users || []);
      setCounts(result?.data?.counts || { total: 0, password: 0, social: 0, active: 0 });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to load site users');
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [siteId]);

  return (
    <div className="p-8">
      <div className="mx-auto max-w-5xl">
        <header className="pt-8 pb-3">
          <span className="text-base font-medium">Site users</span>
          <FieldDescription className="mt-1">
            Visitor accounts created for this site. These are separate from QAY builder accounts.
          </FieldDescription>
        </header>

        {!siteId ? (
          <div className="rounded-lg bg-secondary/20 p-8 text-sm text-muted-foreground">
            Open a QAY site to view its visitor users.
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <div className="grid gap-3 sm:grid-cols-4">
              {[
                ['Total users', counts.total],
                ['Password users', counts.password],
                ['Social users', counts.social],
                ['Signed in before', counts.active],
              ].map(([label, value]) => (
                <div key={label} className="rounded-lg bg-secondary/20 p-4">
                  <div className="text-2xl font-semibold">{value}</div>
                  <div className="mt-1 text-xs text-muted-foreground">{label}</div>
                </div>
              ))}
            </div>

            <div className="rounded-lg bg-secondary/20 p-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="text-sm font-medium">Visitor accounts</div>
                  <FieldDescription>
                    Visitors can recover passwords through the Forgot password and Reset password utility pages.
                  </FieldDescription>
                </div>
                <div className="flex gap-2">
                  <Input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search users"
                    className="h-9 w-56"
                  />
                  <Button size="sm" variant="secondary" onClick={loadUsers} disabled={isLoading}>
                    {isLoading ? 'Loading...' : 'Refresh'}
                  </Button>
                </div>
              </div>

              <Separator className="my-5" />

              {isLoading && users.length === 0 ? (
                <div className="py-10 text-center text-sm text-muted-foreground">Loading site users...</div>
              ) : filteredUsers.length === 0 ? (
                <div className="py-10 text-center text-sm text-muted-foreground">
                  {users.length === 0 ? 'No visitor accounts yet.' : 'No users match your search.'}
                </div>
              ) : (
                <div className="overflow-hidden rounded-lg border">
                  <div className="grid grid-cols-[1.4fr_1fr_0.7fr_1fr_1fr] gap-3 border-b bg-background/60 px-4 py-3 text-xs font-medium text-muted-foreground">
                    <span>Name</span>
                    <span>Email</span>
                    <span>Provider</span>
                    <span>Joined</span>
                    <span>Last sign in</span>
                  </div>

                  {filteredUsers.map((user) => (
                    <div key={user.id} className="grid grid-cols-[1.4fr_1fr_0.7fr_1fr_1fr] gap-3 border-b px-4 py-3 text-xs last:border-b-0">
                      <span className="truncate font-medium">{user.full_name || 'No name'}</span>
                      <span className="truncate text-muted-foreground">{user.email}</span>
                      <span className="truncate capitalize text-muted-foreground">{user.provider}</span>
                      <span className="truncate text-muted-foreground">{formatDate(user.created_at)}</span>
                      <span className="truncate text-muted-foreground">{formatDate(user.last_sign_in_at)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
