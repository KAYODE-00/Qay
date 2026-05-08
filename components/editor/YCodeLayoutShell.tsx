'use client';

import { Suspense, useEffect, useRef } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import YCodeBuilder from '@/app/(builder)/ycode/components/YCodeBuilderMain';
import { useEditorUrl } from '@/hooks/use-editor-url';
import { useAuthStore } from '@/stores/useAuthStore';
import { useEditorStore } from '@/stores/useEditorStore';
import { usePagesStore } from '@/stores/usePagesStore';

function YCodeLayoutInner({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { routeType } = useEditorUrl();
  const { initialize } = useAuthStore();
  const qaySiteId = searchParams.get('site');
  const builderKey = qaySiteId ? `qay-site:${qaySiteId}` : 'ycode-global';
  const previousQaySiteId = useRef<string | null>(null);

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
      activeSidebarTab: 'layers',
      lastDesignUrl: null,
      previewReturnUrl: null,
      previewReturnTab: null,
    });
  }, [qaySiteId]);

  const prefixRoutes = ['/ycode/preview', '/ycode/devtools/'];
  const exactRoutes = ['/ycode/welcome', '/ycode/accept-invite'];
  const isExcludedRoute =
    prefixRoutes.some(route => pathname?.startsWith(route))
    || exactRoutes.includes(pathname || '');

  useEffect(() => {
    if (!qaySiteId || !pathname?.startsWith('/ycode') || isExcludedRoute) {
      return;
    }

    const query = searchParams.toString();
    const nextPath = pathname.replace(/^\/ycode/, '/qay/editor');
    const nextUrl = `${nextPath}${query ? `?${query}` : ''}`;

    router.replace(nextUrl);
  }, [isExcludedRoute, pathname, qaySiteId, router, searchParams]);

  if (qaySiteId && pathname?.startsWith('/ycode') && !isExcludedRoute) {
    return null;
  }

  if (isExcludedRoute) {
    return <>{children}</>;
  }

  if (routeType === 'settings' || routeType === 'localization' || routeType === 'profile' || routeType === 'forms' || routeType === 'integrations') {
    return <YCodeBuilder key={builderKey}>{children}</YCodeBuilder>;
  }

  return <YCodeBuilder key={builderKey} />;
}

export default function YCodeLayoutShell({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={null}>
      <YCodeLayoutInner>{children}</YCodeLayoutInner>
    </Suspense>
  );
}
