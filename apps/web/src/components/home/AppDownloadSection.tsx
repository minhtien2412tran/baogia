export function AppDownloadSection({ locale }: { locale: string }) {
  const p = `/${locale}`;
  return (
    <section className="jb-section">
      <div className="jb-container">
        <div className="jb-split">
          <div>
            <span className="jb-tag">Download Our App</span>
            <h2 className="jb-section-title">Book Private Jets on the Go</h2>
            <p className="jb-section-desc">
              Experience seamless booking with our mobile app. Manage flight requests, stay updated on trip
              details, and access private aviation from anywhere in the world.
            </p>
            <div className="jb-cta-row">
              <a href={`${p}/jetbay-private-jet-app`} className="jb-btn-outline">Download on the App Store</a>
            </div>
          </div>
          <div className="jb-split-visual">[Image: Mobile app mockup]</div>
        </div>
      </div>
    </section>
  );
}
