import { buildPublicAppUrl } from './public-app-url';
import { getQayAdmin } from './supabase-admin';
import { createToken, deleteToken } from '@/lib/repositories/mcpTokenRepository';
import { isMissingQaySchemaError, qaySchemaSetupMessage } from './schema';

export type QayMcpTokenRecord = {
  id: string;
  name: string;
  token?: string;
  token_prefix: string;
  is_active: boolean;
  last_used_at: string | null;
  created_at: string;
  updated_at: string;
  site_id: string;
};

export async function listQaySiteMcpTokens(siteId: string): Promise<QayMcpTokenRecord[]> {
  const supabase = getQayAdmin() as any;
  const { data, error } = await supabase
    .from('qay_site_mcp_tokens')
    .select(`
      site_id,
      mcp_tokens (
        id,
        name,
        token_prefix,
        is_active,
        last_used_at,
        created_at,
        updated_at
      )
    `)
    .eq('site_id', siteId);

  if (error) {
    if (isMissingQaySchemaError(error) || String(error.message || '').includes('qay_site_mcp_tokens')) {
      throw new Error(qaySchemaSetupMessage(error.message));
    }
    throw new Error(`Failed to list site MCP tokens: ${error.message}`);
  }

  return (data ?? [])
    .map((row: any) => {
      const token = Array.isArray(row.mcp_tokens) ? row.mcp_tokens[0] : row.mcp_tokens;
      if (!token) return null;
      return {
        ...token,
        site_id: row.site_id,
      } as QayMcpTokenRecord;
    })
    .filter(Boolean)
    .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()) as QayMcpTokenRecord[];
}

export async function createQaySiteMcpToken(siteId: string, userId: string, name: string) {
  const token = await createToken(name);
  const supabase = getQayAdmin() as any;

  const { error } = await supabase
    .from('qay_site_mcp_tokens')
    .insert({
      site_id: siteId,
      token_id: token.id,
      created_by: userId,
    });

  if (error) {
    if (isMissingQaySchemaError(error) || String(error.message || '').includes('qay_site_mcp_tokens')) {
      await deleteToken(token.id).catch(() => {});
      throw new Error(qaySchemaSetupMessage(error.message));
    }
    await deleteToken(token.id).catch(() => {});
    throw new Error(`Failed to attach MCP token to site: ${error.message}`);
  }

  return {
    ...token,
    site_id: siteId,
    mcp_url: buildPublicAppUrl(`/qay/mcp/${token.token}`),
  };
}

export async function getQaySiteMcpTokenById(siteId: string, tokenId: string): Promise<QayMcpTokenRecord | null> {
  const supabase = getQayAdmin() as any;
  const { data, error } = await supabase
    .from('qay_site_mcp_tokens')
    .select(`
      site_id,
      mcp_tokens (
        id,
        name,
        token_prefix,
        is_active,
        last_used_at,
        created_at,
        updated_at
      )
    `)
    .eq('site_id', siteId)
    .eq('token_id', tokenId)
    .maybeSingle();

  if (error) {
    if (isMissingQaySchemaError(error) || String(error.message || '').includes('qay_site_mcp_tokens')) {
      throw new Error(qaySchemaSetupMessage(error.message));
    }
    throw new Error(`Failed to fetch site MCP token: ${error.message}`);
  }

  if (!data) {
    return null;
  }

  const token = Array.isArray((data as any).mcp_tokens) ? (data as any).mcp_tokens[0] : (data as any).mcp_tokens;
  if (!token) return null;

  return {
    ...token,
    site_id: (data as any).site_id,
  };
}

export async function deleteQaySiteMcpToken(siteId: string, tokenId: string): Promise<void> {
  const existing = await getQaySiteMcpTokenById(siteId, tokenId);
  if (!existing) {
    throw new Error('MCP token not found for this site');
  }

  await deleteToken(tokenId);
}

export async function validateQayMcpToken(token: string): Promise<(QayMcpTokenRecord & { site_id: string }) | null> {
  const supabase = getQayAdmin() as any;
  const { data, error } = await supabase
    .from('qay_site_mcp_tokens')
    .select(`
      site_id,
      mcp_tokens!inner (
        id,
        name,
        token_prefix,
        token,
        is_active,
        last_used_at,
        created_at,
        updated_at
      )
    `)
    .eq('mcp_tokens.token', token)
    .eq('mcp_tokens.is_active', true)
    .maybeSingle();

  if (error) {
    if (isMissingQaySchemaError(error) || String(error.message || '').includes('qay_site_mcp_tokens')) {
      throw new Error(qaySchemaSetupMessage(error.message));
    }
    throw new Error(`Failed to validate site MCP token: ${error.message}`);
  }

  if (!data) {
    return null;
  }

  const tokenRecord = Array.isArray((data as any).mcp_tokens) ? (data as any).mcp_tokens[0] : (data as any).mcp_tokens;
  if (!tokenRecord) {
    return null;
  }

  await supabase
    .from('mcp_tokens')
    .update({ last_used_at: new Date().toISOString() })
    .eq('id', tokenRecord.id);

  return {
    ...tokenRecord,
    site_id: (data as any).site_id,
  };
}
