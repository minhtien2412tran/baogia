import Link from 'next/link';
import { SubPageLayout } from '../../../components/layout/SubPageLayout';
import { EmptyLegAlertsForm } from '../../../components/home/EmptyLegAlertsForm';
import { api, safeApi } from '../../../lib/api';
import { buildMetadata } from '../../../lib/metadata';
import { navHref } from '../../../config/navigation';

export async function generateMetadata() {
  return buildMetadata({ title: 'Empty Legs', description: 'Last-minute private jet deals at reduced rates.' });
}

export default async function EmptyLegPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const data = await safeApi(() => api.getEmptyLegs(), { emptyLegs: [] });

  return (
    <SubPageLayout locale={locale} title="Empty Legs" description="Last-minute private jet deals at reduced rates." tag="Deals">
      <div className="jb-empty-grid">
        {data.emptyLegs.map((el: Record<string, unknown>) => {
          const from = el.fromAirport as { city?: string };
          const to = el.toAirport as { city?: string };
          return (
            <Link key={String(el.slug)} href={navHref(locale, `/empty-leg-recommendation/${el.slug}`)} className="jb-empty-card">
              <span className="jb-discount-badge">{String(el.discountPct)}% off</span>
              <div className="jb-route-line">{from?.city} → {to?.city}</div>
              <div className="jb-price">USD {Number(el.price).toLocaleString()}</div>
            </Link>
          );
        })}
      </div>
      <EmptyLegAlertsForm locale={locale} />
    </SubPageLayout>
  );
}
