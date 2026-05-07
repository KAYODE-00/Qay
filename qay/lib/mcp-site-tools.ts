import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { LinkSettings } from '@/types';
import {
  createQayMcpFolder,
  createQayMcpPage,
  deleteQayMcpFolder,
  deleteQayMcpPage,
  duplicateQayMcpPage,
  getQayMcpDraftLayers,
  getQayMcpPage,
  getQayMcpPagesByFolder,
  listQayMcpFolders,
  listQayMcpPages,
  saveQayMcpDraftLayers,
  updateQayMcpFolder,
  updateQayMcpPage,
  updateQayMcpPageSettings,
} from './mcp-site-bindings';
import {
  applyDesignToLayer,
  buildTiptapDoc,
  canHaveChildren,
  createLayerFromTemplate,
  ELEMENT_TEMPLATES,
  findLayerById,
  getTiptapTextContent,
  insertLayer,
  moveLayer as moveLayerInTree,
  removeLayer,
  updateLayerById,
} from '@/lib/mcp/utils';
import type { RichTextBlock } from '@/lib/mcp/utils';
import { broadcastLayersChanged, broadcastPageCreated, broadcastPageDeleted, broadcastPageUpdated } from '@/lib/mcp/broadcast';
import { designSchema } from '@/lib/mcp/tools/shared-schemas';

const templateEnum = z.enum(Object.keys(ELEMENT_TEMPLATES) as [string, ...string[]]);

export function registerQaySiteTools(server: McpServer, siteId: string) {
  server.tool('list_pages', 'List all pages in this QAY site only.', {}, async () => {
    const [pages, folders] = await Promise.all([listQayMcpPages(siteId), listQayMcpFolders(siteId)]);
    return {
      content: [{ type: 'text' as const, text: JSON.stringify({ pages, folders }, null, 2) }],
    };
  });

  server.tool('get_page', 'Get a single page in this QAY site by ID.', {
    page_id: z.string().describe('The page ID'),
  }, async ({ page_id }) => {
    const page = await getQayMcpPage(siteId, page_id);
    if (!page) {
      return { content: [{ type: 'text' as const, text: `Error: Page "${page_id}" not found.` }], isError: true };
    }
    return { content: [{ type: 'text' as const, text: JSON.stringify(page, null, 2) }] };
  });

  server.tool('create_page', 'Create a new page in this QAY site.', {
    name: z.string().describe('Page title'),
    slug: z.string().optional().describe('URL slug'),
    page_folder_id: z.string().nullable().optional().describe('Parent folder ID, or null for root'),
    is_index: z.boolean().optional().describe('Set to true to make this the homepage'),
    is_dynamic: z.boolean().optional().describe('Set to true for CMS dynamic pages'),
  }, async (args) => {
    const page = await createQayMcpPage(siteId, {
      name: args.name,
      slug: args.slug || args.name,
      page_folder_id: args.page_folder_id ?? null,
      is_index: args.is_index || false,
      is_dynamic: args.is_dynamic || false,
    });
    broadcastPageCreated(page).catch(() => {});
    broadcastLayersChanged(page.id, [{ id: 'body', name: 'body', classes: '', children: [] }]).catch(() => {});
    return { content: [{ type: 'text' as const, text: JSON.stringify(page, null, 2) }] };
  });

  server.tool('update_page', "Update a page's name, slug, or folder within this QAY site.", {
    page_id: z.string().describe('The page ID to update'),
    name: z.string().optional().describe('New page title'),
    slug: z.string().optional().describe('New URL slug'),
    page_folder_id: z.string().nullable().optional().describe('Move to folder ID, or null for root'),
  }, async ({ page_id, ...data }) => {
    const page = await updateQayMcpPage(siteId, page_id, data);
    broadcastPageUpdated(page_id, data).catch(() => {});
    return { content: [{ type: 'text' as const, text: JSON.stringify(page, null, 2) }] };
  });

  server.tool('update_page_settings', 'Update page SEO, custom code, or password protection settings for this site.', {
    page_id: z.string().describe('The page ID'),
    seo: z.object({
      title: z.string().optional(),
      description: z.string().optional(),
      noindex: z.boolean().optional(),
      image_asset_id: z.string().nullable().optional(),
    }).optional(),
    custom_code: z.object({
      head: z.string().optional(),
      body: z.string().optional(),
    }).optional(),
    auth: z.object({
      enabled: z.boolean(),
      password: z.string().optional(),
    }).optional(),
  }, async ({ page_id, seo, custom_code, auth }) => {
    const existing = await getQayMcpPage(siteId, page_id);
    if (!existing) {
      return { content: [{ type: 'text' as const, text: `Error: Page "${page_id}" not found.` }], isError: true };
    }

    const settings = { ...(existing.settings as Record<string, unknown> ?? {}) };

    if (seo) {
      (settings as any).seo = {
        ...((settings as any).seo || { title: '', description: '', noindex: false, image: null }),
        ...(seo.title !== undefined ? { title: seo.title } : {}),
        ...(seo.description !== undefined ? { description: seo.description } : {}),
        ...(seo.noindex !== undefined ? { noindex: seo.noindex } : {}),
        ...(seo.image_asset_id !== undefined ? { image: seo.image_asset_id } : {}),
      };
    }

    if (custom_code) {
      (settings as any).custom_code = {
        ...((settings as any).custom_code || { head: '', body: '' }),
        ...(custom_code.head !== undefined ? { head: custom_code.head } : {}),
        ...(custom_code.body !== undefined ? { body: custom_code.body } : {}),
      };
    }

    if (auth) {
      (settings as any).auth = {
        enabled: auth.enabled,
        password: auth.password || (settings as any).auth?.password || '',
      };
    }

    const page = await updateQayMcpPageSettings(siteId, page_id, settings as any);
    broadcastPageUpdated(page_id, { settings }).catch(() => {});
    return { content: [{ type: 'text' as const, text: JSON.stringify({ message: 'Updated page settings', settings: page.settings }, null, 2) }] };
  });

  server.tool('duplicate_page', 'Create a copy of a page including all its layers inside this QAY site.', {
    page_id: z.string().describe('The page ID to duplicate'),
  }, async ({ page_id }) => {
    const page = await duplicateQayMcpPage(siteId, page_id);
    broadcastPageCreated(page).catch(() => {});
    return { content: [{ type: 'text' as const, text: JSON.stringify({ message: `Duplicated page as "${page.name}"`, page }, null, 2) }] };
  });

  server.tool('delete_page', 'Permanently delete a page and all its layers in this QAY site.', {
    page_id: z.string().describe('The page ID to delete'),
  }, async ({ page_id }) => {
    await deleteQayMcpPage(siteId, page_id);
    broadcastPageDeleted(page_id).catch(() => {});
    return { content: [{ type: 'text' as const, text: `Page ${page_id} deleted successfully.` }] };
  });

  server.tool('list_page_folders', 'List all page folders for this QAY site.', {}, async () => {
    const folders = await listQayMcpFolders(siteId);
    return {
      content: [{
        type: 'text' as const,
        text: JSON.stringify(folders.map((folder) => ({
          id: folder.id,
          name: folder.name,
          slug: folder.slug,
          page_folder_id: folder.page_folder_id,
          depth: folder.depth,
          order: folder.order,
        })), null, 2),
      }],
    };
  });

  server.tool('create_page_folder', 'Create a new page folder for this QAY site.', {
    name: z.string().describe('Folder name'),
    slug: z.string().optional().describe('URL slug'),
    page_folder_id: z.string().nullable().optional().describe('Parent folder ID for nesting, or null for root'),
  }, async ({ name, slug, page_folder_id }) => {
    const folder = await createQayMcpFolder(siteId, {
      name,
      slug: slug || name,
      page_folder_id: page_folder_id ?? null,
    });
    return {
      content: [{
        type: 'text' as const,
        text: JSON.stringify({ message: `Created folder "${name}"`, folder }, null, 2),
      }],
    };
  });

  server.tool('update_page_folder', 'Update a page folder in this QAY site.', {
    folder_id: z.string().describe('The folder ID to update'),
    name: z.string().optional().describe('New folder name'),
    slug: z.string().optional().describe('New URL slug'),
    settings: z.record(z.string(), z.unknown()).optional().describe('Folder settings'),
  }, async ({ folder_id, name, slug, settings }) => {
    const folder = await updateQayMcpFolder(siteId, folder_id, { name, slug, settings });
    return {
      content: [{
        type: 'text' as const,
        text: JSON.stringify({ message: `Updated folder "${folder.name}"`, folder }, null, 2),
      }],
    };
  });

  server.tool('delete_page_folder', 'Delete a page folder and all its contents for this QAY site.', {
    folder_id: z.string().describe('The folder ID to delete'),
  }, async ({ folder_id }) => {
    await deleteQayMcpFolder(siteId, folder_id);
    return {
      content: [{ type: 'text' as const, text: `Folder ${folder_id} and all its contents deleted successfully.` }],
    };
  });

  server.tool('get_layers', 'Get the full layer tree for a page in this QAY site.', {
    page_id: z.string().describe('The page ID'),
  }, async ({ page_id }) => {
    const layers = await getQayMcpDraftLayers(siteId, page_id);
    return { content: [{ type: 'text' as const, text: JSON.stringify(layers, null, 2) }] };
  });

  server.tool('add_layer', 'Add a new element to a page in this QAY site.', {
    page_id: z.string().describe('The page ID'),
    parent_layer_id: z.string().describe('ID of the parent layer to insert into'),
    position: z.number().optional().describe('Index within parent children. Omit to append at end.'),
    template: templateEnum.describe('Element template to create'),
    text_content: z.string().optional().describe('For text/heading/button/richText: plain display text'),
    rich_content: z.array(z.object({
      type: z.enum(['paragraph', 'heading', 'blockquote', 'bulletList', 'orderedList', 'codeBlock', 'horizontalRule']),
      text: z.string().optional(),
      level: z.number().optional(),
      items: z.array(z.string()).optional(),
    })).optional(),
    custom_name: z.string().optional().describe('Custom display name for the layer'),
  }, async ({ page_id, parent_layer_id, position, template, text_content, rich_content, custom_name }) => {
    const layers = await getQayMcpDraftLayers(siteId, page_id);
    const parent = findLayerById(layers, parent_layer_id);
    if (!parent) {
      return { content: [{ type: 'text' as const, text: `Error: Parent layer "${parent_layer_id}" not found.` }], isError: true };
    }
    if (!canHaveChildren(parent)) {
      return { content: [{ type: 'text' as const, text: `Error: "${parent.customName || parent.name}" cannot have children.` }], isError: true };
    }
    if (parent.name === 'section' && template === 'section') {
      return { content: [{ type: 'text' as const, text: 'Error: Sections cannot contain other sections.' }], isError: true };
    }

    const newLayer = createLayerFromTemplate(template, {
      customName: custom_name,
      textContent: text_content,
      richContent: rich_content as RichTextBlock[] | undefined,
    });
    if (!newLayer) {
      return { content: [{ type: 'text' as const, text: `Error: Unknown template "${template}".` }], isError: true };
    }

    const updated = insertLayer(layers, parent_layer_id, newLayer, position);
    await saveQayMcpDraftLayers(siteId, page_id, updated);
    return {
      content: [{
        type: 'text' as const,
        text: JSON.stringify({
          message: `Added ${template} "${custom_name || newLayer.customName || template}" to page`,
          layer_id: newLayer.id,
          parent_layer_id,
        }, null, 2),
      }],
    };
  });

  server.tool('update_layer_design', 'Update the visual design of a layer in this QAY site.', {
    page_id: z.string().describe('The page ID'),
    layer_id: z.string().describe('The layer ID to update'),
    breakpoint: z.enum(['desktop', 'tablet', 'mobile']).default('desktop'),
    ui_state: z.enum(['neutral', 'hover', 'focus', 'active', 'disabled']).default('neutral'),
    design: designSchema,
  }, async ({ page_id, layer_id, breakpoint, ui_state, design }) => {
    const layers = await getQayMcpDraftLayers(siteId, page_id);
    const layer = findLayerById(layers, layer_id);
    if (!layer) {
      return { content: [{ type: 'text' as const, text: `Error: Layer "${layer_id}" not found.` }], isError: true };
    }

    const updated = updateLayerById(layers, layer_id, (current) =>
      applyDesignToLayer(current, design as Record<string, Record<string, unknown>>, breakpoint, ui_state),
    );
    await saveQayMcpDraftLayers(siteId, page_id, updated);
    const updatedLayer = findLayerById(updated, layer_id);
    return {
      content: [{
        type: 'text' as const,
        text: JSON.stringify({
          message: `Updated design for "${updatedLayer?.customName || updatedLayer?.name}"`,
          layer_id,
          classes: updatedLayer?.classes,
          design: updatedLayer?.design,
        }, null, 2),
      }],
    };
  });

  server.tool('update_layer_text', 'Update the text content of a text, heading, or button layer.', {
    page_id: z.string().describe('The page ID'),
    layer_id: z.string().describe('The layer ID to update'),
    text: z.string().describe('New text content'),
  }, async ({ page_id, layer_id, text }) => {
    const layers = await getQayMcpDraftLayers(siteId, page_id);
    const layer = findLayerById(layers, layer_id);
    if (!layer) {
      return { content: [{ type: 'text' as const, text: `Error: Layer "${layer_id}" not found.` }], isError: true };
    }

    const updated = updateLayerById(layers, layer_id, (current) => ({
      ...current,
      variables: {
        ...current.variables,
        text: { type: 'dynamic_rich_text', data: { content: getTiptapTextContent(text) } },
      },
    }));

    await saveQayMcpDraftLayers(siteId, page_id, updated);
    return { content: [{ type: 'text' as const, text: `Updated text for "${layer.customName || layer.name}" to "${text}"` }] };
  });

  server.tool('set_rich_text_content', 'Set the content of a richText layer using structured blocks.', {
    page_id: z.string().describe('The page ID'),
    layer_id: z.string().describe('The richText layer ID'),
    blocks: z.array(z.object({
      type: z.enum(['paragraph', 'heading', 'blockquote', 'bulletList', 'orderedList', 'codeBlock', 'horizontalRule']),
      text: z.string().optional(),
      level: z.number().optional(),
      items: z.array(z.string()).optional(),
    })).min(1),
  }, async ({ page_id, layer_id, blocks }) => {
    const layers = await getQayMcpDraftLayers(siteId, page_id);
    const layer = findLayerById(layers, layer_id);
    if (!layer) {
      return { content: [{ type: 'text' as const, text: `Error: Layer "${layer_id}" not found.` }], isError: true };
    }

    const updated = updateLayerById(layers, layer_id, (current) => ({
      ...current,
      variables: {
        ...current.variables,
        text: { type: 'dynamic_rich_text', data: { content: buildTiptapDoc(blocks as RichTextBlock[]) } },
      },
    }));

    await saveQayMcpDraftLayers(siteId, page_id, updated);
    return {
      content: [{
        type: 'text' as const,
        text: JSON.stringify({ message: `Set rich text content for "${layer.customName || layer.name}"`, layer_id }, null, 2),
      }],
    };
  });

  server.tool('delete_layer', 'Remove a layer and all its children from a page.', {
    page_id: z.string().describe('The page ID'),
    layer_id: z.string().describe('The layer ID to delete'),
  }, async ({ page_id, layer_id }) => {
    const layers = await getQayMcpDraftLayers(siteId, page_id);
    const layer = findLayerById(layers, layer_id);
    if (!layer) {
      return { content: [{ type: 'text' as const, text: `Error: Layer "${layer_id}" not found.` }], isError: true };
    }
    if (layer.restrictions?.delete === false) {
      return { content: [{ type: 'text' as const, text: `Error: Layer "${layer.customName || layer.name}" cannot be deleted.` }], isError: true };
    }

    const updated = removeLayer(layers, layer_id);
    await saveQayMcpDraftLayers(siteId, page_id, updated);
    return { content: [{ type: 'text' as const, text: `Deleted layer "${layer.customName || layer.name}" (${layer_id})` }] };
  });

  server.tool('move_layer', 'Move a layer to a different parent or position within the page tree.', {
    page_id: z.string().describe('The page ID'),
    layer_id: z.string().describe('The layer ID to move'),
    new_parent_id: z.string().describe('The new parent layer ID'),
    position: z.number().optional().describe('Position within new parent. Omit to append at end.'),
  }, async ({ page_id, layer_id, new_parent_id, position }) => {
    const layers = await getQayMcpDraftLayers(siteId, page_id);
    const layer = findLayerById(layers, layer_id);
    if (!layer) {
      return { content: [{ type: 'text' as const, text: `Error: Layer "${layer_id}" not found.` }], isError: true };
    }
    const newParent = findLayerById(layers, new_parent_id);
    if (!newParent) {
      return { content: [{ type: 'text' as const, text: `Error: New parent "${new_parent_id}" not found.` }], isError: true };
    }
    if (!canHaveChildren(newParent)) {
      return { content: [{ type: 'text' as const, text: `Error: "${newParent.customName || newParent.name}" cannot have children.` }], isError: true };
    }

    const updated = moveLayerInTree(layers, layer_id, new_parent_id, position);
    await saveQayMcpDraftLayers(siteId, page_id, updated);
    return { content: [{ type: 'text' as const, text: `Moved "${layer.customName || layer.name}" into "${newParent.customName || newParent.name}"` }] };
  });

  server.tool('update_layer_link', 'Configure a link on any layer inside this QAY site.', {
    page_id: z.string().describe('The page ID'),
    layer_id: z.string().describe('The layer ID'),
    link_type: z.enum(['url', 'email', 'phone', 'asset', 'page']).describe('Type of link'),
    url: z.string().optional().describe('For url type: the target URL'),
    page_id_target: z.string().optional().describe('For page type: the target page ID'),
    email: z.string().optional().describe('For email type: the email address'),
    phone: z.string().optional().describe('For phone type: the phone number'),
    asset_id: z.string().optional().describe('For asset type: the asset ID to download'),
    target: z.enum(['_blank', '_self']).optional().describe('Link target'),
  }, async ({ page_id, layer_id, link_type, url, page_id_target, email, phone, asset_id, target }) => {
    const layers = await getQayMcpDraftLayers(siteId, page_id);
    const layer = findLayerById(layers, layer_id);
    if (!layer) {
      return { content: [{ type: 'text' as const, text: `Error: Layer "${layer_id}" not found.` }], isError: true };
    }

    if (link_type === 'page' && page_id_target) {
      const targetPage = await getQayMcpPage(siteId, page_id_target);
      if (!targetPage) {
        return { content: [{ type: 'text' as const, text: 'Error: Target page is outside this site.' }], isError: true };
      }
    }

    const link: LinkSettings = { type: link_type };
    if (link_type === 'url' && url) link.url = { type: 'dynamic_text', data: { content: url } };
    if (link_type === 'email' && email) link.email = { type: 'dynamic_text', data: { content: email } };
    if (link_type === 'phone' && phone) link.phone = { type: 'dynamic_text', data: { content: phone } };
    if (link_type === 'asset' && asset_id) link.asset = { id: asset_id };
    if (link_type === 'page' && page_id_target) link.page = { id: page_id_target };
    if (target) link.target = target;

    const updated = updateLayerById(layers, layer_id, (current) => ({
      ...current,
      variables: { ...current.variables, link },
    }));

    await saveQayMcpDraftLayers(siteId, page_id, updated);
    return { content: [{ type: 'text' as const, text: `Set ${link_type} link on "${layer.customName || layer.name}"` }] };
  });
}
