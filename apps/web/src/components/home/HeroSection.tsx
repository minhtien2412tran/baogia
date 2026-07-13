import { JB } from '../../config/jetbay-cdn';
import { QuoteSearchWidget } from '../QuoteSearchWidget';
import { AviationMotionIcon } from '../ui/AviationMotionIcon';
import { t } from '../../lib/i18n';
import { HeroParticles } from './HeroParticles';

export function HeroSection({ locale, currency }: { locale: string; currency?: string }) {
  return (
    <section className="jb-hero">
      <div
        className="jb-hero-bg"
        aria-hidden
        style={{ backgroundImage: `linear-gradient(105deg, rgba(10, 12, 15, 0.92) 0%, rgba(10, 12, 15, 0.55) 45%, rgba(10, 12, 15, 0.75) 100%), url(${JB.homeBg})` }}
      />
      <HeroParticles />
      <div className="jb-hero-flight" aria-hidden>
        <svg className="jb-hero-flight__svg" viewBox="0 0 1200 160" preserveAspectRatio="none">
          <path
            className="jb-hero-flight__glow"
            d="M40 120 C 280 20, 520 20, 760 90 S 1100 140, 1160 60"
            fill="none"
          />
          <path
            id="jb-hero-flight-curve"
            className="jb-hero-flight__dash"
            d="M40 120 C 280 20, 520 20, 760 90 S 1100 140, 1160 60"
            fill="none"
          />
          <g className="jb-hero-flight__plane">
            <animateMotion dur="20s" repeatCount="indefinite" rotate="auto">
              <mpath href="#jb-hero-flight-curve" />
            </animateMotion>
            <path
              fill="currentColor"
              transform="translate(-18 -18) scale(0.5)"
              d="M62 30.5 38 28l-8-18h-4l6 18H16L8 22H5l5 10L5 42h3l8-6h16l-6 18h4l8-18 24-2.5z"
            />
          </g>
        </svg>
      </div>
      <div className="jb-hero-clouds" aria-hidden>
        <span className="jb-hero-cloud jb-hero-cloud--a" />
        <span className="jb-hero-cloud jb-hero-cloud--b" />
        <span className="jb-hero-cloud jb-hero-cloud--c" />
      </div>
      <div className="jb-hero-content">
        <h1>{t(locale, 'heroTitle')}</h1>
        <p className="jb-hero-sub">{t(locale, 'heroSubtitle')}</p>

        <div className="jb-trust-row">
          <span className="jb-trust-item">
            <span className="jb-hero-trust-orb">
              <AviationMotionIcon name="shield" size="sm" motion="pulse" />
            </span>
            {t(locale, 'securePayment')}
          </span>
          <span className="jb-trust-divider">|</span>
          <span className="jb-trust-item">
            <span className="jb-hero-trust-orb" style={{ animationDelay: '0.4s' }}>
              <AviationMotionIcon name="concierge" size="sm" motion="float" />
            </span>
            {t(locale, 'concierge24')}
          </span>
          <span className="jb-trust-divider">|</span>
          <span className="jb-trust-item">
            <span className="jb-hero-trust-orb" style={{ animationDelay: '0.8s' }}>
              <AviationMotionIcon name="jetStar" size="sm" />
            </span>
            {t(locale, 'premiumAircraft')}
          </span>
        </div>

        <QuoteSearchWidget locale={locale} currency={currency} />
      </div>
    </section>
  );
}
