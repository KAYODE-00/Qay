import { buildPublicAppUrl } from './public-app-url';
import { getQayAdmin } from './supabase-admin';
import { createToken, deleteToken } from '@/lib/repositories/mcpTokenRepository';
import { isMissingQaySchemaError, qaySchemaPublicMessage, qaySchemaSetupMessage } from './schema';

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

type SiteTokenLinkRow = {
  site_id: string;
  token_id: string;
};

async function listSiteTokenLinks(siteId: string): Promise<SiteTokenLinkRow[]> {
  const supabase = getQayAdmin() as any;
  const { data, error } = await supabase
    .from('qay_site_mcp_tokens')
    .select('site_id, token_id')
    .eq('site_id', siteId);

  if (error) {
    if (isMissingQaySchemaError(error) || String(error.message || '').includes('qay_site_mcp_tokens')) {
      console.error('QAY MCP setup issue:', qaySchemaSetupMessage(error.message));
      throw new Error(qaySchemaPublicMessage());
    }
    throw new Error(`Failed to list site MCP tokens: ${error.message}`);
  }

  return (data ?? []) as SiteTokenLinkRow[];
}

async function getSiteTokenLink(siteId: string, tokenId: string): Promise<SiteTokenLinkRow | null> {
  const supabase = getQayAdmin() as any;
  const { data, error } = await supabase
    .from('qay_site_mcp_tokens')
    .select('site_id, token_id')
    .eq('site_id', siteId)
    .eq('token_id', tokenId)
    .maybeSingle();

  if (error) {
    if (isMissingQaySchemaError(error) || String(error.message || '').includes('qay_site_mcp_tokens')) {
      console.error('QAY MCP fetch issue:', qaySchemaSetupMessage(error.message));
      throw new Error(qaySchemaPublicMessage());
    }
    throw new Error(`Failed to fetch site MCP token: ${error.message}`);
  }

  return (data as SiteTokenLinkRow | null) ?? null;
}

export async function listQaySiteMcpTokens(siteId: string): Promise<QayMcpTokenRecord[]> {
  const supabase = getQayAdmin() as any;
  const links = await listSiteTokenLinks(siteId);
  if (links.length === 0) {
    return [];
  }

  const tokenIds = links.map((link) => link.token_id);
  const { data, error } = await supabase
    .from('mcp_tokens')
    .select('id, name, token_prefix, is_active, last_used_at, created_at, updated_at')
    .in('id', tokenIds);

  if (error) {
    throw new Error(`Failed to fetch site MCP tokens: ${error.message}`);
  }

  const siteIdByTokenId = new Map(links.map((link) => [link.token_id, link.site_id]));

  return (data ?? [])
    .map((token: any) => ({
      ...token,
      site_id: siteIdByTokenId.get(token.id) ?? siteId,
    }))
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
      console.error('QAY MCP attach issue:', qaySchemaSetupMessage(error.message));
      throw new Error(qaySchemaPublicMessage());
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
  const link = await getSiteTokenLink(siteId, tokenId);
  if (!link) {
    return null;
  }

  const { data, error } = await supabase
    .from('mcp_tokens')
    .select('id, name, token_prefix, is_active, last_used_at, created_at, updated_at')
    .eq('id', tokenId)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to fetch site MCP token: ${error.message}`);
  }

  if (!data) {
    return null;
  }

  return {
    ...(data as any),
    site_id: link.site_id,
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
    .from('mcp_tokens')
    .select('id, name, token, token_prefix, is_active, last_used_at, created_at, updated_at')
    .eq('token', token)
    .eq('is_active', true)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to validate site MCP token: ${error.message}`);
  }

  if (!data) {
    return null;
  }

  const link = await getSiteTokenLinkForTokenId((data as any).id);
  if (!link) {
    return null;
  }

  await supabase
    .from('mcp_tokens')
    .update({ last_used_at: new Date().toISOString() })
    .eq('id', (data as any).id);

  return {
    ...(data as any),
    site_id: link.site_id,
  };
}

async function getSiteTokenLinkForTokenId(tokenId: string): Promise<SiteTokenLinkRow | null> {
  const supabase = getQayAdmin() as any;
  const { data, error } = await supabase
    .from('qay_site_mcp_tokens')
    .select('site_id, token_id')
    .eq('token_id', tokenId)
    .maybeSingle();

  if (error) {
    if (isMissingQaySchemaError(error) || String(error.message || '').includes('qay_site_mcp_tokens')) {
      console.error('QAY MCP validate issue:', qaySchemaSetupMessage(error.message));
      throw new Error(qaySchemaPublicMessage());
    }
    throw new Error(`Failed to validate site MCP token: ${error.message}`);
  }

  return (data as SiteTokenLinkRow | null) ?? null;
}
