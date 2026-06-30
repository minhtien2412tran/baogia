import { CdnImage } from '../ui/CdnImage';

export function LightSection({
  children,
  className = '',
  title,
  subtitle,
}: {
  children: React.ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
}) {
  return (
    <section className={`jb-light-section ${className}`.trim()}>
      <div className="jb-container">
        {title && (
          <div className="jb-light-section-head">
            <h2 className="jb-light-title">{title}</h2>
            {subtitle && <p className="jb-light-subtitle">{subtitle}</p>}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}
