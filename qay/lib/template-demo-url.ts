export type TemplateWithPreview = {
  id: string;
  livePreviewUrl: string | null;
};

export function getQayTemplateDemoPath(templateId: string) {
  return `/templates/demo/${encodeURIComponent(templateId)}`;
}

export function withQayTemplateDemoUrl<T extends TemplateWithPreview>(template: T): T {
  return {
    ...template,
    livePreviewUrl: template.livePreviewUrl ? getQayTemplateDemoPath(template.id) : null,
  };
}

export function withQayTemplateDemoUrls<T extends TemplateWithPreview>(templates: T[]): T[] {
  return templates.map(withQayTemplateDemoUrl);
}
