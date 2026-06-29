import Link from 'next/link';
import { SubPageLayout } from '../../../../components/layout/SubPageLayout';
import { api, safeApi } from '../../../../lib/api';
import { buildMetadata } from '../../../../lib/metadata';
import { navHref } from '../../../../config/navigation';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return buildMetadata({ title: `Empty Leg: ${slug}`, description: 'Empty leg private jet offer.' });
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
      <SubPageLayout locale={locale} title="Offer not found">
        <Link href={navHref(locale, '/empty-leg')} className="jb-link-gold">← All empty legs</Link>
      </SubPageLayout>
    );
  }

  const from = el.fromAirport as { city: string; iata: string };
  const to = el.toAirport as { city: string; iata: string };

  return (
    <SubPageLayout
      locale={locale}
      title={`${from.city} → ${to.city}`}
      description={`${el.discountPct}% off · USD ${Number(el.price).toLocaleString()}`}
      tag="Empty Leg"
      breadcrumb={[
        { label: 'Home', href: '' },
        { label: 'Empty Legs', href: '/empty-leg' },
        { label: String(el.slug) },
      ]}
    >
      <div className="jb-content-block">
        <p><strong>Aircraft:</strong> {String(el.aircraftModel ?? 'TBC')}</p>
        <p><strong>Departure:</strong> {String(el.departAt ?? '').slice(0, 16)}</p>
        <p><strong>Price:</strong> USD {Number(el.price).toLocaleString()} ({String(el.discountPct)}% discount)</p>
      </div>
      <div className="jb-cta-row">
        <Link href={navHref(locale, '/')} className="jb-btn-primary">Request This Empty Leg</Link>
      </div>
    </SubPageLayout>
  );
}
