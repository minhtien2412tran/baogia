import { t } from '@jetbay/i18n';
import { SubPageLayout } from '../../../components/layout/SubPageLayout';
import { LightSection } from '../../../components/layout/LightSection';
import { EmptyLegAlertsForm } from '../../../components/home/EmptyLegAlertsForm';
import { EmptyLegBrowse } from '../../../components/empty-leg/EmptyLegBrowse';
import { StepsTimeline } from '../../../components/layout/StepsTimeline';
import { buildMetadata } from '../../../lib/metadata';
import { JB } from '../../../config/jetbay-cdn';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return buildMetadata({
    title: t(locale, 'emptyLegPageTitle'),
    description: t(locale, 'emptyLegMetaDesc'),
    path: `/${locale}/empty-leg`,
  });
}

export default async function EmptyLegPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  const howItWorks = [
    { title: t(locale, 'elStepBrowseTitle'), body: t(locale, 'elStepBrowseBody'), image: JB.pages.emptyLeg.steps[0] },
    { title: t(locale, 'elStepSelectTitle'), body: t(locale, 'elStepSelectBody'), image: JB.pages.emptyLeg.steps[1] },
    { title: t(locale, 'elStepBookTitle'), body: t(locale, 'elStepBookBody'), image: JB.pages.emptyLeg.steps[2] },
    { title: t(locale, 'elStepFlyTitle'), body: t(locale, 'elStepFlyBody'), image: JB.pages.emptyLeg.steps[3] },
  ];

  return (
    <>
      <SubPageLayout
        locale={locale}
        title={t(locale, 'emptyLegPageTitle')}
        description={t(locale, 'emptyLegPageDesc')}
        tag={t(locale, 'deals')}
        heroImage={JB.pages.emptyLeg.hero}
        showQuoteWidget
      >
        <EmptyLegBrowse locale={locale} />
        <EmptyLegAlertsForm locale={locale} />
      </SubPageLayout>

      <LightSection title={t(locale, 'howEmptyLegsWork')}>
        <StepsTimeline steps={howItWorks} />
      </LightSection>
    </>
  );
}
