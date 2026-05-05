'use client';

import { Suspense, useEffect, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import YCodeBuilder from './components/YCodeBuilderMain';
import { useEditorUrl } from '@/hooks/use-editor-url';
import { useAuthStore } from '@/stores/useAuthStore';
import { useEditorStore } from '@/stores/useEditorStore';
import { usePagesStore } from '@/stores/usePagesStore';

/**
 * YCode Editor Layout (Client Component)
 *
 * This layout wraps all /ycode routes and renders YCodeBuilder once.
 * By keeping YCodeBuilder at the layout level, it persists across route changes,
 * preventing remounts and avoiding duplicate API calls on navigation.
 *
 * Routes:
 * - /ycode - Base editor
 * - /ycode/pages/[id] - Page editing
 * - /ycode/layers/[id] - Layer editing
 * - /ycode/collections/[id] - Collection management
 * - /ycode/components/[id] - Component editing
 * - /ycode/settings - Settings pages
 * - /ycode/localization - Localization pages
 * - /ycode/profile - Profile pages
 *
 * Excluded routes:
 * - /ycode/preview - Preview routes are excluded and render independently
 *
 * YCodeBuilder uses useEditorUrl() to detect route changes and update
 * the UI accordingly without remounting.
 */

// Inner component that uses useSearchParams (via useEditorUrl)
function YCodeLayoutInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { routeType } = useEditorUrl();
  const { initialize } = useAuthStore();
  const qaySiteId = searchParams.get('site');
  const builderKey = qaySiteId ? `qay-site:${qaySiteId}` : 'ycode-global';
  const previousQaySiteId = useRef<string | null>(null);

  // Initialize auth only within /ycode routes (not on public pages)
  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    if (previousQaySiteId.current === qaySiteId) return;

    previousQaySiteId.current = qaySiteId;
    usePagesStore.setState({
      pages: [],
      folders: [],
      draftsByPageId: {},
      isLoading: false,
      error: null,
    });
    useEditorStore.setState({
      currentPageId: null,
      selectedLayerId: null,
      selectedLayerIds: [],
      lastSelectedLayerId: null,
      currentPageCollectionItemId: null,
      history: [],
      historyIndex: -1,
      editingComponentId: null,
      returnToPageId: null,
      returnToLayerId: null,
      componentNavigationStack: [],
      builderDataPreloaded: false,
      isSaving: false,
      isLoading: false,
    });
  }, [qaySiteId]);

  // Exclude standalone routes from YCodeBuilder
  // These routes should render independently without the editor UI
  const prefixRoutes = ['/ycode/preview', '/ycode/devtools/'];
  const exactRoutes = ['/ycode/welcome', '/ycode/accept-invite'];

  if (
    prefixRoutes.some(route => pathname?.startsWith(route))
    || exactRoutes.includes(pathname || '')
  ) {
    return <>{children}</>;
  }

  // For settings, localization, profile, forms, and integrations routes, pass children to YCodeBuilder so it can render them
  if (routeType === 'settings' || routeType === 'localization' || routeType === 'profile' || routeType === 'forms' || routeType === 'integrations') {
    return <YCodeBuilder key={builderKey}>{children}</YCodeBuilder>;
  }

  // YCodeBuilder handles all rendering based on URL
  // Children are ignored - routes are just for URL structure
  return <YCodeBuilder key={builderKey} />;
}

// Client layout wrapped in Suspense to handle useSearchParams
// Required by Next.js 14+ to prevent static rendering bailout
export default function YCodeLayoutClient({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={null}>
      <YCodeLayoutInner>{children}</YCodeLayoutInner>
    </Suspense>
  );
}
