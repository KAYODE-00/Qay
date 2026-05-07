import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { listQayMcpFolders, listQayMcpPages } from './mcp-site-bindings';

export function registerQaySiteResources(server: McpServer, siteId: string) {
  server.resource(
    'site-pages',
    'ycode://site/pages',
    {
      description: 'Current QAY site structure for this isolated site only',
      mimeType: 'application/json',
    },
    async () => {
      const [pages, folders] = await Promise.all([
        listQayMcpPages(siteId),
        listQayMcpFolders(siteId),
      ]);

      return {
        contents: [{
          uri: 'ycode://site/pages',
          mimeType: 'application/json',
          text: JSON.stringify({
            site_id: siteId,
            pages: pages.map((page) => ({
              id: page.id,
              name: page.name,
              slug: page.slug,
              is_index: page.is_index,
              is_dynamic: page.is_dynamic,
              folder_id: page.page_folder_id,
            })),
            folders: folders.map((folder) => ({
              id: folder.id,
              name: folder.name,
              parent_id: folder.page_folder_id,
            })),
          }, null, 2),
        }],
      };
    },
  );
}
