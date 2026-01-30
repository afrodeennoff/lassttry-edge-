import { ConsentBanner } from "@/components/consent-banner";
import { I18nProviderClient } from "@/locales/client";
import { RootProviders } from "@/components/providers/root-providers";
import Modals from "@/components/modals";
import { RithmicSyncNotifications } from "./dashboard/components/import/rithmic/sync/rithmic-notifications";

export default async function RootLayout(props: { params: Promise<{ locale: string }>, children: React.ReactNode }) {
  const params = await props.params;
  const { locale } = params;
  const { children } = props;

  return (
    <I18nProviderClient locale={locale}>
      <RootProviders>
        <RithmicSyncNotifications />
        <ConsentBanner />
        {children}
        <Modals />
      </RootProviders>
    </I18nProviderClient>
  );
} 