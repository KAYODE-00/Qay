import CustomCodeInjector from '@/components/CustomCodeInjector';
import QayPreviewMode from '@/components/QayPreviewMode';
import { getSettingsByKeys } from '@/lib/repositories/settingsRepository';

export default async function QayPreviewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSettingsByKeys(['custom_code_body']);
  const globalCustomCodeBody = settings.custom_code_body as string | null;

  return (
    <>
      <QayPreviewMode />
      {children}
      {globalCustomCodeBody && <CustomCodeInjector html={globalCustomCodeBody} />}
    </>
  );
}
