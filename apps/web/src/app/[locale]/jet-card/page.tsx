import Link from 'next/link';
import { SubPageLayout } from '../../../components/layout/SubPageLayout';
import { api, safeApi } from '../../../lib/api';
import { buildMetadata } from '../../../lib/metadata';
import { navHref } from '../../../config/navigation';

export async function generateMetadata() {
  return buildMetadata({ title: 'Jet Card', description: 'Prepaid private jet hours with J-TA Jet Card.' });
}

export default async function JetCardPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const data = await safeApi(() => api.getJetCardPlans(), { plans: [] });

  return (
    <SubPageLayout locale={locale} title="Jet Card Membership" description="Prepaid flight hours with transparent pricing." tag="Membership">
      <div className="jb-jetcard-grid">
        {data.plans.map((p: Record<string, unknown>) => (
          <div key={String(p.id)} className="jb-jetcard-item">
            <div className="jb-jetcard-hours">{String(p.hours)} Hour</div>
            <div style={{ fontWeight: 600 }}>{String(p.name)}</div>
            <div className="jb-jetcard-subtitle">USD {Number(p.price).toLocaleString()}</div>
            <p style={{ fontSize: 14, color: 'var(--jb-text-muted)' }}>
              {String(p.validityYears)} year validity · Min notice {String(p.minNoticeHours)}h
            </p>
          </div>
        ))}
      </div>
      <div className="jb-cta-row" style={{ marginTop: 24 }}>
        <Link href={navHref(locale, '/login')} className="jb-btn-primary">Apply for Jet Card</Link>
      </div>
    </SubPageLayout>
  );
}
