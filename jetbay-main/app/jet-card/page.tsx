import React from 'react';
import { TopbarFull } from '@/components/TopbarFull';
import { Footer } from '@/components/Footer';
import { JetCardHero } from '@/components/JetCardHero';
import { JetCard3DInteractive } from '@/components/JetCard3DInteractive';
import { JetCardFeatures } from '@/components/JetCardFeatures';
import { JetCardTiers } from '@/components/JetCardTiers';
import { JetCardComparison } from '@/components/JetCardComparison';
import { JetCardBenefits } from '@/components/JetCardBenefits';
import { JetCardFleet } from '@/components/JetCardFleet';
import { JetCardSteps } from '@/components/JetCardSteps';
import { JetCardForm } from '@/components/JetCardForm';
import { JetCardFAQ } from '@/components/JetCardFAQ';

export default function JetCardPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#070B14]">
      <TopbarFull />
      <main className="flex-1 w-full overflow-x-hidden">
        <JetCardHero />
        <JetCard3DInteractive />
        <JetCardFeatures />
        <JetCardTiers />
        <JetCardComparison />
        <JetCardBenefits />
        <JetCardFleet />
        <JetCardSteps />
        <JetCardForm />
        <JetCardFAQ />
        <Footer />
      </main>
    </div>
  );
}
