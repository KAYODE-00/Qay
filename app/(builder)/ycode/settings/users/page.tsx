'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { Label } from '@/components/ui/label';
import { FieldDescription, FieldLegend } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { Spinner } from '@/components/ui/spinner';
import { getUserInitials, generateUserColor } from '@/lib/collaboration-utils';
import { useAuthStore } from '@/stores/useAuthStore';

interface ActiveUser {
  id: string;
  member_id: string | null;
  email: string;
  display_name: string | null;
  avatar_url: string | null;
  created_at: string;
  last_sign_in_at: string | null;
  role: string;
  is_owner: boolean;
}

interface PendingInvite {
  id: string;
  email: string;
  role: string;
  invited_at: string;
  expires_at: string;
}

export default function UsersSettingsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const siteId = searchParams.get('site');
  const currentUser = useAuthStore((state) => state.user);

  const [activeUsers, setActiveUsers] = useState<ActiveUser[]>([]);
  const [pendingInvites, setPendingInvites] = useState<PendingInvite[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [inviteEmail, setInviteEmail] = useState('');
  const [isInviting, setIsInviting] = useState(false);
  const [inviteError, setInviteError] = useState<string | null>(null);
  const [inviteSuccess, setInviteSuccess] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [userToDelete, setUserToDelete] = useState<{ id: string; email: string; type: 'user' | 'invite' } | null>(null);

  const fetchUsers = useCallback(async () => {
    if (!siteId) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/ycode/api/auth/users?site=${siteId}`);
      const result = await response.json();
      if (result.data) {
        setActiveUsers(result.data.activeUsers || []);
        setPendingInvites(result.data.pendingInvites || []);
      }
    } catch (error) {
      console.error('Failed to fetch invites:', error);
    } finally {
      setIsLoading(false);
    }
  }, [siteId]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleInvite = useCallback(async () => {
    if (!inviteEmail.trim() || !siteId) return;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(inviteEmail)) {
      setInviteError('Please enter a valid email address');
      return;
    }

    setIsInviting(true);
    setInviteError(null);
    setInviteSuccess(null);

    try {
      const response = await fetch('/ycode/api/auth/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: inviteEmail.trim(),
          siteId,
          role: 'client',
        }),
      });

      const result = await response.json();

      if (!response.ok || result.error) {
        setInviteError(result.error || 'Failed to send invitation');
        return;
      }

      const invitedEmail = inviteEmail.trim();
      setInviteSuccess(`Invitation sent to ${invitedEmail}`);
      setInviteEmail('');
      await fetchUsers();
      setTimeout(() => setInviteSuccess(null), 3000);
    } catch (error) {
      console.error('Failed to send invite:', error);
      setInviteError('Failed to send invitation. Please try again.');
    } finally {
      setIsInviting(false);
    }
  }, [fetchUsers, inviteEmail, siteId]);

  const handleDelete = async () => {
    if (!userToDelete || !siteId) return;

    try {
      const response = await fetch(`/ycode/api/auth/users?site=${siteId}&id=${userToDelete.id}&type=${userToDelete.type}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        if (userToDelete.type === 'user') {
          setActiveUsers(activeUsers.filter((user) => user.id !== userToDelete.id));
        } else {
          setPendingInvites(pendingInvites.filter((invite) => invite.id !== userToDelete.id));
        }
      }
    } catch (error) {
      console.error('Failed to update invite access:', error);
    } finally {
      setShowDeleteDialog(false);
      setUserToDelete(null);
    }
  };

  const handleResendInvite = async (email: string) => {
    if (!siteId) return;

    try {
      const response = await fetch('/ycode/api/auth/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          siteId,
          role: 'client',
        }),
      });

      const result = await response.json();
      if (response.ok && !result.error) {
        setInviteSuccess(`Invitation resent to ${email}`);
        await fetchUsers();
        setTimeout(() => setInviteSuccess(null), 3000);
      }
    } catch (error) {
      console.error('Failed to resend invite:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatLastSeen = (dateString: string | null) => {
    if (!dateString) return 'Never';
    return formatDate(dateString);
  };

  return (
    <div className="p-8">
      <div className="max-w-3xl mx-auto">
        <header className="pt-8 pb-3">
          <span className="text-base font-medium">Invites</span>
        </header>

        {!siteId ? (
          <div className="bg-secondary/20 p-8 rounded-lg text-sm text-muted-foreground">
            Open settings from a QAY site editor to manage that site&apos;s invites.
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-6 bg-secondary/20 p-8 rounded-lg">
              <header>
                <FieldLegend>Invite collaborator</FieldLegend>
                <FieldDescription>
                  Send an invitation email for this site only.
                </FieldDescription>
              </header>

              <div className="flex gap-2">
                <Input
                  type="email"
                  placeholder="email@example.com"
                  value={inviteEmail}
                  onChange={(event) => {
                    setInviteEmail(event.target.value);
                    setInviteError(null);
                  }}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' && !isInviting) {
                      handleInvite();
                    }
                  }}
                  disabled={isInviting}
                  className="flex-1"
                />
                <Button onClick={handleInvite} disabled={isInviting || !inviteEmail.trim()}>
                  {isInviting ? <Spinner /> : 'Send invite'}
                </Button>
              </div>

              {inviteError && <p className="text-xs text-destructive">{inviteError}</p>}
              {inviteSuccess && <p className="text-xs text-green-500">{inviteSuccess}</p>}
            </div>

            <header className="pt-10 pb-3">
              <span className="text-base font-medium">People with access</span>
            </header>

            <div className="flex flex-col gap-6 bg-secondary/20 p-8 rounded-lg">
              <header>
                <FieldLegend>Site access</FieldLegend>
                <FieldDescription>
                  People who can open this QAY site.
                </FieldDescription>
              </header>

              {isLoading ? (
                <div className="border-t pt-8 pb-4 text-center text-muted-foreground text-sm">
                  Loading...
                </div>
              ) : activeUsers.length > 0 ? (
                <div className="border-t -mb-4 divide-y">
                  {[...activeUsers]
                    .sort((a, b) => {
                      if (a.id === currentUser?.id) return -1;
                      if (b.id === currentUser?.id) return 1;
                      if (a.is_owner) return -1;
                      if (b.is_owner) return 1;
                      return 0;
                    })
                    .map((user) => (
                      <div key={user.id} className="py-4 flex items-center gap-4">
                        <div
                          className="size-8 rounded-full bg-neutral-700 flex items-center justify-center text-xs font-medium text-white shrink-0 overflow-hidden"
                          style={{ backgroundColor: user.avatar_url ? undefined : generateUserColor(user.id) }}
                        >
                          {user.avatar_url ? (
                            <Image
                              src={user.avatar_url}
                              alt={user.display_name || user.email}
                              width={32}
                              height={32}
                              className="size-full object-cover"
                              unoptimized
                            />
                          ) : (
                            getUserInitials(user.email, user.display_name || undefined)
                          )}
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Label className="font-medium">{user.display_name || user.email}</Label>
                            {currentUser?.id === user.id && <span className="text-xs text-muted-foreground">You</span>}
                            {user.is_owner && (
                              <span className="text-xs text-muted-foreground bg-secondary px-1.5 py-0.5 rounded">
                                Owner
                              </span>
                            )}
                            {!user.is_owner && (
                              <span className="text-xs text-muted-foreground bg-secondary px-1.5 py-0.5 rounded">
                                {user.role}
                              </span>
                            )}
                            {user.display_name && <span className="text-xs text-muted-foreground">{user.email}</span>}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Joined {formatDate(user.created_at)} · Last seen: {formatLastSeen(user.last_sign_in_at)}
                          </div>
                        </div>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="secondary" size="xs">
                              <Icon name="more" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {currentUser?.id === user.id ? (
                              <DropdownMenuItem onClick={() => router.push('/ycode/profile')}>
                                My profile
                              </DropdownMenuItem>
                            ) : user.is_owner ? (
                              <DropdownMenuItem disabled>Site owner</DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem
                                className="text-destructive focus:text-destructive"
                                onClick={() => {
                                  setUserToDelete({ id: user.id, email: user.email, type: 'user' });
                                  setShowDeleteDialog(true);
                                }}
                              >
                                Remove access
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="border-t pt-8 pb-4 text-center text-muted-foreground text-sm">
                  No collaborators yet.
                </div>
              )}
            </div>

            <header className="pt-10 pb-3">
              <span className="text-base font-medium">Pending invites</span>
            </header>

            <div className="flex flex-col gap-6 bg-secondary/20 p-8 rounded-lg">
              <header>
                <FieldLegend>Invitations</FieldLegend>
                <FieldDescription>
                  People who have been invited to this site but haven&apos;t accepted yet.
                </FieldDescription>
              </header>

              {isLoading ? (
                <div className="border-t pt-8 pb-4 text-center text-muted-foreground text-sm">
                  Loading...
                </div>
              ) : pendingInvites.length > 0 ? (
                <div className="border-t -mb-4 divide-y">
                  {pendingInvites.map((invite) => (
                    <div key={invite.id} className="py-4 flex items-center gap-4">
                      <div
                        className="size-8 rounded-full flex items-center justify-center text-xs font-medium text-white shrink-0 opacity-50"
                        style={{ backgroundColor: generateUserColor(invite.id) }}
                      >
                        {getUserInitials(invite.email)}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <Label className="font-medium">{invite.email}</Label>
                          <span className="text-xs text-muted-foreground bg-secondary px-1.5 py-0.5 rounded">
                            Pending
                          </span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Invited {formatDate(invite.invited_at)}
                        </div>
                      </div>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="secondary" size="xs">
                            <Icon name="more" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleResendInvite(invite.email)}>
                            Resend invite
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() => {
                              setUserToDelete({ id: invite.id, email: invite.email, type: 'invite' });
                              setShowDeleteDialog(true);
                            }}
                          >
                            Cancel invite
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="border-t pt-8 pb-4 text-center text-muted-foreground text-xs">
                  No pending invites.
                </div>
              )}
            </div>
          </>
        )}
      </div>

      <ConfirmDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        title={userToDelete?.type === 'user' ? 'Remove access?' : 'Cancel invite?'}
        description={
          userToDelete?.type === 'user'
            ? `This will remove "${userToDelete?.email}" from this site only.`
            : `This will cancel the invitation for "${userToDelete?.email}".`
        }
        confirmLabel={userToDelete?.type === 'user' ? 'Remove access' : 'Cancel invite'}
        cancelLabel="Keep"
        confirmVariant="destructive"
        onConfirm={handleDelete}
        onCancel={() => {
          setShowDeleteDialog(false);
          setUserToDelete(null);
        }}
      />
    </div>
  );
}
