import { SubPageLayout } from '../../../components/layout/SubPageLayout';
import { FeatureGrid } from '../../../components/layout/FeatureGrid';
import { JetCardEnquiryForm } from '../../../components/forms/JetCardEnquiryForm';
import { JetCardComparison } from '../../../components/layout/JetCardComparison';
import { FaqAccordion } from '../../../components/layout/FaqAccordion';
import { StepsTimeline } from '../../../components/layout/StepsTimeline';
import { LightSection } from '../../../components/layout/LightSection';
import { api, safeApi } from '../../../lib/api';
import { buildMetadata } from '../../../lib/metadata';
import { JB, jetCardArt } from '../../../config/jetbay-cdn';
import { CdnImage } from '../../../components/ui/CdnImage';

const PLAN_COPY: Record<number, { subtitle: string; desc: string }> = {
  10: { subtitle: 'Occasional private flyers', desc: 'Flexibility without long-term commitment' },
  25: { subtitle: 'Business travellers & executives', desc: 'Lower hourly rates, priority booking' },
  50: { subtitle: 'Frequent global travellers', desc: 'Best value, ultimate convenience' },
};

export async function generateMetadata() {
  return buildMetadata({
    title: 'Private Jet Membership – The Ultimate Private Jet Membership',
    description: 'Private Jet Membership gives flexible access to a vast network of private jet aircraft worldwide.',
  });
}

export default async function JetCardPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const data = await safeApi(() => api.getJetCardPlans(), { plans: [] });

  return (
    <div className="jb-jetcard-page">
      <SubPageLayout
        locale={locale}
        title="The Ultimate Private Jet Membership"
        description="Private Jet Membership is an exclusive private jet membership program that gives clients flexible access to a vast network of private jet aircraft worldwide."
        tag="Jet Card"
        heroImage={JB.pages.jetCard.hero}
      >
        <section className="jb-sub-section">
          <h2 className="jb-section-title">Elevate Your Travel with Private Jet Membership</h2>
          <p className="jb-section-desc">
            Designed for frequent flyers, business executives, and luxury travellers who require on-demand private
            aviation with guaranteed availability.
          </p>
          <FeatureGrid
            className="jb-jetcard-benefits"
            items={JB.pages.jetCard.benefits.map((b) => ({
              icon: b.icon,
              title: b.title,
              body: 'Book anytime, anywhere — just a tap away.',
            }))}
          />
        </section>

        <section className="jb-sub-section">
          <h2 className="jb-section-title">Choose Your Preferred Private Jet Membership Option</h2>
          <div className="jb-jetcard-grid">
            {data.plans.map((p: Record<string, unknown>) => {
              const hours = Number(p.hours ?? 10);
              const copy = PLAN_COPY[hours] ?? { subtitle: String(p.name), desc: '' };
              return (
                <div key={String(p.id)} className="jb-jetcard-item">
                  <div className="jb-jetcard-art">
                    <CdnImage
                      src={jetCardArt(hours)}
                      alt={`${hours} hour Jet Card`}
                      fill
                      sizes="(max-width:900px) 100vw, 33vw"
                      className="jb-jetcard-img"
                    />
                  </div>
                  <div className="jb-jetcard-body">
                    <div className="jb-jetcard-hours">{hours} Hour Jet Card</div>
                    <div className="jb-jetcard-tagline">{copy.subtitle}</div>
                    <div className="jb-jetcard-subtitle">{copy.desc}</div>
                    <a href="#jet-card-enquiry" className="jb-unlock-link">
                      Unlock Now ›
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="jb-sub-section">
          <JetCardComparison />
        </section>
      </SubPageLayout>

      <LightSection
        title="How to Join Private Jet Membership Programme?"
        subtitle="Customised for clients flying more than 6 flights a year"
      >
        <StepsTimeline
          steps={JB.pages.jetCard.joinSteps.map((s, i) => ({
            title: `${i + 1}. ${s.title}`,
            body: s.body,
          }))}
        />
      </LightSection>

      <section className="jb-section">
        <div className="jb-container">
          <h2 className="jb-section-title">FAQs – Private Jet Membership Membership</h2>
          <FaqAccordion items={JB.pages.jetCard.faqs} />
        </div>
      </section>

      <JetCardEnquiryForm />
    </div>
  );
}
