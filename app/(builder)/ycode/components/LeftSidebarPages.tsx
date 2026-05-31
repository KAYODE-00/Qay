'use client';

import React, { useState, useEffect, useRef, startTransition, Suspense, lazy } from 'react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import Icon from '@/components/ui/icon';
import PagesTree from './PagesTree';
import { type PageFormData, type PageSettingsPanelHandle } from './PageSettingsPanel';
import { type FolderFormData, type FolderSettingsPanelHandle } from './FolderSettingsPanel';

// Lazy-loaded components (heavy settings panels, not needed immediately)
const PageSettingsPanel = lazy(() => import('./PageSettingsPanel'));
const FolderSettingsPanel = lazy(() => import('./FolderSettingsPanel'));
import { usePagesStore } from '@/stores/usePagesStore';
import { useEditorStore } from '@/stores/useEditorStore';
import { useEditorActions, useEditorUrl } from '@/hooks/use-editor-url';
import { useLivePageUpdates } from '@/hooks/use-live-page-updates';
import type { Page, PageFolder, PageSettings } from '@/types';
import { useCollectionsStore } from '@/stores/useCollectionsStore';
import { Separator } from '@/components/ui/separator';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { generateUniqueSlug, generateUniqueFolderSlug, getNextNumberFromNames, getParentContextFromSelection, calculateNextOrder, findNextSelection } from '@/lib/page-utils';
import { generateId } from '@/lib/utils';
import { getTiptapTextContent } from '@/lib/text-format-utils';
import { toast } from 'sonner';

interface LeftSidebarPagesProps {
  pages: Page[];
  folders: PageFolder[];
  currentPageId: string | null;
  onPageSelect: (pageId: string) => void;
  setCurrentPageId: (pageId: string | null) => void;
}

type AuthUtilityMode = 'auth' | 'login' | 'signup' | 'forgot-password' | 'reset-password';

function isAuthUtilityPage(page: Page) {
  const specialPage = String((page.settings as Record<string, unknown> | null | undefined)?.qay_special_page || '');
  return page.error_page === null && (
    ['login', 'signup', 'forgot-password', 'reset-password'].includes(specialPage)
    || ['login', 'signup', 'forgot-password', 'reset-password'].includes(page.slug)
  );
}

function richTextVariable(content: string) {
  return {
    text: {
      type: 'dynamic_rich_text',
      data: {
        content: getTiptapTextContent(content),
      },
    },
  };
}

function textLayer(content: string, classes: string, tag = 'p') {
  return {
    id: generateId('text'),
    name: tag === 'h1' || tag === 'h2' || tag === 'h3' ? 'heading' : 'text',
    settings: { tag },
    classes,
    restrictions: { editText: true },
    variables: richTextVariable(content),
    children: [],
  };
}

function authInput(label: string, name: string, type: string, placeholder: string) {
  return {
    id: generateId('div'),
    name: 'div',
    settings: { tag: 'label' },
    classes: 'grid gap-2',
    children: [
      textLayer(label, 'text-sm font-medium text-white/72', 'span'),
      {
        id: generateId('input'),
        name: 'input',
        classes: 'h-12 w-full rounded-xl border border-white/10 bg-black/35 px-4 text-sm text-white placeholder:text-white/25 outline-none transition focus:border-white/35',
        attributes: {
          name,
          type,
          placeholder,
          required: true,
        },
        children: [],
      },
    ],
  };
}

function authSubmitButton(label: string) {
  return {
    id: generateId('button'),
    name: 'button',
    customName: label,
    settings: { tag: 'button' },
    classes: 'flex h-12 w-full items-center justify-center rounded-xl bg-white px-5 text-sm font-semibold text-black transition hover:bg-white/90',
    attributes: { type: 'submit' },
    children: [
      textLayer(label, '', 'span'),
    ],
  };
}

function authLinkButton(label: string, href: string) {
  return {
    id: generateId('button'),
    name: 'button',
    customName: label,
    settings: { tag: 'a' },
    classes: 'inline-flex items-center justify-center rounded-xl border border-white/10 px-5 py-3 text-sm font-medium text-white/72 transition hover:border-white/25 hover:text-white',
    attributes: { href },
    children: [
      textLayer(label, '', 'span'),
    ],
  };
}

function createAuthPageTemplateLayers(mode: AuthUtilityMode) {
  const layerId = (name: string) => generateId(name);
  const isSignup = mode === 'signup';
  const isForgotPassword = mode === 'forgot-password';
  const isResetPassword = mode === 'reset-password';
  const isAuthLanding = mode === 'auth';
  const title = isAuthLanding
    ? 'Private access for your visitors.'
    : isSignup
      ? 'Create your account.'
      : isForgotPassword
        ? 'Recover your account.'
        : isResetPassword
          ? 'Set a new password.'
          : 'Sign in to continue.';
  const eyebrow = isAuthLanding
    ? 'Protected site'
    : isSignup
      ? 'Visitor sign up'
      : isForgotPassword
        ? 'Password recovery'
        : isResetPassword
          ? 'Password reset'
          : 'Visitor login';
  const body = isAuthLanding
    ? 'Create separate editable login and sign-up pages, then style every section in QAY.'
    : isForgotPassword
      ? 'Visitors can request a secure reset link without touching your builder account.'
      : isResetPassword
        ? 'Visitors can set a fresh password and continue into this protected site.'
        : 'This form is part of the page, so you can style the text, spacing, fields, and buttons directly in the editor.';
  const formMode = isSignup
    ? 'signup'
    : isForgotPassword
      ? 'forgot-password'
      : isResetPassword
        ? 'reset-password'
        : 'signin';

  return [
    {
      id: 'body',
      name: 'body',
      classes: 'min-h-screen bg-[#080808] text-white',
      children: [
        {
          id: layerId('section'),
          name: 'section',
          classes: 'min-h-screen px-6 py-16 flex items-center justify-center bg-[#080808] text-white',
          children: [
            {
              id: layerId('div'),
              name: 'div',
              customName: 'Auth page shell',
              classes: 'w-full max-w-6xl grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center',
              children: [
                {
                  id: layerId('div'),
                  name: 'div',
                  classes: 'space-y-7',
                  children: [
                    {
                      ...textLayer(eyebrow, 'text-xs uppercase tracking-[0.28em] text-white/45'),
                    },
                    textLayer(title, 'max-w-3xl text-5xl font-semibold leading-[0.96] tracking-tight sm:text-7xl', 'h1'),
                    textLayer(body, 'max-w-xl text-base leading-8 text-white/60'),
                    ...(isAuthLanding ? [
                      {
                        id: layerId('div'),
                        name: 'div',
                        classes: 'flex flex-wrap gap-3',
                        children: [
                          authLinkButton('Open login page', '/login'),
                          authLinkButton('Open sign up page', '/signup'),
                        ],
                      },
                    ] : []),
                  ],
                },
                {
                  id: layerId('div'),
                  name: 'div',
                  customName: isAuthLanding
                    ? 'Auth page links'
                    : isSignup
                      ? 'Sign up form'
                      : isForgotPassword
                        ? 'Forgot password form'
                        : isResetPassword
                          ? 'Reset password form'
                          : 'Login form',
                  classes: 'rounded-2xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl shadow-black/40 backdrop-blur',
                  children: isAuthLanding ? [
                    textLayer('Choose the page your visitors need.', 'text-2xl font-semibold text-white', 'h2'),
                    textLayer('Use the buttons below to route visitors to your editable login and sign-up pages.', 'mt-3 text-sm leading-6 text-white/55'),
                    {
                      id: layerId('div'),
                      name: 'div',
                      classes: 'mt-6 grid gap-3 sm:grid-cols-2',
                      children: [
                        authLinkButton('Login', '/login'),
                        authLinkButton('Sign up', '/signup'),
                      ],
                    },
                  ] : [
                    {
                      id: layerId('form'),
                      name: 'form',
                      customName: isSignup
                        ? 'Visitor sign up form'
                        : isForgotPassword
                          ? 'Visitor forgot password form'
                          : isResetPassword
                            ? 'Visitor reset password form'
                            : 'Visitor login form',
                      classes: 'grid gap-5',
                      attributes: {
                        method: 'POST',
                        'data-qay-site-auth-form': formMode,
                      },
                      children: [
                        textLayer(
                          isSignup
                            ? 'Create access'
                            : isForgotPassword
                              ? 'Send reset link'
                              : isResetPassword
                                ? 'Choose new password'
                                : 'Welcome back',
                          'text-2xl font-semibold text-white',
                          'h2'
                        ),
                        textLayer(
                          isSignup
                            ? 'Enter your details to join this protected site.'
                            : isForgotPassword
                              ? 'Enter the email you used for this site. If it exists, we will send a reset link.'
                              : isResetPassword
                                ? 'Enter a new password for your visitor account.'
                                : 'Enter your details to continue.',
                          'text-sm leading-6 text-white/55'
                        ),
                        {
                          id: layerId('div'),
                          name: 'div',
                          attributes: { 'data-qay-site-auth-error': '', hidden: true },
                          classes: 'rounded-lg border border-red-400/25 bg-red-500/10 px-3 py-2 text-sm text-red-100',
                          children: [
                            textLayer('Unable to continue.', '', 'span'),
                          ],
                        },
                        ...(isForgotPassword ? [
                          {
                            id: layerId('div'),
                            name: 'div',
                            attributes: { 'data-qay-site-auth-success': '', hidden: true },
                            classes: 'rounded-lg border border-emerald-400/25 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-100',
                            children: [
                              textLayer('If an account exists, a reset link has been sent.', '', 'span'),
                            ],
                          },
                        ] : []),
                        {
                          id: layerId('div'),
                          name: 'div',
                          classes: 'grid gap-4',
                          children: [
                            ...(isSignup ? [authInput('Name', 'fullName', 'text', 'Jane Doe')] : []),
                            authInput('Email', 'email', 'email', 'you@example.com'),
                            ...(isForgotPassword ? [] : [
                              authInput(isResetPassword ? 'New password' : 'Password', 'password', 'password', 'At least 8 characters'),
                            ]),
                          ],
                        },
                        authSubmitButton(
                          isSignup
                            ? 'Create account'
                            : isForgotPassword
                              ? 'Send reset link'
                              : isResetPassword
                                ? 'Set new password'
                                : 'Sign in'
                        ),
                        ...(isResetPassword ? [
                          authLinkButton('Back to login', '/login'),
                        ] : isForgotPassword ? [
                          authLinkButton('Back to login', '/login'),
                        ] : [
                          authLinkButton(isSignup ? 'Already have access? Sign in' : 'Need access? Create account', isSignup ? '/login' : '/signup'),
                          ...(!isSignup ? [authLinkButton('Forgot password?', '/forgot-password')] : []),
                        ]),
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ] as any;
}

function authTemplateNeedsRepair(layers: unknown, mode: AuthUtilityMode) {
  const stack = Array.isArray(layers) ? [...layers] : [];
  let hasRichText = false;
  let hasModeForm = mode === 'auth';
  let hasForgotPasswordButton = mode !== 'login';
  const expectedFormMode = mode === 'signup'
    ? 'signup'
    : mode === 'forgot-password'
      ? 'forgot-password'
      : mode === 'reset-password'
        ? 'reset-password'
        : 'signin';

  while (stack.length > 0) {
    const layer = stack.pop() as any;
    if (!layer || typeof layer !== 'object') continue;

    if (layer.variables?.text?.type === 'dynamic_rich_text' || layer.variables?.text?.type === 'dynamic_text') {
      hasRichText = true;
    }

    if (mode !== 'auth' && layer.attributes?.['data-qay-site-auth-form'] === expectedFormMode) {
      hasModeForm = true;
    }

    if (
      mode === 'login'
      && (
        layer.attributes?.href === '/forgot-password'
        || layer.variables?.link?.data?.url === '/forgot-password'
      )
    ) {
      hasForgotPasswordButton = true;
    }

    if (Array.isArray(layer.children)) {
      stack.push(...layer.children);
    }
  }

  return !hasRichText || !hasModeForm || !hasForgotPasswordButton;
}

export default function LeftSidebarPages({
  pages,
  folders,
  currentPageId,
  onPageSelect,
  setCurrentPageId,
}: LeftSidebarPagesProps) {
  const { urlState } = useEditorUrl();
  const activeSidebarTab = useEditorStore((state) => state.activeSidebarTab);
  const { openPage, openPageEdit, openPageLayers, navigateToLayers, navigateToPage, navigateToPageEdit, navigateToCollections } = useEditorActions();
  const [showPageSettings, setShowPageSettings] = useState(false);
  const [showFolderSettings, setShowFolderSettings] = useState(false);
  const [editingPage, setEditingPage] = useState<Page | null>(null);
  const [editingFolder, setEditingFolder] = useState<PageFolder | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(currentPageId);
  const selectedItemIdRef = React.useRef<string | null>(currentPageId);
  const pageSettingsPanelRef = useRef<PageSettingsPanelHandle>(null);
  const folderSettingsPanelRef = useRef<FolderSettingsPanelHandle>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<{ id: string; type: 'folder' | 'page' } | null>(null);

  const selectedPage = React.useMemo(() => {
    if (!selectedItemId) return null;
    return pages.find((page) => page.id === selectedItemId) || null;
  }, [pages, selectedItemId]);

  const selectedFolder = React.useMemo(() => {
    if (!selectedItemId) return null;
    return folders.find((folder) => folder.id === selectedItemId) || null;
  }, [folders, selectedItemId]);

  // Separate regular pages from utility pages
  const { regularPages, utilityPages, utilitySlugs } = React.useMemo(() => {
    const regular = pages.filter(page => page.error_page === null && !isAuthUtilityPage(page));
    const utilities = pages
      .filter(page => page.error_page !== null || isAuthUtilityPage(page))
      .sort((a, b) => (a.error_page || 0) - (b.error_page || 0));
    return {
      regularPages: regular,
      utilityPages: utilities,
      utilitySlugs: new Set(utilities.map((page) => page.slug)),
    };
  }, [pages]);

  // Keep ref in sync with state
  useEffect(() => {
    selectedItemIdRef.current = selectedItemId;
  }, [selectedItemId]);

  // Switch page or folder settings when selecting another item
  useEffect(() => {
    // Don't open settings panel if it's not already open
    if (!showPageSettings && !showFolderSettings) return;

    if (selectedPage) {
      setEditingPage(selectedPage);
      setEditingFolder(null);
      setShowPageSettings(true);
      setShowFolderSettings(false);
    } else if (selectedFolder) {
      setEditingPage(null);
      setEditingFolder(selectedFolder);
      setShowPageSettings(false);
      setShowFolderSettings(true);
    }
  }, [selectedPage, selectedFolder, showPageSettings, showFolderSettings]);

  // No reactive opening/closing - panel is controlled purely by user actions
  // However, check URL on initial load to open panel if URL has ?edit param
  const hasCheckedInitialUrlRef = useRef(false);
  useEffect(() => {
    // Only check once on initial mount
    if (hasCheckedInitialUrlRef.current) return;
    hasCheckedInitialUrlRef.current = true;

    // If URL has ?edit param and the selected page matches the URL page ID, open the panel
    if (urlState.isEditing && urlState.resourceId && selectedPage && selectedPage.id === urlState.resourceId && !showPageSettings) {
      setEditingPage(selectedPage);
      setShowPageSettings(true);
    }
  }, [urlState.isEditing, urlState.resourceId, selectedPage, showPageSettings]);

  // Get store actions
  const { createPage, updatePage, duplicatePage, deletePage, createFolder, updateFolder, duplicateFolder, deleteFolder, batchReorderPagesAndFolders, loadDraft, setDraftLayers, saveDraft } = usePagesStore();
  const { collections, fields } = useCollectionsStore();

  // Collaboration hooks
  const livePageUpdates = useLivePageUpdates();

  // Sync selection with current page when it changes externally
  useEffect(() => {
    if (currentPageId) {
      setSelectedItemId(currentPageId);
    }
  }, [currentPageId]);

  // Handler to create a new page (if a collection ID is given this will be a dynamic page)
  const handleAddPage = async (collectionId?: string) => {
    const { parentFolderId, newDepth } = getParentContextFromSelection(selectedItemId, pages, folders);

    // Get the next available page number in this folder context
    const pagesInFolder = pages.filter(p => p.page_folder_id === parentFolderId);
    const pageNumber = getNextNumberFromNames(pagesInFolder, 'Page');
    const newPageName = `Page ${pageNumber}`;

    // Calculate order: insert right after selected item if it's a page, otherwise append to end
    const newOrder = calculateNextOrder(parentFolderId, newDepth, pages, folders, selectedItemId);

    // Prepare settings object
    const settings: PageSettings = {};

    // If collection ID is provided, set up dynamic page with CMS settings
    if (collectionId) {
      // Use preloaded fields from store
      const collectionFields = fields[collectionId] || [];

      // Find the slug field (built-in field with key = 'slug')
      const slugField = collectionFields.find(field => field.key === 'slug');

      if (!slugField) return console.warn('Slug field not found for collection:', collectionId);

      settings.cms = {
        collection_id: collectionId,
        slug_field_id: slugField.id,
      };
    }

    // Dynamic pages should have empty slug
    const newPageSlug = collectionId ? '*' : generateUniqueSlug(newPageName, pages, parentFolderId, false);

    // Create page with optimistic update
    const createPromise = createPage({
      name: newPageName,
      slug: newPageSlug,
      is_published: false,
      page_folder_id: parentFolderId,
      order: newOrder,
      depth: newDepth,
      is_index: false,
      is_dynamic: !!collectionId, // Set to true if collection ID is provided
      error_page: null,
      settings,
    });

    // Handle the result asynchronously
    createPromise.then(result => {
      if (result.success && result.data && result.tempId) {
        // Update selection to use real ID (the temp page should already be selected)
        if (selectedItemIdRef.current === result.tempId) {
          setSelectedItemId(result.data.id);
          selectedItemIdRef.current = result.data.id;
        }

        navigateToNextPage(result.data.id, urlState.layerId || 'body');

        // Automatically open Page settings panel for the newly created page
        setEditingPage(result.data);
        setShowPageSettings(true);
        setShowFolderSettings(false);

        // Broadcast page creation to other collaborators
        if (livePageUpdates && result.data) {
          livePageUpdates.broadcastPageCreate(result.data);
        }
      } else if (result.error) {
        console.error('Error creating page:', result.error);
      }
    });

    // Select new page from store (optimistic update is synchronous - find temp page matching order/parentFolderId)
    const storeState = usePagesStore.getState();
    const tempPage = storeState.pages.find(p =>
      p.id.startsWith('temp-page-') &&
      p.page_folder_id === parentFolderId &&
      p.depth === newDepth &&
      p.order === newOrder
    );

    if (tempPage) {
      setSelectedItemId(tempPage.id);
      selectedItemIdRef.current = tempPage.id;

      // Immediately open Page settings panel with temp page (optimistic)
      setEditingPage(tempPage);
      setShowPageSettings(true);
      setShowFolderSettings(false);
    }
  };

  const getAuthPageLabel = (mode: AuthUtilityMode) => {
    if (mode === 'signup') return 'Sign up';
    if (mode === 'login') return 'Login';
    if (mode === 'forgot-password') return 'Forgot password';
    if (mode === 'reset-password') return 'Reset password';
    return 'Auth';
  };

  const getAuthPageOrder = (mode: AuthUtilityMode) => {
    if (mode === 'auth') return 990;
    if (mode === 'login') return 991;
    if (mode === 'signup') return 992;
    if (mode === 'forgot-password') return 993;
    return 994;
  };

  const handleCreateAuthPage = async (mode: AuthUtilityMode) => {
    const existingAuthPage = pages.find((page) => page.slug === mode || (page.settings as any)?.qay_special_page === mode);
    if (existingAuthPage) {
      await loadDraft(existingAuthPage.id);
      const existingDraft = usePagesStore.getState().draftsByPageId[existingAuthPage.id];

      if (authTemplateNeedsRepair(existingDraft?.layers || [], mode)) {
        setDraftLayers(existingAuthPage.id, createAuthPageTemplateLayers(mode));
        await saveDraft(existingAuthPage.id);
        toast.success(`${getAuthPageLabel(mode)} page repaired`);
      }

      setSelectedItemId(existingAuthPage.id);
      selectedItemIdRef.current = existingAuthPage.id;
      onPageSelect(existingAuthPage.id);
      setCurrentPageId(existingAuthPage.id);
      navigateToNextPage(existingAuthPage.id, 'body');
      return;
    }

    const result = await createPage({
      name: `${getAuthPageLabel(mode)} page`,
      slug: mode,
      is_published: false,
      page_folder_id: null,
      order: getAuthPageOrder(mode),
      depth: 0,
      is_index: false,
      is_dynamic: false,
      error_page: null,
      settings: {
        qay_special_page: mode,
        seo: {
          title: mode === 'login' ? 'Sign in' : getAuthPageLabel(mode),
          description: mode === 'signup'
            ? 'Create account to continue.'
            : mode === 'forgot-password'
              ? 'Recover your account.'
              : mode === 'reset-password'
                ? 'Set a new password.'
                : 'Sign in to continue.',
          image: null,
          noindex: true,
        },
      } as any,
    });

    if (!result.success || !result.data) {
      toast.error(result.error || 'Unable to create auth page');
      return;
    }

    setDraftLayers(result.data.id, createAuthPageTemplateLayers(mode));
    await saveDraft(result.data.id);
    setSelectedItemId(result.data.id);
    selectedItemIdRef.current = result.data.id;
    onPageSelect(result.data.id);
    setCurrentPageId(result.data.id);
    navigateToNextPage(result.data.id, 'body');
    toast.success(`${getAuthPageLabel(mode)} page template created`);
  };

  // Handler to create a new folder
  const handleAddFolder = async () => {
    const { parentFolderId, newDepth } = getParentContextFromSelection(selectedItemId, pages, folders);

    // Get the next available folder number in this parent folder context
    const foldersInParent = folders.filter(f => f.page_folder_id === parentFolderId);
    const folderNumber = getNextNumberFromNames(foldersInParent, 'Folder');
    const newFolderName = `Folder ${folderNumber}`;

    // Calculate order: insert right after selected item if it's a page, otherwise append to end
    const newOrder = calculateNextOrder(parentFolderId, newDepth, pages, folders, selectedItemId);

    // Generate unique slug for the new folder
    const newFolderSlug = generateUniqueFolderSlug(newFolderName, folders, parentFolderId);

    // Create folder with optimistic update
    const createPromise = createFolder({
      name: newFolderName,
      slug: newFolderSlug,
      page_folder_id: parentFolderId,
      depth: newDepth,
      order: newOrder,
      settings: {},
      is_published: false,
    });

    // Handle the result asynchronously
    createPromise.then(result => {
      if (result.success && result.data && result.tempId) {
        // Update selection to use real ID if temp was selected
        if (selectedItemIdRef.current === result.tempId) {
          setSelectedItemId(result.data.id);
        }

        // Automatically open Folder settings panel for the newly created folder
        setEditingFolder(result.data);
        setShowFolderSettings(true);
        setShowPageSettings(false);
      } else if (result.error) {
        console.error('Error creating folder:', result.error);
      }
    });

    // Immediately select the new folder from store (will have temp ID initially)
    const tempFolder = usePagesStore.getState().folders[usePagesStore.getState().folders.length - 1];
    if (tempFolder) {
      setSelectedItemId(tempFolder.id);
    }
  };

  // Helper to check for unsaved changes before any selection change
  const checkBeforeSelectionChange = async (): Promise<boolean> => {
    // Check page settings panel if open
    if (showPageSettings && pageSettingsPanelRef.current) {
      const canProceed = await pageSettingsPanelRef.current.checkUnsavedChanges();
      if (!canProceed) {
        return false;
      }
    }

    // Check folder settings panel if open
    if (showFolderSettings && folderSettingsPanelRef.current) {
      const canProceed = await folderSettingsPanelRef.current.checkUnsavedChanges();
      if (!canProceed) {
        return false;
      }
    }

    return true;
  };

  // Handle page selection with unsaved changes check
  const handlePageSelect = async (pageId: string) => {
    const canProceed = await checkBeforeSelectionChange();
    if (!canProceed) {
      return;
    }

    if (pageId === currentPageId) return;

    // Set to body directly so the layer sync effect won't trigger a second URL update
    const { setSelectedLayerId } = useEditorStore.getState();
    setSelectedLayerId('body');

    // Immediate UI feedback - selection updates instantly
    setSelectedItemId(pageId);

    // Defer navigation to avoid blocking UI
    startTransition(() => {
      navigateToNextPage(pageId);
    });
  };

  // Handle folder selection with unsaved changes check
  const handleFolderSelect = async (folderId: string) => {
    const canProceed = await checkBeforeSelectionChange();
    if (!canProceed) {
      return;
    }
    setSelectedItemId(folderId);
  };

  // Handle page editing
  const handleEditPage = async (page: Page) => {
    // Check for unsaved changes before switching
    const canProceed = await checkBeforeSelectionChange();
    if (!canProceed) {
      return;
    }

    setSelectedItemId(page.id);
    setEditingPage(page);
    setShowPageSettings(true);
    setEditingFolder(null);
    setShowFolderSettings(false);
  };

  const handleEditFolder = async (folder: PageFolder) => {
    // Check for unsaved changes before switching
    const canProceed = await checkBeforeSelectionChange();
    if (!canProceed) {
      return;
    }

    setSelectedItemId(folder.id);
    setEditingFolder(folder);
    setShowFolderSettings(true);
    setEditingPage(null);
    setShowPageSettings(false);
  };

  const handleSavePage = async (data: PageFormData) => {
    if (!editingPage) return;

    const pageUpdates = {
      name: data.name,
      slug: data.slug,
      page_folder_id: data.page_folder_id,
      is_index: data.is_index,
      settings: data.settings,
    };

    let pageIdToUpdate = editingPage.id;

    if (editingPage.id.startsWith('temp-page-')) {
      const realPage = pages.find(page =>
        !page.id.startsWith('temp-page-') &&
        page.name === editingPage.name &&
        page.page_folder_id === editingPage.page_folder_id &&
        page.depth === editingPage.depth &&
        page.order === editingPage.order
      );

      if (!realPage) {
        console.warn('Page is still being created. Please save again in a moment.');
        return;
      }

      pageIdToUpdate = realPage.id;
      setSelectedItemId(realPage.id);
      selectedItemIdRef.current = realPage.id;
      setEditingPage(realPage);
    }

    // Update in background
    // const result = await updatePage(editingPage.id, pageUpdates);
    const result = await updatePage(pageIdToUpdate, pageUpdates);

    if (result.error) {
      console.error('Failed to save page:', result.error);
    } else {
      // Broadcast page update to other collaborators
      if (livePageUpdates) {
        livePageUpdates.broadcastPageUpdate(pageIdToUpdate, pageUpdates);
      }
      setShowPageSettings(false);
      setEditingPage(null);
    }
  };

  const handleSaveFolder = async (data: FolderFormData) => {
    if (!editingFolder) return;

    // Update in background
    const result = await updateFolder(editingFolder.id, {
      name: data.name,
      slug: data.slug,
      page_folder_id: data.page_folder_id,
      settings: data.settings,
    });

    if (result.error) {
      console.error('Failed to save folder:', result.error);
    } else {
      setShowFolderSettings(false);
      setEditingFolder(null);
    }
  };

  const handleReorder = async (updatedPages: Page[], updatedFolders: PageFolder[]) => {
    const result = await batchReorderPagesAndFolders(updatedPages, updatedFolders);

    if (result.error) {
      console.error('Failed to reorder items:', result.error);
      // Could show a toast notification here
    }
  };

  // Handle duplicate page/folder
  // Track pending duplication for selection after reload (works for both pages and folders)
  const [pendingDuplicateSelection, setPendingDuplicateSelection] = React.useState<{
    tempId: string;
    expectedName: string;
    parentFolderId: string | null;
    type: 'page' | 'folder';
    allTempIds?: Set<string>; // All temp IDs created during duplication (for folders with contents)
    tempItemsSnapshot?: Map<string, { name: string; type: 'page' | 'folder' }>; // Snapshot of temp items
  } | null>(null);

  // Watch for changes and update selection if we're waiting for a duplicate
  useEffect(() => {
    if (pendingDuplicateSelection) {
      const { tempId, expectedName, parentFolderId, type, allTempIds } = pendingDuplicateSelection;

      // Check if current selection is any of the temp IDs from this duplication
      const isSelectingTempFromDuplication = allTempIds
        ? allTempIds.has(selectedItemIdRef.current || '')
        : selectedItemIdRef.current === tempId;

      if (type === 'folder') {
        // Check if temp folder ID no longer exists (data has been reloaded)
        const tempExists = folders.some(f => f.id === tempId);

        if (!tempExists) {
          // Find the real duplicated folder
          const duplicatedFolder = folders.find(
            f => f.name === expectedName &&
                 f.page_folder_id === parentFolderId &&
                 !f.id.startsWith('temp-')
          );

          if (duplicatedFolder) {
            // Update selection if user is selecting any temp item from this duplication
            if (isSelectingTempFromDuplication) {
              // Try to find the corresponding real item based on what was selected
              const currentSelectionId = selectedItemIdRef.current;

              if (currentSelectionId && allTempIds && pendingDuplicateSelection.tempItemsSnapshot) {
                const selectedItemSnapshot = pendingDuplicateSelection.tempItemsSnapshot.get(currentSelectionId);

                if (selectedItemSnapshot) {
                  if (selectedItemSnapshot.type === 'page') {
                    // User selected a page inside the duplicated folder
                    // Get all descendant folder IDs of the duplicated folder
                    const getDescendantFolderIds = (folderId: string): string[] => {
                      const childFolders = folders.filter(f => f.page_folder_id === folderId && !f.id.startsWith('temp-'));
                      const ids = childFolders.map(f => f.id);
                      childFolders.forEach(f => {
                        ids.push(...getDescendantFolderIds(f.id));
                      });
                      return ids;
                    };

                    const validFolderIds = [duplicatedFolder.id, ...getDescendantFolderIds(duplicatedFolder.id)];

                    // Find real page by name in the duplicated folder hierarchy
                    const realPage = pages.find(
                      p => p.name === selectedItemSnapshot.name &&
                           p.page_folder_id &&
                           validFolderIds.includes(p.page_folder_id) &&
                           !p.id.startsWith('temp-')
                    );
                    if (realPage) {
                      setSelectedItemId(realPage.id);
                    } else {
                      // Fall back to selecting the folder
                      setSelectedItemId(duplicatedFolder.id);
                    }
                  } else if (selectedItemSnapshot.type === 'folder') {
                    // User selected a nested folder inside the duplicated folder
                    if (currentSelectionId === tempId) {
                      // Selecting the root folder itself
                      setSelectedItemId(duplicatedFolder.id);
                    } else {
                      // Selecting a nested folder
                      const getDescendantFolderIds = (folderId: string): string[] => {
                        const childFolders = folders.filter(f => f.page_folder_id === folderId && !f.id.startsWith('temp-'));
                        const ids = childFolders.map(f => f.id);
                        childFolders.forEach(f => {
                          ids.push(...getDescendantFolderIds(f.id));
                        });
                        return ids;
                      };

                      const descendantFolderIds = getDescendantFolderIds(duplicatedFolder.id);

                      // Find real folder by name in the duplicated folder hierarchy
                      const realFolder = folders.find(
                        f => f.name === selectedItemSnapshot.name &&
                             f.id !== duplicatedFolder.id &&
                             descendantFolderIds.includes(f.id) &&
                             !f.id.startsWith('temp-')
                      );
                      if (realFolder) {
                        setSelectedItemId(realFolder.id);
                      } else {
                        // Fall back to selecting the root duplicated folder
                        setSelectedItemId(duplicatedFolder.id);
                      }
                    }
                  }
                } else {
                  // No snapshot found, select root folder
                  setSelectedItemId(duplicatedFolder.id);
                }
              } else {
                // Selecting the root folder itself (no snapshot needed)
                setSelectedItemId(duplicatedFolder.id);
              }
            }
            setPendingDuplicateSelection(null);
          }
        }
      } else {
        // Check if temp page ID no longer exists (data has been reloaded)
        const tempExists = pages.some(p => p.id === tempId);

        if (!tempExists) {
          // Find the real duplicated page
          const duplicatedPage = pages.find(
            p => p.name === expectedName &&
                 p.page_folder_id === parentFolderId &&
                 !p.id.startsWith('temp-')
          );

          if (duplicatedPage) {
            // Only update selection if it's still the temp ID (user hasn't changed selection during operation)
            if (isSelectingTempFromDuplication) {
              setSelectedItemId(duplicatedPage.id);
            }
            setPendingDuplicateSelection(null);
          }
        }
      }
    }
  }, [pages, folders, pendingDuplicateSelection]);

  const handleDuplicate = async (id: string, type: 'folder' | 'page') => {
    if (type === 'folder') {
      // Duplicate the folder
      const result = await duplicateFolder(id);

      if (result.success && result.data) {
        // Select the newly duplicated folder (temp ID initially)
        setSelectedItemId(result.data.id);

        // Track this duplication so we can update selection after reload
        if (result.metadata) {
          // Collect all temp IDs created during this duplication (folder + all pages inside)
          // All items from a single duplication share the same timestamp in their temp IDs
          const allTempIds = new Set<string>();
          const tempItemsSnapshot = new Map<string, { name: string; type: 'page' | 'folder' }>();

          allTempIds.add(result.metadata.tempId);

          // Extract timestamp from temp ID (format: temp-folder-{timestamp}-...)
          const timestampMatch = result.metadata.tempId.match(/temp-\w+-(\d+)-/);
          if (timestampMatch) {
            const timestamp = timestampMatch[1];

            // Find all temp pages and folders created in this operation by matching timestamp
            const tempFolders = folders.filter(f => f.id.includes(`-${timestamp}-`));
            const tempPages = pages.filter(p => p.id.includes(`-${timestamp}-`));

            // Store snapshot of all temp items (name + type) before they get replaced
            tempFolders.forEach(f => {
              allTempIds.add(f.id);
              tempItemsSnapshot.set(f.id, { name: f.name, type: 'folder' });
            });
            tempPages.forEach(p => {
              allTempIds.add(p.id);
              tempItemsSnapshot.set(p.id, { name: p.name, type: 'page' });
            });
          }

          setPendingDuplicateSelection({
            tempId: result.metadata.tempId,
            expectedName: result.metadata.expectedName,
            parentFolderId: result.metadata.parentFolderId,
            type: 'folder',
            allTempIds,
            tempItemsSnapshot,
          });
        }
      } else if (result.error) {
        console.error('Failed to duplicate folder:', result.error);
        // Could show a toast notification here
      }
    } else {
      // Duplicate the page
      const result = await duplicatePage(id);

      if (result.success && result.data) {
        // Select the newly duplicated page (temp ID initially)
        setSelectedItemId(result.data.id);

        // Track this duplication so we can update selection after reload
        if (result.metadata) {
          setPendingDuplicateSelection({
            tempId: result.metadata.tempId,
            expectedName: result.metadata.expectedName,
            parentFolderId: result.metadata.parentFolderId,
            type: 'page',
          });
        }
      } else if (result.error) {
        console.error('Failed to duplicate page:', result.error);
        // Could show a toast notification here
      }
    }
  };

  /**
   * Navigate to a page based on current sidebar tab.
   * Uses store-based tab instead of routeType since tab switches use replaceState.
   */
  const navigateToNextPage = (pageId: string, layerId = 'body') => {
    const view = urlState.view || undefined;
    const rightTab = urlState.rightTab || undefined;

    if (urlState.isEditing) {
      navigateToPageEdit(pageId);
    } else if (activeSidebarTab === 'pages') {
      navigateToPage(pageId, view, rightTab, layerId);
    } else {
      navigateToLayers(pageId, view, rightTab, layerId);
    }
  };

  // Prompt confirmation before deleting a page or folder
  const deletePageOrFolderItem = (id: string, type: 'folder' | 'page') => {
    setPendingDelete({ id, type });
    setDeleteConfirmOpen(true);
  };

  // Execute the actual deletion after confirmation
  const executeDelete = async (id: string, type: 'folder' | 'page') => {
    const wasSelected = selectedItemId === id;
    const wasCurrentPage = currentPageId === id;

    // Close settings panel if item was being edited
    if (type === 'folder' && editingFolder?.id === id) {
      setShowFolderSettings(false);
      setEditingFolder(null);
    } else if (type === 'page' && editingPage?.id === id) {
      setShowPageSettings(false);
      setEditingPage(null);
    }

    // Handle folder deletion
    if (type === 'folder') {
      // Find next selection optimistically
      const nextSelection = wasSelected ? findNextSelection(id, type, pages, folders) : null;
      if (wasSelected && !wasCurrentPage && nextSelection) {
        setSelectedItemId(nextSelection);
      }

      const result = await deleteFolder(id, currentPageId);

      if (!result.success) {
        console.error('Failed to delete folder:', result.error);
        // Revert selection on error
        if (wasSelected && !wasCurrentPage) {
          setSelectedItemId(id);
        }
        return;
      }

      // Handle current page updates if affected
      if (result.currentPageAffected) {
        if (result.nextPageId) {
          onPageSelect(result.nextPageId);
          setSelectedItemId(result.nextPageId);
          openPage(result.nextPageId);
        } else {
          onPageSelect('');
          setCurrentPageId(null);
          setSelectedItemId(null);
        }
      }
      return;
    }

    // Handle page deletion
    // Find next selection optimistically (before API call)
    const nextSelection = wasSelected ? findNextSelection(id, type, pages, folders) : null;

    // Select next item immediately (optimistically) - can be page or folder
    if (nextSelection) {
      setSelectedItemId(nextSelection);
    } else if (wasSelected) {
      setSelectedItemId(null);
    }

    // If current page is being deleted, handle navigation optimistically
    if (wasCurrentPage) {
      // Only navigate if next selection is a page (not a folder)
      const nextPageId = nextSelection && pages.some(p => p.id === nextSelection && p.error_page === null)
        ? nextSelection
        : null;

      if (nextPageId) {
        onPageSelect(nextPageId);
        navigateToNextPage(nextPageId);
      } else {
        // No pages left - fallback to homepage or first page
        const regularPages = pages.filter(p => p.id !== id && p.error_page === null);
        if (regularPages.length > 0) {
          const homePage = regularPages.find(p => p.is_index && !p.page_folder_id);
          const fallbackPageId = (homePage || regularPages[0]).id;
          onPageSelect(fallbackPageId);
          navigateToNextPage(fallbackPageId);
          setSelectedItemId(fallbackPageId);
        } else {
          onPageSelect('');
          setCurrentPageId(null);
        }
      }
    }

    // Delete via store (handles API call and state updates)
    const result = await deletePage(id, currentPageId);

    if (!result.success) {
      console.error('Failed to delete page:', result.error);
      // Revert selection on error
      if (wasSelected) {
        setSelectedItemId(id);
      }
      return;
    }

    // Broadcast page deletion to other collaborators
    if (livePageUpdates) {
      livePageUpdates.broadcastPageDelete(id);
    }
  };

  return (
    <>
      <header className="py-5 flex justify-between shrink-0 sticky top-0 bg-linear-to-b from-background to-transparent z-20">
        <span className="font-medium">Pages</span>
        <div className="-my-1">
          <DropdownMenu onOpenChange={setIsMenuOpen}>
            <DropdownMenuTrigger asChild>
              <Button size="xs" variant="secondary">
                <Icon name="plus" className={`${isMenuOpen ? 'rotate-45' : 'rotate-0'} transition-transform duration-100`} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="start"
              side="bottom"
              onCloseAutoFocus={(e) => e.preventDefault()}
              className="max-h-125 overflow-y-auto"
            >
              <DropdownMenuItem onClick={() => handleAddPage()}>
                <Icon name="page" className="size-3 opacity-60" />
                Regular
              </DropdownMenuItem>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <Icon name="dynamicPage" className="size-3 opacity-60" />
                  CMS
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  {collections.length > 0 ? (
                    collections.map(collection => (
                      <DropdownMenuItem key={collection.id} onClick={() => handleAddPage(collection.id)}>
                        <Icon name="database" className="size-3 opacity-60" />
                        {collection.name}
                      </DropdownMenuItem>
                    ))
                  ) : (
                    <DropdownMenuItem key={null} onClick={() => navigateToCollections()}>
                      <Icon name="database" className="size-3 opacity-60" />
                      Add a collection
                    </DropdownMenuItem>
                  )}
                </DropdownMenuSubContent>
              </DropdownMenuSub>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleAddFolder}>
                <Icon name="folder" className="size-3 opacity-60" />
                Folder
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <div className="flex flex-col gap-3">
        <PagesTree
          pages={regularPages}
          folders={folders}
          selectedItemId={selectedItemId}
          currentPageId={currentPageId}
          onPageSelect={handlePageSelect}
          onFolderSelect={handleFolderSelect}
          onPageOpen={(pageId) => {
            onPageSelect(pageId);
            setCurrentPageId(pageId);
            handlePageSelect(pageId); // This will also navigate
          }}
          onReorder={handleReorder}
          onPageSettings={handleEditPage}
          onFolderSettings={handleEditFolder}
          onDuplicate={handleDuplicate}
          onDelete={deletePageOrFolderItem}
        />

        <div className="flex items-center gap-2 mt-2">
          <span className="text-xs text-muted-foreground font-medium">Utility pages</span>
          <Separator className="flex-1" />
          {!utilitySlugs.has('login') && (
            <Button type="button" variant="ghost" size="sm" className="h-7 px-2 text-xs" onClick={() => handleCreateAuthPage('login')}>
              <Icon name="block" className="size-3 opacity-60" />
              Login
            </Button>
          )}
          {!utilitySlugs.has('signup') && (
            <Button type="button" variant="ghost" size="sm" className="h-7 px-2 text-xs" onClick={() => handleCreateAuthPage('signup')}>
              <Icon name="block" className="size-3 opacity-60" />
              Sign up
            </Button>
          )}
          {!utilitySlugs.has('forgot-password') && (
            <Button type="button" variant="ghost" size="sm" className="h-7 px-2 text-xs" onClick={() => handleCreateAuthPage('forgot-password')}>
              <Icon name="block" className="size-3 opacity-60" />
              Forgot
            </Button>
          )}
          {!utilitySlugs.has('reset-password') && (
            <Button type="button" variant="ghost" size="sm" className="h-7 px-2 text-xs" onClick={() => handleCreateAuthPage('reset-password')}>
              <Icon name="block" className="size-3 opacity-60" />
              Reset
            </Button>
          )}
        </div>

        {/* Utility pages tree */}
        {utilityPages.length > 0 && (
          <PagesTree
            pages={utilityPages}
            folders={[]}
            selectedItemId={selectedItemId}
            currentPageId={currentPageId}
            onPageSelect={handlePageSelect}
            onPageOpen={(pageId) => {
              onPageSelect(pageId);
              setCurrentPageId(pageId);
              handlePageSelect(pageId); // This will also navigate
            }}
            onPageSettings={handleEditPage}
            onFolderSettings={handleEditFolder}
          />
        )}
      </div>

      {/* Page settings panel (lazy loaded) */}
      <Suspense fallback={null}>
        <PageSettingsPanel
          ref={pageSettingsPanelRef}
          isOpen={showPageSettings}
          onClose={() => {
            setShowPageSettings(false);
            setEditingPage(null);

            // Navigate back to pages view if we're in edit mode
            if (urlState.isEditing && currentPageId) {
              // Since edit param preserves other params, we can just remove the edit param
              // The URL already has view, tab, layer params preserved
              const view = urlState.view || undefined;
              const rightTab = urlState.rightTab || undefined;
              const layerId = urlState.layerId || undefined;

              navigateToPage(currentPageId, view, rightTab, layerId);
            }
          }}
          page={editingPage}
          onSave={handleSavePage}
        />
      </Suspense>

      {/* Folder settings panel (lazy loaded) */}
      <Suspense fallback={null}>
        <FolderSettingsPanel
          ref={folderSettingsPanelRef}
          isOpen={showFolderSettings}
          onClose={() => {
            setShowFolderSettings(false);
            setEditingFolder(null);
          }}
          folder={editingFolder}
          onSave={handleSaveFolder}
        />
      </Suspense>

      {/* Delete confirmation dialog */}
      <ConfirmDialog
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        title={`Delete ${pendingDelete?.type === 'folder' ? 'folder' : 'page'}`}
        description={
          pendingDelete?.type === 'folder'
            ? `Are you sure you want to delete this folder and all pages inside it? This action cannot be undone.`
            : `Are you sure you want to delete this page? This action cannot be undone.`
        }
        confirmLabel="Delete"
        confirmVariant="destructive"
        onConfirm={async () => {
          if (pendingDelete) {
            await executeDelete(pendingDelete.id, pendingDelete.type);
          }
        }}
      />
    </>
  );
}
