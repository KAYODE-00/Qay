'use client';

import { Suspense, useEffect, useRef } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import YCodeBuilder from '@/app/(builder)/ycode/components/YCodeBuilderMain';
import { useEditorUrl } from '@/hooks/use-editor-url';
import { useAssetsStore } from '@/stores/useAssetsStore';
import { useAuthStore } from '@/stores/useAuthStore';
import { useCanvasTextEditorStore } from '@/stores/useCanvasTextEditorStore';
import { useClipboardStore } from '@/stores/useClipboardStore';
import { useCollectionLayerStore } from '@/stores/useCollectionLayerStore';
import { useCollectionsStore } from '@/stores/useCollectionsStore';
import { useCollaborationPresenceStore } from '@/stores/useCollaborationPresenceStore';
import { useColorVariablesStore } from '@/stores/useColorVariablesStore';
import { useComponentsStore } from '@/stores/useComponentsStore';
import { useEditorStore } from '@/stores/useEditorStore';
import { useFilterStore } from '@/stores/useFilterStore';
import { useFontsStore } from '@/stores/useFontsStore';
import { useLayerStylesStore } from '@/stores/useLayerStylesStore';
import { useLocalisationStore } from '@/stores/useLocalisationStore';
import { usePagesStore, resetPagesStoreTransientState } from '@/stores/usePagesStore';
import { useSettingsStore } from '@/stores/useSettingsStore';
import { useVersionsStore } from '@/stores/useVersionsStore';

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
    resetPagesStoreTransientState();
    Object.values(useComponentsStore.getState().saveTimeouts).forEach((timeoutId) => clearTimeout(timeoutId));
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
    useCollectionsStore.setState({
      collections: [],
      fields: {},
      items: {},
      itemsTotalCount: {},
      lastItemsQuery: {},
      selectedCollectionId: null,
      isLoading: false,
      error: null,
    });
    useCollectionLayerStore.setState({
      layerData: {},
      loading: {},
      error: {},
      layerConfig: {},
      referencedItems: {},
      referencedLoading: {},
      paginationMeta: {},
      paginationLoading: {},
      invalidationKey: 0,
    });
    useColorVariablesStore.setState({
      colorVariables: [],
      isLoading: false,
      error: null,
      previewOverride: null,
    });
    useFontsStore.getState().reset();
    useComponentsStore.setState({
      components: [],
      isLoading: false,
      error: null,
      componentDrafts: {},
      componentDraftDirty: {},
      isSaving: false,
      saveTimeouts: {},
    });
    useLayerStylesStore.setState({
      styles: [],
      isLoading: false,
      error: null,
    });
    useAssetsStore.getState().reset();
    useSettingsStore.setState({
      settings: [],
      settingsByKey: {},
      isLoading: false,
      error: null,
    });
    useFilterStore.getState().reset();
    useCanvasTextEditorStore.setState({
      isEditing: false,
      editor: null,
      editingLayerId: null,
      activeMarks: {
        bold: false,
        italic: false,
        underline: false,
        strike: false,
        subscript: false,
        superscript: false,
        richTextLink: false,
        dynamicStyleKey: null,
        headingLevel: null,
      },
      onFinishCallback: null,
      onSaveCallback: null,
    });
    useClipboardStore.setState({
      clipboardLayer: null,
      clipboardMode: null,
      sourcePageId: null,
      copiedStyle: null,
      copiedInteractions: null,
    });
    useCollaborationPresenceStore.setState({
      users: {},
      resourceLocks: {},
      notifications: [],
      selectedUsers: [],
      isConnected: false,
      currentUserId: null,
      currentUserColor: '#3b82f6',
      currentUserAvatarUrl: null,
    });
    useLocalisationStore.setState({
      locales: [],
      isLoading: {
        load: false,
        create: false,
        update: false,
        delete: false,
        setDefault: false,
        loadTranslations: false,
        createTranslation: false,
        updateTranslation: false,
        updateTranslationValue: false,
        updateTranslationStatus: false,
        deleteTranslation: false,
      },
      error: null,
      defaultLocale: null,
      selectedLocaleId: null,
      translations: {},
    });
    useVersionsStore.setState({
      entityStates: {},
      versionCache: {},
      historySummaries: {},
      isLoading: false,
      error: null,
      sessionId: null,
      isUndoRedoInProgress: false,
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
