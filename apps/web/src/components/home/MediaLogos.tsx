import { JB } from '../../config/jetbay-cdn';
import { CdnImage } from '../ui/CdnImage';

export function MediaLogos() {
  return (
    <section className="jb-section" style={{ padding: '24px 0' }}>
      <div className="jb-container">
        <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--jb-text-muted)', marginBottom: 24 }}>Featured Media</p>
        <div className="jb-logos-row">
          {JB.media.map((m) => (
            <CdnImage key={m.alt} src={m.src} alt={m.alt} width={120} height={40} className="jb-media-logo" />
          ))}
        </div>
        <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--jb-text-muted)', margin: '32px 0 24px' }}>Industry Membership</p>
        <div className="jb-logos-row">
          {JB.membership.map((m) => (
            <CdnImage key={m.alt} src={m.src} alt={m.alt} width={80} height={44} className="jb-media-logo" />
          ))}
        </div>
      </div>
    </section>
  );
}
