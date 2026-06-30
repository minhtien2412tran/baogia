import { SubPageLayout } from '../../../components/layout/SubPageLayout';
import { TravelCreditEnquiryForm } from '../../../components/forms/TravelCreditEnquiryForm';
import { api, safeApi } from '../../../lib/api';
import { buildMetadata } from '../../../lib/metadata';
import { JB } from '../../../config/jetbay-cdn';
import { CdnImage } from '../../../components/ui/CdnImage';

export async function generateMetadata() {
  return buildMetadata({ title: 'Travel Credits', description: 'Prepaid travel credits for flexible private jet bookings.' });
}

export default async function TravelCreditPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const data = await safeApi(() => api.getTravelCreditPackages(), { packages: [] });
  const packages = data.packages.map((pkg: Record<string, unknown>) => ({
    id: Number(pkg.id),
    name: String(pkg.name),
  }));

  return (
    <>
      <SubPageLayout
        locale={locale}
        title="Travel Credits"
        description="Purchase credits upfront and redeem on eligible routes."
        tag="Membership"
        heroImage={JB.pages.travelCredit.hero}
      >
        <section className="jb-sub-section jb-split">
          <div>
            <h2 className="jb-section-title">Flexible prepaid credits</h2>
            <p className="jb-section-desc">
              Travel Credits offer a flexible way to prepay for private jet travel. Accrue and redeem credits
              based on your account type — individual or company.
            </p>
          </div>
          <div className="jb-split-visual jb-split-visual-img">
            <CdnImage src={JB.pages.travelCredit.picture2} alt="Travel Credits" fill className="jb-cover-img" sizes="50vw" />
          </div>
        </section>

        <section className="jb-sub-section">
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
        </section>
      </SubPageLayout>
      <TravelCreditEnquiryForm packages={packages} />
    </>
  );
}
