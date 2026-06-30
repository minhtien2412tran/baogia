'use client';

import { DestinationExplorer } from '../destinations/DestinationExplorer';

export function DestinationsSection({ locale }: { locale: string }) {
  return (
    <section className="jb-section">
      <div className="jb-container">
        <DestinationExplorer locale={locale} variant="home" />
      </div>
    </section>
  );
}
