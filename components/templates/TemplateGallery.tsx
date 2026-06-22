'use client';

/**
 * TemplateGallery Component
 *
 * Displays a grid of available templates for selection with category filtering.
 */

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { TemplateCard } from './TemplateCard';
import { TemplateApplyDialog } from './TemplateApplyDialog';
import { Spinner } from '@/components/ui/spinner';
import { EmptyState } from '@/components/ui/empty-state';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import Icon from '@/components/ui/icon';
import { Label } from '@/components/ui/label';
import BuilderLoading from '@/components/BuilderLoading';
import { Search } from 'lucide-react';
import { readQayEditorSiteIdFromBrowser } from '@/qay/lib/editor-site';

interface Template {
  id: string;
  name: string;
  description: string;
  preview: string;
  categoryId: string | null;
  livePreviewUrl: string | null;
}

interface Category {
  id: string;
  name: string;
  order: number;
}

interface TemplateGalleryProps {
  onApplySuccess?: () => void;
  className?: string;
  startFromScratchHref?: string;
  applyImmediately?: boolean;
}

export function TemplateGallery({
  onApplySuccess,
  className,
  startFromScratchHref,
  applyImmediately,
}: TemplateGalleryProps) {
  const router = useRouter();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(
    null
  );
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showApplyDialog, setShowApplyDialog] = useState(false);
  const [applying, setApplying] = useState(false);
  const [applyError, setApplyError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch templates and categories on mount
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch('/api/templates');

        if (!response.ok) {
          throw new Error('Failed to fetch templates');
        }

        const data = await response.json();
        setTemplates(data.templates || []);
        setCategories(data.categories || []);
      } catch (err) {
        console.error('[TemplateGallery] Error fetching data:', err);
        setError(
          err instanceof Error ? err.message : 'Failed to load templates'
        );
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // Filter templates by selected category and search query
  const filteredTemplates = useMemo(() => {
    let result = templates;
    if (selectedCategory !== 'all') {
      result = templates.filter((t) => t.categoryId === selectedCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          (t.description && t.description.toLowerCase().includes(q))
      );
    }
    return result;
  }, [templates, selectedCategory, searchQuery]);

  // Clear selected template when category changes and template is no longer visible
  useEffect(() => {
    if (selectedTemplate) {
      const isStillVisible = filteredTemplates.some(
        (t) => t.id === selectedTemplate.id
      );
      if (!isStillVisible) {
        setSelectedTemplate(null);
      }
    }
  }, [filteredTemplates, selectedTemplate]);

  const handleApplyImmediately = async (template: Template) => {
    setApplying(true);
    setApplyError(null);
    setSelectedTemplate(template);

    try {
      const siteId = readQayEditorSiteIdFromBrowser();
      const response = await fetch(
        siteId
          ? `/api/qay/templates/${template.id}/apply`
          : `/api/templates/${template.id}/apply`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: siteId ? JSON.stringify({ siteId }) : undefined,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to apply template');
      }

      onApplySuccess?.();
      window.location.href = siteId ? `/ycode?site=${encodeURIComponent(siteId)}` : '/ycode';
    } catch (err) {
      console.error('[TemplateGallery] Apply error:', err);
      setApplyError(
        err instanceof Error ? err.message : 'Failed to apply template'
      );
      setApplying(false);
    }
  };

  const handleTemplateClick = (template: Template) => {
    if (applyImmediately) {
      handleApplyImmediately(template);
      return;
    }
    setSelectedTemplate(template);
    setShowApplyDialog(true);
  };

  const handleApplySuccess = () => {
    setShowApplyDialog(false);
    setSelectedTemplate(null);
    onApplySuccess?.();
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Spinner />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <EmptyState
        icon="alert-circle"
        title="Failed to load templates"
        description={error}
        actionLabel="Try again"
        onAction={() => window.location.reload()}
      />
    );
  }

  // Empty state
  if (templates.length === 0) {
    return (
      <EmptyState
        icon="layout-template"
        title="No templates available"
        description="Templates will appear here once they are added to the template service."
      />
    );
  }

  if (applying) {
    return (
      <BuilderLoading
        title="Please wait"
        message={`Applying ${selectedTemplate?.name ?? 'template'}...`}
      />
    );
  }

  return (
    <div className={className}>
      {/* Apply error */}
      {applyError && (
        <div className="mb-6 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
          {applyError}
        </div>
      )}

      {/* Category Filter and Search */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {categories.length > 0 && (
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
        <div className="relative flex-1 max-w-sm">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search templates by name..."
            className="h-10 w-full rounded-md border border-input bg-background pl-10 pr-4 text-sm text-foreground outline-none transition focus:border-ring"
          />
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Template Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {startFromScratchHref && (
          <button
            type="button"
            onClick={() => router.push(startFromScratchHref)}
            className="group flex flex-col gap-3"
          >
            <div className="rounded-lg bg-muted/50 p-8 flex items-center justify-center text-center transition-colors hover:bg-muted aspect-[72/85]">
              <Icon name="plus" className="size-3.5 opacity-75" />
            </div>
            <Label>Start from scratch</Label>
          </button>
        )}
        {filteredTemplates.map((template) => (
          <TemplateCard
            key={template.id}
            name={template.name}
            description={template.description}
            preview={template.preview}
            livePreviewUrl={template.livePreviewUrl}
            onClick={() => handleTemplateClick(template)}
          />
        ))}
      </div>

      {/* Empty state for filtered results */}
      {filteredTemplates.length === 0 && templates.length > 0 && (
        <EmptyState
          icon="search"
          title="No templates found"
          description="Try searching a different keyword or category."
        />
      )}

      {/* Apply Confirmation Dialog (only when not in immediate mode) */}
      {!applyImmediately && (
        <TemplateApplyDialog
          open={showApplyDialog}
          onOpenChange={setShowApplyDialog}
          template={selectedTemplate}
          onSuccess={handleApplySuccess}
        />
      )}
    </div>
  );
}

export default TemplateGallery;
