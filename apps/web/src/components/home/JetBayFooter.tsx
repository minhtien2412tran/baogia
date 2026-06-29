import { NewsletterForm } from './NewsletterForm';

export function JetBayFooter({ locale }: { locale: string }) {
  const p = `/${locale}`;
  return (
    <footer className="jb-footer">
      <div className="jb-container">
        <div className="jb-footer-grid">
          <div>
            <a href={p} className="jb-logo" style={{ display: 'inline-block', marginBottom: 16 }}>J-TA</a>
            <p style={{ color: 'var(--jb-text-muted)', fontSize: 14, margin: '0 0 20px', lineHeight: 1.6 }}>
              A leading global private jet charter platform. Seamless access to 10,000+ aircraft worldwide.
            </p>
            <h4>Subscribe to our newsletter</h4>
            <p style={{ fontSize: 13, color: 'var(--jb-text-muted)', margin: '0 0 8px' }}>
              Get exclusive deals and updates on private jet travel
            </p>
            <NewsletterForm locale={locale} />
            <div className="jb-payment-row">
              {['Visa', 'Mastercard', 'Amex', 'UnionPay', 'Discover'].map((c) => (
                <span key={c} className="jb-pay-badge">{c}</span>
              ))}
            </div>
          </div>
          <div>
            <h4>Services</h4>
            <ul className="jb-footer-links">
              <li><a href={`${p}/private-jet-charter`}>Private Jet Charter</a></li>
              <li><a href={`${p}/fixed-price-charter`}>Fixed Price</a></li>
              <li><a href={`${p}/empty-leg`}>Empty Legs</a></li>
              <li><a href={`${p}/jet-card`}>Jet Card</a></li>
              <li><a href={`${p}/air-ambulance`}>Air Ambulance</a></li>
            </ul>
          </div>
          <div>
            <h4>Company</h4>
            <ul className="jb-footer-links">
              <li><a href={`${p}/about-us`}>About Us</a></li>
              <li><a href={`${p}/global-partnership-program`}>Partner Program</a></li>
              <li><a href={`${p}/article/privacy-policy`}>Privacy Policy</a></li>
              <li><a href={`${p}/article/cookie-consent`}>Cookie Consent</a></li>
            </ul>
            <h4 style={{ marginTop: 24 }}>Memberships</h4>
            <div className="jb-payment-row">
              {['WYVERN', 'ACA', 'NBAA', 'EBAA', 'AsBAA', 'BBGA'].map((m) => (
                <span key={m} className="jb-pay-badge">{m}</span>
              ))}
            </div>
          </div>
        </div>
        <div className="jb-footer-bottom">
          <span>© 2026 J-TA Inc. All rights reserved.</span>
          <div className="jb-social">
            <a href="#">Instagram</a>
            <a href="#">LinkedIn</a>
            <a href="#">YouTube</a>
            <a href="#">TikTok</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
