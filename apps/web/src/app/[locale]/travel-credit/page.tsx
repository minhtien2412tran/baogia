import { SubPageLayout } from '../../../components/layout/SubPageLayout';
import { api, safeApi } from '../../../lib/api';
import { buildMetadata } from '../../../lib/metadata';

export async function generateMetadata() {
  return buildMetadata({ title: 'Travel Credits', description: 'Prepaid travel credits for flexible private jet bookings.' });
}

export default async function TravelCreditPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const data = await safeApi(() => api.getTravelCreditPackages(), { packages: [] });

  return (
    <SubPageLayout locale={locale} title="Travel Credits" description="Purchase credits upfront and redeem on eligible routes." tag="Membership">
      <div className="jb-jetcard-grid">
        {data.packages.map((pkg: Record<string, unknown>) => (
          <div key={String(pkg.id)} className="jb-jetcard-item">
            <div className="jb-jetcard-hours">{String(pkg.name)}</div>
            <div className="jb-jetcard-subtitle">Credit USD {Number(pkg.creditAmount).toLocaleString()}</div>
            <p style={{ fontSize: 14, color: 'var(--jb-text-muted)' }}>
              Price USD {Number(pkg.priceUsd).toLocaleString()}
              {pkg.bonusPct != null ? ` · ${String(pkg.bonusPct)}% bonus` : ''}
            </p>
          </div>
        ))}
      </div>
    </SubPageLayout>
  );
}
