export function isMissingLocalisationSiteColumnError(error: unknown): boolean {
  const message = error instanceof Error
    ? error.message
    : typeof error === 'object' && error !== null && 'message' in error
      ? String((error as { message?: unknown }).message)
      : String(error || '');

  return message.includes('qay_site_id')
    && (
      message.includes('schema cache')
      || message.includes('column')
      || message.includes('Could not find')
    );
}
