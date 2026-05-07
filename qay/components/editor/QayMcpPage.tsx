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
        throw new Error(result.error || 'Failed to fetch MCP tokens');
      }
      setTokens(result.data ?? []);
    } catch (fetchError) {
      setError(fetchError instanceof Error ? fetchError.message : 'Failed to fetch MCP tokens');
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
        throw new Error(result.error || 'Failed to create MCP token');
      }
      setGeneratedToken(result.data);
      setShowGenerateDialog(false);
      setShowUrlDialog(true);
      setNewTokenName('');
      void fetchTokens();
    } catch (createError) {
      setError(createError instanceof Error ? createError.message : 'Failed to create MCP token');
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
        throw new Error(result.error || 'Failed to delete MCP token');
      }
      setTokens((current) => current.filter((token) => token.id !== tokenToDelete.id));
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : 'Failed to delete MCP token');
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
      setError('Failed to copy MCP URL');
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
            <span className="text-base font-medium">MCP</span>
            <p className="mt-2 text-sm text-muted-foreground">
              This site has its own isolated MCP connections. Tokens created here only operate on this site&apos;s pages and layers.
            </p>
          </div>
          {canManage ? (
            <Button variant="secondary" size="sm" onClick={() => setShowGenerateDialog(true)}>
              Generate MCP URL
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
                        Copy URL
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
            No site MCP connections yet.
          </div>
        )}

        <header className="pb-3 pt-10">
          <span className="text-base font-medium">How to connect</span>
        </header>

        <div className="flex flex-col gap-6 rounded-lg bg-secondary/20 p-6 text-sm">
          <section>
            <h3 className="mb-2 font-medium">Claude Desktop</h3>
            <p className="text-muted-foreground">
              Settings → Connectors → Add custom connector → Paste the MCP URL
            </p>
          </section>

          <section>
            <h3 className="mb-2 font-medium">Cursor</h3>
            <p className="text-muted-foreground">
              Settings → MCP → Add new MCP server → Type: “SSE” → Paste the MCP URL
            </p>
          </section>

          <section>
            <h3 className="mb-2 font-medium">Scope</h3>
            <p className="text-muted-foreground">
              This MCP connection can only read and write the active QAY site. It cannot see another site&apos;s pages, folders, or layer content.
            </p>
          </section>
        </div>

        <Dialog open={showGenerateDialog} onOpenChange={setShowGenerateDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Generate MCP URL</DialogTitle>
              <DialogDescription>
                Create a site-scoped MCP URL for this QAY site.
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
                {isGenerating ? 'Generating...' : 'Generate'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={showUrlDialog} onOpenChange={setShowUrlDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Your MCP URL</DialogTitle>
              <DialogDescription>
                Copy this URL and paste it into your AI tool. This URL is site-scoped and only shown once.
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
                Keep this URL private. Anyone with it can access this site&apos;s MCP surface.
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
          title="Delete MCP connection"
          description={`Are you sure you want to delete "${tokenToDelete?.name}"? AI tools using this URL will no longer be able to connect.`}
          confirmLabel="Delete"
          onConfirm={handleDeleteToken}
          confirmVariant="destructive"
        />
      </div>
    </div>
  );
}
