import { CdnImage } from '../ui/CdnImage';

export function FeatureGrid({
  items,
  className = '',
}: {
  items: { icon: string; title: string; body?: string }[];
  className?: string;
}) {
  return (
    <div className={`jb-feature-grid ${className}`.trim()}>
      {items.map((item) => (
        <div key={item.title} className="jb-feature-card jb-feature-card--heritage">
          <CdnImage src={item.icon} alt="" width={48} height={48} className="jb-feature-card-icon" />
          <h3>{item.title}</h3>
          {item.body && <p>{item.body}</p>}
        </div>
      ))}
    </div>
  );
}
