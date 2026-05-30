'use client';

import { useRef, useEffect, useState, useMemo, type ComponentProps } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';
import { useEditorUrl } from '@/hooks/use-editor-url';
import { findHomepage } from '@/lib/page-utils';
import { getTranslationValue } from '@/lib/localisation-utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
// 4. Stores
import { useEditorStore } from '@/stores/useEditorStore';
import { usePagesStore } from '@/stores/usePagesStore';
import { useCollectionsStore } from '@/stores/useCollectionsStore';
import { useLocalisationStore } from '@/stores/useLocalisationStore';
import { buildSlugPath, buildDynamicPageUrl, buildLocalizedSlugPath, buildLocalizedDynamicPageUrl } from '@/lib/page-utils';

// 5. Types
import type { Page } from '@/types';
import type { User } from '@supabase/supabase-js';
import ActiveUsersInHeader from './ActiveUsersInHeader';
import InviteUserButton from './InviteUserButton';
import PublishPopover from './PublishPopover';
import Icon from '@/components/ui/icon';
import { Separator } from '@/components/ui/separator';
import { BackupRestoreDialog } from '@/components/project/BackupRestoreDialog';
import { readQayEditorSiteIdFromBrowser, readQayEditorSiteSlugFromBrowser } from '@/qay/lib/editor-site';
import { toCurrentEditorPath } from '@/qay/lib/editor-path';
import { getQaySiteBaseUrl } from '@/qay/lib/site-url';
import type { QaySite } from '@/qay/types';
import AiBuilderPanel from '@/qay/components/AiBuilderPanel';
import UserTemplateDialog from '@/qay/components/UserTemplateDialog';
import ImportHtmlDialog from './ImportHtmlDialog';
import { htmlToLayers } from '@/lib/html-layer-converter';

interface HeaderBarProps {
  user: User | null;
  signOut: () => Promise<void>;
  showPageDropdown: boolean;
  setShowPageDropdown: (show: boolean) => void;
  currentPage: Page | undefined;
  currentPageId: string | null;
  pages: Page[];
  setCurrentPageId: (id: string) => void;
  isSaving: boolean;
  hasUnsavedChanges: boolean;
  lastSaved: Date | null;
  isPublishing: boolean;
  setIsPublishing: (isPublishing: boolean) => void;
  saveImmediately: (pageId: string) => Promise<void>;
  activeTab: 'pages' | 'layers' | 'cms';
  onExitComponentEditMode?: () => void;
  onPublishSuccess: () => void;
  isSettingsRoute?: boolean;
}

type RailButtonProps = {
  title: string;
  icon: ComponentProps<typeof Icon>['name'];
  active?: boolean;
  onClick: () => void;
};

const QAY_SITE_SETTINGS_UPDATED_EVENT = 'qay-site-settings-updated';

type QayHeaderSite = Pick<QaySite, 'slug' | 'custom_domain' | 'domain_verified'>;

function RailButton({ title, icon, active, onClick }: RailButtonProps) {
  return (
    <button
      type="button"
      aria-label={title}
      title={title}
      onClick={onClick}
      className={`flex size-10 items-center justify-center rounded-lg border transition ${
        active
          ? 'border-primary/30 bg-primary/15 text-primary shadow-sm'
          : 'border-transparent text-muted-foreground hover:border-border hover:bg-accent hover:text-accent-foreground'
      }`}
    >
      <Icon name={icon} className="size-4" />
    </button>
  );
}

export default function HeaderBar({
  showPageDropdown,
  setShowPageDropdown,
  currentPage,
  currentPageId,
  pages,
  setCurrentPageId,
  isSaving,
  hasUnsavedChanges,
  lastSaved,
  isPublishing,
  setIsPublishing,
  saveImmediately,
  activeTab,
  onExitComponentEditMode,
  onPublishSuccess,
  isSettingsRoute = false,
}: HeaderBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const pageDropdownRef = useRef<HTMLDivElement>(null);
  const currentQaySiteId = readQayEditorSiteIdFromBrowser();
  const { currentPageCollectionItemId, currentPageId: storeCurrentPageId, isPreviewMode, setPreviewMode, openFileManager, setKeyboardShortcutsOpen, setActiveSidebarTab, lastDesignUrl, setLastDesignUrl, previewReturnUrl, previewReturnTab, setPreviewReturn } = useEditorStore();
  const { folders, pages: storePages } = usePagesStore();
  const { items, fields, collections, selectedCollectionId: storeSelectedCollectionId, setSelectedCollectionId } = useCollectionsStore();
  const { locales, selectedLocaleId, setSelectedLocaleId, translations } = useLocalisationStore();
  const { navigateToLayers, navigateToCollection, navigateToCollections, updateQueryParams, routeType } = useEditorUrl();

  // Optimistic nav button state - set immediately on click, cleared when URL catches up
  type NavButton = 'design' | 'cms' | 'forms';
  const [optimisticNav, setOptimisticNav] = useState<NavButton | null>(null);

  const withCurrentSite = (path: string) => {
    if (typeof window === 'undefined') return path;
    return toCurrentEditorPath(path, pathname, currentQaySiteId);
  };

  const getValidLastDesignUrl = () => {
    if (!lastDesignUrl || typeof window === 'undefined') {
      return null;
    }

    try {
      const url = new URL(lastDesignUrl, window.location.origin);
      const matchedPageId = url.pathname.match(/\/(?:ycode|qay\/editor)\/layers\/([^/]+)$/)?.[1]
        || url.pathname.match(/\/(?:ycode|qay\/editor)\/pages\/([^/]+)$/)?.[1];

      if (!matchedPageId) {
        return null;
      }

      const targetSiteId = url.searchParams.get('site');
      if ((currentQaySiteId || targetSiteId) && currentQaySiteId !== targetSiteId) {
        return null;
      }

      const pageExists = storePages.some((page) => page.id === matchedPageId);
      return pageExists ? `${url.pathname}${url.search}` : null;
    } catch {
      return null;
    }
  };

  const importHtmlAsPage = async (html: string, options?: { pageName?: string }) => {
    if (!currentQaySiteId) {
      window.alert('Open this editor from a QAY site before importing a page.');
      return;
    }

    let importedLayers;
    try {
      importedLayers = htmlToLayers(html);
    } catch (error) {
      console.error('[QAY import page] Failed to parse HTML:', error);
      window.alert('QAY could not read that HTML. Check the code and try again.');
      return;
    }

    if (!importedLayers.length) {
      window.alert('No valid HTML elements were found to import.');
      return;
    }

    try {
      const response = await fetch(`/api/qay/sites/${currentQaySiteId}/import-html`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          layers: importedLayers,
          pageName: options?.pageName || 'Imported page',
        }),
      });
      const payload = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(payload?.error || 'Unable to import this page.');
      }

      await usePagesStore.getState().loadPages();

      const importedPageId = payload?.pageId as string | undefined;
      if (importedPageId) {
        router.push(withCurrentSite(`/ycode/layers/${importedPageId}`));
      }
    } catch (error) {
      console.error('[QAY import page] Failed to create page:', error);
      window.alert(error instanceof Error ? error.message : 'Unable to import this page.');
    }
  };

  // Clear optimistic state once the URL reflects the clicked route
  useEffect(() => {
    if (!optimisticNav) return;
    const isDesignRoute = routeType === 'layers' || routeType === 'page' || routeType === 'component' || routeType === null;
    const isCmsRoute = routeType === 'collection' || routeType === 'collections-base';
    const isFormsRoute = routeType === 'forms';

    if (
      (optimisticNav === 'design' && isDesignRoute) ||
      (optimisticNav === 'cms' && isCmsRoute) ||
      (optimisticNav === 'forms' && isFormsRoute)
    ) {
      setOptimisticNav(null);
    }
  }, [routeType, optimisticNav]);

  // Turn off preview mode only after navigation to the return route completes,
  // keeping the preview overlay visible during the transition to avoid flashing
  useEffect(() => {
    if (!isPreviewMode || previewReturnUrl) return;
    const isDesignRoute = routeType === 'layers' || routeType === 'page' || routeType === 'component' || routeType === null;
    if (!isDesignRoute) {
      setPreviewMode(false);
    }
  }, [routeType, isPreviewMode, previewReturnUrl, setPreviewMode]);

  // Derive active button: optimistic state takes priority, then URL
  const activeNavButton = useMemo((): NavButton | null => {
    if (optimisticNav) return optimisticNav;
    if (routeType === 'collection' || routeType === 'collections-base') return 'cms';
    if (routeType === 'forms') return 'forms';
    if (routeType === 'layers' || routeType === 'page' || routeType === 'component' || routeType === null) return 'design';
    return null;
  }, [optimisticNav, routeType]);

  const [theme, setTheme] = useState<'system' | 'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme') as 'system' | 'light' | 'dark' | null;
      return savedTheme || 'dark';
    }
    return 'dark';
  });
  const [baseUrl, setBaseUrl] = useState<string>('');
  const [currentQaySiteSlug, setCurrentQaySiteSlug] = useState<string | null>(null);
  const [showTransferDialog, setShowTransferDialog] = useState(false);
  const [isAiBuilderOpen, setIsAiBuilderOpen] = useState(false);
  const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false);
  const [isImportPageOpen, setIsImportPageOpen] = useState(false);

  // Get current host after mount
  useEffect(() => {
    const protocol = window.location.protocol;
    const fallbackBaseUrl = `${protocol}//${window.location.host}`;
    const siteId = readQayEditorSiteIdFromBrowser();
    const siteSlug = readQayEditorSiteSlugFromBrowser();

    const applySiteUrl = (site: QayHeaderSite | null) => {
      if (!site?.slug) {
        setBaseUrl(fallbackBaseUrl);
        return;
      }

      setCurrentQaySiteSlug(site.slug);
      setBaseUrl(getQaySiteBaseUrl(site) || fallbackBaseUrl);
    };

    if (siteSlug) {
      setCurrentQaySiteSlug(siteSlug);
      const directBaseUrl = getQaySiteBaseUrl({
        slug: siteSlug,
        custom_domain: null,
        domain_verified: false,
      });

      if (directBaseUrl) {
        setBaseUrl(directBaseUrl);
      }
    }

    if (!siteId) {
      setBaseUrl(fallbackBaseUrl);
      return;
    }

    let isCancelled = false;

    const loadSiteUrl = () => {
      void fetch(`/api/qay/sites/${siteId}`, { cache: 'no-store' })
        .then(async (response) => {
          if (!response.ok) {
            return null;
          }

          const payload = await response.json().catch(() => null);
          return payload?.data as QayHeaderSite | null;
        })
        .catch(() => null)
        .then((site) => {
          if (!isCancelled) {
            applySiteUrl(site);
          }
        });
    };

    const handleSiteSettingsUpdated = (event: Event) => {
      const site = (event as CustomEvent<QayHeaderSite>).detail;
      if (site?.slug) {
        applySiteUrl(site);
        return;
      }

      loadSiteUrl();
    };

    window.addEventListener(QAY_SITE_SETTINGS_UPDATED_EVENT, handleSiteSettingsUpdated);
    loadSiteUrl();

    return () => {
      isCancelled = true;
      window.removeEventListener(QAY_SITE_SETTINGS_UPDATED_EVENT, handleSiteSettingsUpdated);
    };
  }, [currentQaySiteId]);

  // Get selected locale (computed from subscribed store values)
  const selectedLocale = useMemo(() => {
    if (!selectedLocaleId) return null;
    return locales.find(l => l.id === selectedLocaleId) || null;
  }, [selectedLocaleId, locales]);

  // Get translations for the selected locale
  const localeTranslations = useMemo(() => {
    return selectedLocaleId ? translations[selectedLocaleId] : undefined;
  }, [selectedLocaleId, translations]);

  // Build full page path including folders (memoized for performance)
  const fullPagePath = useMemo(() => {
    if (!currentPage) return '/';
    return buildSlugPath(currentPage, folders, 'page');
  }, [currentPage, folders]);

  // Build localized page path with translated slugs
  const localizedPagePath = useMemo(() => {
    // If no current page, use homepage for localization route
    const pageToUse = currentPage || (isSettingsRoute ? findHomepage(storePages) : null);

    if (!pageToUse) return '/';

    return buildLocalizedSlugPath(
      pageToUse,
      folders,
      'page',
      selectedLocale,
      localeTranslations
    );
  }, [currentPage, isSettingsRoute, storePages, folders, selectedLocale, localeTranslations]);

  // Get collection item slug value for dynamic pages (with translation support)
  const collectionItemSlug = useMemo(() => {
    if (!currentPage?.is_dynamic || !currentPageCollectionItemId) {
      return null;
    }

    const collectionId = currentPage.settings?.cms?.collection_id;
    const slugFieldId = currentPage.settings?.cms?.slug_field_id;

    if (!collectionId || !slugFieldId) {
      return null;
    }

    // Find the item in the store
    const collectionItems = items[collectionId] || [];
    const selectedItem = collectionItems.find(item => item.id === currentPageCollectionItemId);

    if (!selectedItem || !selectedItem.values) {
      return null;
    }

    // Get the slug value from the item's values
    let slugValue = selectedItem.values[slugFieldId];

    // If locale is selected, check for translated slug
    if (localeTranslations && slugValue) {
      const collectionFields = fields[collectionId] || [];
      const slugField = collectionFields.find((f: { id: string; key: string | null }) => f.id === slugFieldId);

      if (slugField) {
        // Build translation key: field:key:{key} or field:id:{id}
        const contentKey = slugField.key
          ? `field:key:${slugField.key}`
          : `field:id:${slugField.id}`;
        const translationKey = `cms:${currentPageCollectionItemId}:${contentKey}`;
        const translation = localeTranslations[translationKey];

        const translatedSlug = getTranslationValue(translation);
        if (translatedSlug) {
          slugValue = translatedSlug;
        }
      }
    }

    return slugValue || null;
  }, [currentPage, currentPageCollectionItemId, items, fields, localeTranslations]);

  // Build preview URL (special handling for error pages and dynamic pages)
  const previewUrl = useMemo(() => {
    if (!currentPage) return '';

    // Error pages use special preview route
    if (currentPage.error_page !== null) {
      return `/qay/preview/error-pages/${currentPage.error_page}`;
    }

    // For dynamic pages, use localized dynamic URL builder
    const path = currentPage.is_dynamic
      ? buildLocalizedDynamicPageUrl(currentPage, folders, collectionItemSlug, selectedLocale, localeTranslations)
      : localizedPagePath;

    return `/qay/preview${path === '/' ? '' : path}`;
  }, [currentPage, folders, localizedPagePath, collectionItemSlug, selectedLocale, localeTranslations]);

  // Build published URL (for the link in the center)
  const publishedUrl = useMemo(() => {
    // If no current page, use homepage for localization route
    const pageToUse = currentPage || (isSettingsRoute ? findHomepage(storePages) : null);
    if (!pageToUse) return '';

    // For dynamic pages, use localized dynamic URL builder
    const path = pageToUse.is_dynamic
      ? buildLocalizedDynamicPageUrl(pageToUse, folders, collectionItemSlug, selectedLocale, localeTranslations)
      : localizedPagePath;

    return path === '/' ? '' : path;
  }, [currentPage, isSettingsRoute, storePages, folders, localizedPagePath, collectionItemSlug, selectedLocale, localeTranslations]);

  const publishBaseUrl = useMemo(() => {
    if (!baseUrl || !currentQaySiteSlug) {
      return baseUrl;
    }

    try {
      const url = new URL(baseUrl);
      const firstSegment = url.pathname.split('/').filter(Boolean)[0];
      if (url.hostname.endsWith('.vercel.app') && firstSegment !== currentQaySiteSlug) {
        return `${url.origin}/${currentQaySiteSlug}`;
      }
    } catch {
      return baseUrl;
    }

    return baseUrl;
  }, [baseUrl, currentQaySiteSlug]);

  const publishDisplayUrl = useMemo(() => {
    if (!publishBaseUrl) {
      return '';
    }

    return `${publishBaseUrl}${publishedUrl}`;
  }, [publishBaseUrl, publishedUrl]);

  const goToDesign = () => {
    setOptimisticNav('design');
    setActiveSidebarTab('layers');
    const validLastDesignUrl = getValidLastDesignUrl();
    if (validLastDesignUrl) {
      router.push(validLastDesignUrl);
      return;
    }

    if (lastDesignUrl) {
      setLastDesignUrl(null);
    }

    const targetPageId = storeCurrentPageId || findHomepage(storePages)?.id || storePages[0]?.id;
    if (targetPageId) {
      navigateToLayers(targetPageId);
    }
  };

  const goToCms = () => {
    const isDesignRoute = routeType === 'layers' || routeType === 'page' || routeType === 'component';
    if (isDesignRoute) {
      setLastDesignUrl(window.location.pathname + window.location.search);
    }

    setOptimisticNav('cms');
    setActiveSidebarTab('cms');
    const targetCollectionId = storeSelectedCollectionId || collections[0]?.id;
    if (targetCollectionId) {
      setSelectedCollectionId(targetCollectionId);
      navigateToCollection(targetCollectionId);
    } else {
      navigateToCollections();
    }
  };

  const goToForms = () => {
    const isDesignRoute = routeType === 'layers' || routeType === 'page' || routeType === 'component';
    if (isDesignRoute) {
      setLastDesignUrl(window.location.pathname + window.location.search);
    }

    setOptimisticNav('forms');
    router.push(withCurrentSite('/ycode/forms'));
  };

  // Apply theme to HTML element
  useEffect(() => {
    const root = document.documentElement;

    if (theme === 'system') {
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (systemPrefersDark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    } else if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    localStorage.setItem('theme', theme);
    window.dispatchEvent(new Event('qay-theme-change'));
  }, [theme]);

  // Close page dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pageDropdownRef.current && !pageDropdownRef.current.contains(event.target as Node)) {
        setShowPageDropdown(false);
      }
    };

    if (showPageDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showPageDropdown, setShowPageDropdown]);

  return (
    <>
    <header className="h-14 bg-background border-b grid grid-cols-3 items-center px-4">
      {/* Left: Logo & Navigation */}
      <div className="flex items-center gap-2">
        <Button
          variant="secondary" size="sm"
          className="size-9! rounded-lg p-0"
          onClick={() => router.push('/dashboard')}
          title="Dashboard"
          aria-label="Dashboard"
        >
          <Image
            src="/qay-filled.svg"
            alt=""
            width={20}
            height={20}
            className="size-5 object-contain dark:hidden"
          />
          <Image
            src="/qay-filled-light.svg"
            alt=""
            width={20}
            height={20}
            className="hidden size-5 object-contain dark:block"
          />
        </Button>
      </div>

      <div className="flex gap-1.5 items-center justify-center">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="xs" variant="ghost">
              <Icon name="globe" />
              {selectedLocale ? selectedLocale.code.toUpperCase() : 'EN'}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuRadioGroup
              value={selectedLocaleId || ''}
              onValueChange={(value) => setSelectedLocaleId(value)}
            >
              {locales.map((locale) => (
                <DropdownMenuRadioItem key={locale.id} value={locale.id}>
                  <span className="flex items-center gap-3">
                    {locale.label}
                    {locale.is_default && (
                      <Badge variant="secondary" className="text-[10px] mr-5">
                        Default
                      </Badge>
                    )}
                  </span>
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
            {!pathname?.startsWith('/ycode/localization') && !pathname?.startsWith('/qay/editor/localization') && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => router.push(withCurrentSite('/ycode/localization'))}
                >
                  Manage locales
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="h-5">
          <Separator orientation="vertical" />
        </div>

        <Button
          size="xs"
          variant="ghost"
          asChild
        >
          <a
            href={publishDisplayUrl || publishBaseUrl} target="_blank"
            rel="noopener noreferrer"
            title={publishDisplayUrl || publishBaseUrl}
            className="max-w-[28rem] truncate"
          >
            {publishDisplayUrl || publishBaseUrl}
          </a>
        </Button>

      </div>

      {/* Right: User & Actions */}
      <div className="flex items-center justify-end gap-2">
        {/* Active Users */}
        <ActiveUsersInHeader />

        {/* Save Status Indicator */}
        <div className="flex items-center justify-end w-16 text-xs text-zinc-500 dark:text-white/50">
          {isSaving ? (
            <>
              <span>Saving</span>
            </>
          ) : hasUnsavedChanges ? (
            <>
              <span>Unsaved</span>
            </>
          ) : lastSaved ? (
            <>
              <span>Saved</span>
            </>
          ) : (
            <>
              <span>Ready</span>
            </>
          )}
        </div>

        {/* Preview button */}
        <Button
          size="sm"
          variant="secondary"
          onClick={() => {
            if (isPreviewMode) {
              if (previewReturnUrl) {
                // Navigate back while keeping preview visible — the useEffect
                // above will turn off preview once the route change completes
                if (previewReturnTab) {
                  setActiveSidebarTab(previewReturnTab);
                }
                router.push(previewReturnUrl);
                setPreviewReturn(null);
                return;
              }

              setPreviewMode(false);
              updateQueryParams({ preview: undefined });
              return;
            }

            setPreviewMode(true);

            // Preview renders the current page, so when invoked from a non-design
            // route (CMS, forms, etc.) we need to jump to the layers view first
            const isDesignRoute = routeType === 'layers' || routeType === 'page' || routeType === 'component' || routeType === null;
            if (!isDesignRoute && currentPageId) {
              setPreviewReturn(window.location.pathname + window.location.search, activeTab);
              setActiveSidebarTab('layers');
              const params = new URLSearchParams(window.location.search);
              params.set('preview', 'true');
              router.push(withCurrentSite(`/ycode/layers/${currentPageId}?${params.toString()}`));
              return;
            }

            updateQueryParams({ preview: 'true' });
          }}
          disabled={!currentPage || isSaving}
          className={isPreviewMode ? 'bg-black text-white hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-white/90' : ''}
        >
          <Icon name="preview" />
        </Button>

        <PublishPopover
          isPublishing={isPublishing}
          setIsPublishing={setIsPublishing}
          baseUrl={publishBaseUrl}
          publishedUrl={publishedUrl}
          onPublishSuccess={onPublishSuccess}
        />

      </div>
    </header>

    <aside className="fixed left-0 top-14 bottom-0 z-40 flex w-16 flex-col items-center border-r border-border bg-background/95 px-2 py-3 shadow-sm backdrop-blur">
      <div className="flex flex-1 flex-col items-center gap-2">
        <RailButton
          title="Design" icon="cursor-default"
          active={activeNavButton === 'design'} onClick={goToDesign}
        />
        <RailButton
          title="CMS" icon="database"
          active={activeNavButton === 'cms'} onClick={goToCms}
        />
        <RailButton
          title="Forms" icon="form"
          active={activeNavButton === 'forms'} onClick={goToForms}
        />
        <RailButton
          title="AI Builder" icon="wand-sparkles"
          active={isAiBuilderOpen}
          onClick={() => setIsAiBuilderOpen((current) => !current)}
        />

        <div className="my-2 h-px w-8 bg-border" />

        <RailButton
          title="File manager" icon="folder"
          onClick={() => openFileManager()}
        />
        <RailButton
          title="Import page" icon="code"
          onClick={() => setIsImportPageOpen(true)}
        />
        <RailButton
          title="Make template" icon="component"
          onClick={() => setIsTemplateDialogOpen(true)}
        />
        <RailButton
          title="Integrations" icon="zap-outline"
          onClick={() => router.push(withCurrentSite('/ycode/integrations/apps'))}
        />
        <RailButton
          title={currentQaySiteId ? 'General settings' : 'Settings'} icon="settings"
          onClick={() => router.push(withCurrentSite('/ycode/settings/general'))}
        />
        <RailButton
          title="Backup and restore" icon="undo"
          onClick={() => setShowTransferDialog(true)}
        />
        <RailButton
          title="Localization" icon="globe"
          onClick={() => router.push(withCurrentSite('/ycode/localization'))}
        />
        <InviteUserButton
          siteId={currentQaySiteId}
          compact
          contentSide="right"
          contentAlign="start"
          className="size-10 rounded-lg border border-transparent bg-transparent p-0 text-muted-foreground shadow-none transition hover:border-border hover:bg-accent hover:text-accent-foreground"
        />
      </div>

      <div className="flex flex-col items-center gap-2">
        <RailButton
          title="Upgrade" icon="zap"
          onClick={() => router.push('/pricing')}
        />
        <RailButton
          title="Keyboard shortcuts" icon="code"
          onClick={() => setKeyboardShortcutsOpen(true)}
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              aria-label="Theme"
              title="Theme"
              className="flex size-10 items-center justify-center rounded-lg border border-transparent text-muted-foreground transition hover:border-border hover:bg-accent hover:text-accent-foreground"
            >
              <Icon name="paintbrush" className="size-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="right" align="end">
            <DropdownMenuRadioGroup value={theme} onValueChange={(value) => setTheme(value as 'system' | 'light' | 'dark')}>
              <DropdownMenuRadioItem value="system">System</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="light">Light</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="dark">Dark</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </aside>

    <BackupRestoreDialog
      open={showTransferDialog}
      onOpenChange={setShowTransferDialog}
    />
    <AiBuilderPanel
      open={isAiBuilderOpen}
      onOpenChange={setIsAiBuilderOpen}
    />
    <UserTemplateDialog
      open={isTemplateDialogOpen}
      onOpenChange={setIsTemplateDialogOpen}
    />
    <ImportHtmlDialog
      open={isImportPageOpen}
      onOpenChange={setIsImportPageOpen}
      onImport={importHtmlAsPage}
      mode="page"
    />
    </>
  );
}
