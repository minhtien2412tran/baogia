type BlockProps = {
  className?: string;
  style?: React.CSSProperties;
};

export function Skeleton({ className = '', style }: BlockProps) {
  return <span className={`jb-skeleton ${className}`.trim()} aria-hidden style={style} />;
}

export function RouteCardSkeleton() {
  return (
    <div className="jb-route-card jb-skeleton-card" aria-hidden>
      <Skeleton className="jb-skeleton-line jb-skeleton-line--lg" style={{ width: '70%' }} />
      <Skeleton className="jb-skeleton-line" style={{ width: '45%', marginTop: 12 }} />
      <Skeleton className="jb-skeleton-line" style={{ width: '55%', marginTop: 20 }} />
      <Skeleton className="jb-skeleton-line jb-skeleton-line--price" style={{ width: '40%', marginTop: 16 }} />
    </div>
  );
}

export function NewsCardSkeleton() {
  return (
    <div className="jb-news-card jb-skeleton-card" aria-hidden>
      <Skeleton className="jb-skeleton-media" />
      <div className="jb-news-card-body">
        <Skeleton className="jb-skeleton-line jb-skeleton-line--lg" />
        <Skeleton className="jb-skeleton-line" style={{ marginTop: 10 }} />
        <Skeleton className="jb-skeleton-line" style={{ width: '60%', marginTop: 10 }} />
        <Skeleton className="jb-skeleton-line jb-skeleton-line--sm" style={{ width: '35%', marginTop: 16 }} />
      </div>
    </div>
  );
}

export function AircraftRowSkeleton() {
  return (
    <div className="jb-aircraft-row jb-skeleton-card jb-aircraft-row--skeleton" aria-hidden>
      <div>
        <Skeleton className="jb-skeleton-line" style={{ width: 120 }} />
        <Skeleton className="jb-skeleton-line jb-skeleton-line--sm" style={{ width: 180, marginTop: 8 }} />
      </div>
      <Skeleton className="jb-skeleton-line jb-skeleton-line--price" style={{ width: 88 }} />
    </div>
  );
}

export function HomePageSkeleton() {
  return (
    <main>
      <div className="jb-skeleton-hero">
        <div className="jb-container">
          <Skeleton className="jb-skeleton-line jb-skeleton-line--hero" />
          <Skeleton className="jb-skeleton-line" style={{ width: '55%', marginTop: 16 }} />
          <div className="jb-quote-card jb-skeleton-card" style={{ marginTop: 28, maxWidth: 720 }}>
            <Skeleton className="jb-skeleton-line" style={{ width: '40%' }} />
            <div className="jb-skeleton-form-grid">
              <Skeleton className="jb-skeleton-field" />
              <Skeleton className="jb-skeleton-field" />
              <Skeleton className="jb-skeleton-field" />
              <Skeleton className="jb-skeleton-field" />
            </div>
            <Skeleton className="jb-skeleton-btn" />
          </div>
        </div>
      </div>
      <section className="jb-section">
        <div className="jb-container">
          <Skeleton className="jb-skeleton-line jb-skeleton-line--lg" style={{ width: 280 }} />
          <div className="jb-routes-scroll jb-hide-scrollbar" style={{ marginTop: 24 }}>
            <RouteCardSkeleton />
            <RouteCardSkeleton />
            <RouteCardSkeleton />
          </div>
        </div>
      </section>
    </main>
  );
}
