type VercelDomainResult = {
  configured: boolean;
  added?: boolean;
  verified?: boolean;
  dns?: unknown;
  error?: string;
};

function vercelTeamQuery() {
  return process.env.VERCEL_TEAM_ID ? `?teamId=${encodeURIComponent(process.env.VERCEL_TEAM_ID)}` : '';
}

function vercelHeaders() {
  const token = process.env.VERCEL_API_TOKEN;
  if (!token) return null;

  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
}

function vercelProjectId() {
  return process.env.VERCEL_PROJECT_ID || process.env.QAY_VERCEL_PROJECT_ID || '';
}

export function isVercelDomainAutomationConfigured() {
  return !!vercelHeaders() && !!vercelProjectId();
}

export async function addDomainToVercelProject(domain: string): Promise<VercelDomainResult> {
  const headers = vercelHeaders();
  const projectId = vercelProjectId();

  if (!headers || !projectId) {
    return { configured: false };
  }

  const cleanDomain = domain.trim().toLowerCase();
  if (!cleanDomain) return { configured: true, error: 'Domain is required' };

  try {
    const addResponse = await fetch(
      `https://api.vercel.com/v10/projects/${encodeURIComponent(projectId)}/domains${vercelTeamQuery()}`,
      {
        method: 'POST',
        headers,
        body: JSON.stringify({ name: cleanDomain }),
      }
    );

    const addPayload = await addResponse.json().catch(() => null);
    const alreadyExists = addResponse.status === 409 || addPayload?.error?.code === 'domain_already_in_use';

    if (!addResponse.ok && !alreadyExists) {
      return {
        configured: true,
        error: addPayload?.error?.message || addPayload?.message || 'Unable to add domain to Vercel',
      };
    }

    const configResponse = await fetch(
      `https://api.vercel.com/v6/domains/${encodeURIComponent(cleanDomain)}/config${vercelTeamQuery()}`,
      { headers }
    );
    const configPayload = await configResponse.json().catch(() => null);

    return {
      configured: true,
      added: addResponse.ok || alreadyExists,
      verified: Boolean(addPayload?.verified || configPayload?.configuredBy === 'CNAME'),
      dns: configPayload,
    };
  } catch (error) {
    return {
      configured: true,
      error: error instanceof Error ? error.message : 'Unable to connect domain',
    };
  }
}
