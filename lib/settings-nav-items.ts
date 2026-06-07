/**
 * Settings navigation items for the settings sidebar.
 * Extracted for reuse and to allow cloud overlay to filter items.
 */

export interface SettingsNavItem {
  id: string;
  label: string;
  path: string;
  requiresSite?: boolean;
}

export const SETTINGS_NAV_ITEMS: SettingsNavItem[] = [
  { id: 'general', label: 'General', path: '/ycode/settings/general' },
  { id: 'site-users', label: 'Site users', path: '/ycode/settings/site-users', requiresSite: true },
  { id: 'commerce', label: 'Commerce', path: '/ycode/settings/commerce', requiresSite: true },
  { id: 'users', label: 'Invites', path: '/ycode/settings/users' },
  { id: 'redirects', label: 'Redirects', path: '/ycode/settings/redirects' },
  { id: 'email', label: 'Email', path: '/ycode/settings/email' },
  { id: 'templates', label: 'Templates', path: '/ycode/settings/templates' },
];
