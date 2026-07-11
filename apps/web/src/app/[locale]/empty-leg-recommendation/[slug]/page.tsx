import Link from 'next/link';
import { t, tn } from '@jetbay/i18n';
import { SubPageLayout } from '../../../../components/layout/SubPageLayout';
import { EmptyLegRequestForm } from '../../../../components/forms/EmptyLegRequestForm';
import { api, safeApi } from '../../../../lib/api';
import { buildMetadata } from '../../../../lib/metadata';
import { navHref } from '../../../../config/navigation';

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  return buildMetadata({
    title: `${tn(locale, 'emptyLegs')}: ${slug}`,
    description: t(locale, 'emptyLegMetaDesc'),
    path: `/${locale}/empty-leg-recommendation/${slug}`,
  });
}

export default async function EmptyLegDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const el = await safeApi(() => api.getEmptyLeg(slug), null);

  if (!el) {
    return (
      <SubPageLayout locale={locale} title={t(locale, 'offerNotFound')}>
        <Link href={navHref(locale, '/empty-leg')} className="jb-link-gold">
          ← {t(locale, 'allEmptyLegsBack')}
        </Link>
      </SubPageLayout>
    );
  }

  const from = el.fromAirport as { city: string; iata: string };
  const to = el.toAirport as { city: string; iata: string };

  return (
    <SubPageLayout
      locale={locale}
      title={`${from.city} → ${to.city}`}
      description={`${t(locale, 'discountOff', { n: String(el.discountPct) })} · USD ${Number(el.price).toLocaleString()}`}
      tag={t(locale, 'emptyLegOfferTag')}
      breadcrumb={[
        { label: tn(locale, 'home'), href: '' },
        { label: tn(locale, 'emptyLegs'), href: '/empty-leg' },
        { label: String(el.slug) },
      ]}
    >
      <div className="jb-content-block">
        <p>
          <strong>{t(locale, 'labelAircraft')}:</strong> {String(el.aircraftModel ?? 'TBC')}
        </p>
        <p>
          <strong>{t(locale, 'labelDeparture')}:</strong> {String(el.departAt ?? '').slice(0, 16)}
        </p>
        <p>
          <strong>{t(locale, 'labelPrice')}:</strong> USD {Number(el.price).toLocaleString()} (
          {String(el.discountPct)}% {t(locale, 'labelDiscount')})
        </p>
      </div>
      <EmptyLegRequestForm emptyLegId={Number(el.id)} />
    </SubPageLayout>
  );
}
