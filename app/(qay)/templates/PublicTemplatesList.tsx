'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { ArrowRight, Search, LayoutTemplate } from 'lucide-react';
import type { Template } from '@/lib/services/templateService';

type PublicTemplate = Template & {
  categoryName: string;
  source: 'QAY' | 'Ycode';
};

interface PublicTemplatesListProps {
  initialTemplates: PublicTemplate[];
  initialCategories: string[];
}

export function PublicTemplatesList({
  initialTemplates,
  initialCategories,
}: PublicTemplatesListProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredTemplates = useMemo(() => {
    let result = initialTemplates;

    // Filter by Category
    if (selectedCategory !== 'all') {
      result = result.filter(
        (t) => t.categoryName.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Filter by Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          (t.description && t.description.toLowerCase().includes(q))
      );
    }

    return result;
  }, [initialTemplates, selectedCategory, searchQuery]);

  return (
    <div>
      {/* Search and Category Filters */}
      <div className="mt-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        {/* Category Tabs */}
        {initialCategories.length > 0 && (
          <div className="no-scrollbar flex gap-2 overflow-x-auto pb-2 md:pb-0">
            <button
              type="button"
              onClick={() => setSelectedCategory('all')}
              className={`shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition ${
                selectedCategory === 'all'
                  ? 'border-white/15 bg-white text-black font-semibold'
                  : 'border-white/10 text-white/65 hover:border-white/25 hover:text-white'
              }`}
            >
              All
            </button>
            {initialCategories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setSelectedCategory(category)}
                className={`shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition ${
                  selectedCategory.toLowerCase() === category.toLowerCase()
                    ? 'border-white/15 bg-white text-black font-semibold'
                    : 'border-white/10 text-white/65 hover:border-white/25 hover:text-white'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        )}

        {/* Search Bar */}
        <div className="relative w-full md:max-w-xs">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search templates..."
            className="h-10 w-full rounded-full border border-white/10 bg-white/[0.03] pl-10 pr-10 text-sm text-white outline-none transition focus:border-white/25 focus:bg-white/[0.06]"
          />
          <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-white/40" />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-white/40 hover:text-white"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Templates Grid */}
      {filteredTemplates.length > 0 ? (
        <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredTemplates.map((template) => (
            <article
              key={template.id}
              className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] shadow-2xl shadow-black/30 flex flex-col h-full"
            >
              <Link href={template.livePreviewUrl || '/templates'} className="block">
                <div className="aspect-[4/3] overflow-hidden bg-white/5">
                  <img
                    src={template.preview}
                    alt={`${template.name} template preview`}
                    className="h-full w-full object-cover transition duration-500 hover:scale-105"
                  />
                </div>
              </Link>
              <div className="p-5 flex flex-col flex-grow">
                <div className="flex items-center justify-between gap-3">
                  <span className="rounded-full border border-white/10 px-3 py-1 text-xs font-medium text-white/55">
                    {template.categoryName}
                  </span>
                  <a
                    href="/"
                    className="rounded-full bg-white/8 px-3 py-1 text-xs font-semibold text-white/60 transition hover:bg-white/12 hover:text-white"
                  >
                    Made from {template.source}
                  </a>
                </div>
                <h2 className="mt-4 text-xl font-semibold">{template.name}</h2>
                <p className="mt-3 line-clamp-3 text-sm leading-6 text-white/55 flex-grow">
                  {template.description}
                </p>
                <div className="mt-5 flex gap-3">
                  <Link
                    href={template.livePreviewUrl || '/templates'}
                    className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-black transition hover:bg-white/90"
                  >
                    View demo
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </Link>
                  <Link
                    href="/signup?next=/dashboard/templates"
                    className="rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
                  >
                    Use
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="mt-12 rounded-2xl border border-white/10 bg-white/[0.04] p-12 text-center text-white/55 flex flex-col items-center justify-center">
          <LayoutTemplate className="size-8 text-white/30 mb-3" />
          <p className="text-base font-medium">No templates found</p>
          <p className="text-sm text-white/40 mt-1">
            Try adjusting your search filters or typing a different keyword.
          </p>
        </div>
      )}
    </div>
  );
}
