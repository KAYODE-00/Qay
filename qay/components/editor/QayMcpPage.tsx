'use client';

import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import Icon from '@/components/ui/icon';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type McpToken = {
  id: string;
  name: string;
  token?: string;
  token_prefix: string;
  mcp_url?: string;
  is_active: boolean;
  last_used_at: string | null;
  created_at: string;
  site_id: string;
};

function toFriendlyMcpError(message: string) {
  if (!message) return 'Something went wrong. Please try again.';
  if (message.includes('Not authenticated')) return 'Please sign in again.';
  if (message.includes('Not authorized')) return 'You do not have access to this page.';
  if (message.includes('still being set up')) return 'This area is still being set up. Please try again in a moment.';
  return 'Something went wrong. Please try again.';
}

export function QayMcpPage({ siteId, canManage }: { siteId: string; canManage: boolean }) {
  const [tokens, setTokens] = useState<McpToken[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showGenerateDialog, setShowGenerateDialog] = useState(false);
  const [showUrlDialog, setShowUrlDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [tokenToDelete, setTokenToDelete] = useState<McpToken | null>(null);
  const [newTokenName, setNewTokenName] = useState('');
  const [generatedToken, setGeneratedToken] = useState<McpToken | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const siteQuery = useMemo(() => `?site=${encodeURIComponent(siteId)}`, [siteId]);

  useEffect(() => {
    void fetchTokens();
  }, [siteId]);

  async function fetchTokens() {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/qay/mcp-tokens${siteQuery}`);
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch links');
      }
      setTokens(result.data ?? []);
    } catch (fetchError) {
      setError(toFriendlyMcpError(fetchError instanceof Error ? fetchError.message : ''));
    } finally {
      setIsLoading(false);
    }
  }

  async function handleGenerateToken() {
    if (!newTokenName.trim()) return;
    setIsGenerating(true);
    setError(null);
    try {
      const response = await fetch('/api/qay/mcp-tokens', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ siteId, name: newTokenName.trim() }),
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || 'Failed to create link');
      }
      setGeneratedToken(result.data);
      setShowGenerateDialog(false);
      setShowUrlDialog(true);
      setNewTokenName('');
      void fetchTokens();
    } catch (createError) {
      setError(toFriendlyMcpError(createError instanceof Error ? createError.message : ''));
    } finally {
      setIsGenerating(false);
    }
  }

  async function handleDeleteToken() {
    if (!tokenToDelete) return;
    setError(null);
    try {
      const response = await fetch(`/api/qay/mcp-tokens/${tokenToDelete.id}${siteQuery}`, {
        method: 'DELETE',
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || 'Failed to delete link');
      }
      setTokens((current) => current.filter((token) => token.id !== tokenToDelete.id));
    } catch (deleteError) {
      setError(toFriendlyMcpError(deleteError instanceof Error ? deleteError.message : ''));
    } finally {
      setShowDeleteDialog(false);
      setTokenToDelete(null);
    }
  }

  async function copyToClipboard(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError('Could not copy the link. Please try again.');
    }
  }

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }

  function formatLastUsed(dateString: string | null) {
    return dateString ? formatDate(dateString) : 'Never';
  }

  return (
    <div className="p-8">
      <div className="mx-auto max-w-3xl">
        <header className="flex items-center justify-between pb-6 pt-8">
          <div>
            <span className="text-base font-medium">Connection links</span>
            <p className="mt-2 text-sm text-muted-foreground">
              Create private links for tools like Claude Desktop and Cursor.
            </p>
          </div>
          {canManage ? (
            <Button variant="secondary" size="sm" onClick={() => setShowGenerateDialog(true)}>
              Create link
            </Button>
          ) : null}
        </header>

        {error ? (
          <div className="mb-6 rounded-lg border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        ) : null}

        {isLoading ? (
          <div className="py-12 text-center text-sm text-muted-foreground">Loading...</div>
        ) : tokens.length > 0 ? (
          <div className="flex flex-col gap-3">
            {tokens.map((token) => (
              <div key={token.id} className="flex items-center gap-4 rounded-lg bg-secondary/20 p-4">
                <div className="flex-1">
                  <div className="mb-1 flex items-center gap-3">
                    <Label className="font-medium">{token.name}</Label>
                    <code className="rounded bg-secondary px-1.5 py-0.5 font-mono text-xs text-muted-foreground">
                      {token.token_prefix}...
                    </code>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Created {formatDate(token.created_at)} · Last used: {formatLastUsed(token.last_used_at)}
                  </div>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="secondary" size="xs">
                      <Icon name="more" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {token.mcp_url ? (
                      <DropdownMenuItem onClick={() => copyToClipboard(token.mcp_url!)}>
                        Copy link
                      </DropdownMenuItem>
                    ) : null}
                    {canManage ? (
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={() => {
                          setTokenToDelete(token);
                          setShowDeleteDialog(true);
                        }}
                      >
                        Delete
                      </DropdownMenuItem>
                    ) : null}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-dashed py-12 text-center text-sm text-muted-foreground">
            No links yet.
          </div>
        )}

        <header className="pb-3 pt-10">
          <span className="text-base font-medium">How to connect</span>
        </header>

        <div className="flex flex-col gap-6 rounded-lg bg-secondary/20 p-6 text-sm">
          <section>
            <h3 className="mb-2 font-medium">Claude Desktop</h3>
            <p className="text-muted-foreground">
              Open Settings, add a custom connector, and paste the link.
            </p>
          </section>

          <section>
            <h3 className="mb-2 font-medium">Cursor</h3>
            <p className="text-muted-foreground">
              Open Settings, add a new server, and paste the link.
            </p>
          </section>

          <section>
            <h3 className="mb-2 font-medium">Access</h3>
            <p className="text-muted-foreground">
              Each link works only for the current site.
            </p>
          </section>
        </div>

        <Dialog open={showGenerateDialog} onOpenChange={setShowGenerateDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create link</DialogTitle>
              <DialogDescription>
                Create a private link for this site.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <Label htmlFor="token-name">Connection name</Label>
              <Input
                id="token-name"
                value={newTokenName}
                onChange={(event) => setNewTokenName(event.target.value)}
                placeholder="e.g. Claude Desktop, Cursor"
                className="mt-2"
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    void handleGenerateToken();
                  }
                }}
              />
            </div>
            <DialogFooter>
              <Button
                variant="secondary"
                onClick={() => {
                  setShowGenerateDialog(false);
                  setNewTokenName('');
                }}
              >
                Cancel
              </Button>
              <Button onClick={() => void handleGenerateToken()} disabled={!newTokenName.trim() || isGenerating}>
                {isGenerating ? 'Creating...' : 'Create'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={showUrlDialog} onOpenChange={setShowUrlDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Your link</DialogTitle>
              <DialogDescription>
                Copy this link now and paste it into your tool. It is shown once.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              {generatedToken?.mcp_url ? (
                <div className="flex items-center gap-2">
                  <code className="flex-1 break-all rounded-lg bg-secondary px-3 py-2.5 font-mono text-xs select-all">
                    {generatedToken.mcp_url}
                  </code>
                  <Button variant="secondary" size="sm" onClick={() => copyToClipboard(generatedToken.mcp_url!)}>
                    {copied ? 'Copied!' : 'Copy'}
                  </Button>
                </div>
              ) : null}
              <p className="mt-3 text-xs text-muted-foreground">
                Keep this link private.
              </p>
            </div>
            <DialogFooter>
              <Button
                onClick={() => {
                  setShowUrlDialog(false);
                  setGeneratedToken(null);
                }}
              >
                Done
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <ConfirmDialog
          open={showDeleteDialog}
          onOpenChange={setShowDeleteDialog}
          title="Delete link"
          description={`Are you sure you want to delete "${tokenToDelete?.name}"? Apps using this link will stop connecting.`}
          confirmLabel="Delete"
          onConfirm={handleDeleteToken}
          confirmVariant="destructive"
        />
      </div>
    </div>
  );
}
