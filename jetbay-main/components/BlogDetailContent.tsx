import React from 'react';
import Image from 'next/image';

export const BlogDetailContent = () => {
  return (
    <div className="w-full max-w-[1000px] mx-auto px-4 lg:px-8 mb-20 font-sans text-gray-800 dark:text-gray-200">
      
      {/* Main Title */}
      <h2 className="text-[32px] md:text-[38px] font-extrabold text-[#0B1F3A] dark:text-white tracking-tight mb-6">
        A Calmer Way for Your Pet to Travel.
      </h2>

      {/* Intro Paragraphs */}
      <div className="space-y-4 text-[14px] leading-relaxed mb-10 text-gray-600 dark:text-gray-400">
        <p>
          Flying out of or into Singapore with a pet can be an administrative headache. Between complex commercial airline cargo policies, strict breed restrictions, long transit times, and tight documentation windows, relocating can be incredibly stressful for both you and your pet.
        </p>
        <p>
          Your companion deserves the same comfort and care you do. Jetbay ensures a gentle, safe, and relaxed flying experience for pets and their owners.
        </p>
      </div>

      {/* Benefits Section */}
      <div className="space-y-6 mb-12">
        <div>
          <h4 className="text-[18px] font-semibold text-[#0B1F3A] dark:text-gray-200 mb-2">Pets Stay in Cabin With You</h4>
          <p className="text-[14px] text-gray-600 dark:text-gray-400">No cargo. No separation. Just comfort and calm.</p>
        </div>
        
        <div>
          <h4 className="text-[18px] font-semibold text-[#0B1F3A] dark:text-gray-200 mb-2">Pet-Friendly Crew & Boarding</h4>
          <p className="text-[14px] text-gray-600 dark:text-gray-400">Smooth boarding, familiar spaces, and soothing cabin environments.</p>
        </div>

        <div>
          <h4 className="text-[18px] font-semibold text-[#0B1F3A] dark:text-gray-200 mb-2">Relocation & Long-Haul Specialists</h4>
          <p className="text-[14px] text-gray-600 dark:text-gray-400">Ideal for intercontinental moves and cross-region relocations.</p>
        </div>

        <div>
          <h4 className="text-[18px] font-semibold text-[#0B1F3A] dark:text-gray-200 mb-2">Concierge Support</h4>
          <p className="text-[14px] text-gray-600 dark:text-gray-400">Guidance on health documents, crates (if required), and arrival handling.</p>
        </div>
      </div>

      {/* Info paragraph */}
      <div className="space-y-4 text-[14px] leading-relaxed mb-10 text-gray-600 dark:text-gray-400">
        <p>
          A <a href="#" className="text-[#13B2A6] dark:text-[#40DACD] hover:underline">pet-friendly private jet charter</a> offers a seamless alternative. Instead of sending your pet to the cargo hold via standard commercial handling, your fur-kid can travel right beside you in the cabin—subject to operator approval, aircraft suitability, and local regulatory clearances.
        </p>
        <p>
          Whether you are relocating your family overseas, moving back to Singapore, or travelling with senior pets, large breeds, or multiple animals, private charters take the anxiety out of the journey. Jetbay helps you compare aircraft options, navigate transparent pricing, and coordinate the complex logistics for a smooth flight.
        </p>
      </div>

      {/* What is a Singapore pet charter flight? */}
      <div className="mb-10">
        <h3 className="text-[28px] font-bold text-[#0B1F3A] dark:text-white mb-6">What is a Singapore pet charter flight?</h3>
        <p className="text-[14px] text-gray-600 dark:text-gray-400 mb-4">
          A pet charter flight is a <a href="#" className="text-[#13B2A6] dark:text-[#40DACD] hover:underline">private aircraft service</a> arranged specifically to accommodate passengers travelling with their animals (most commonly dogs and cats). These are heavily utilised by expats and locals for international relocations, multi-pet moves, or complex routes where commercial airlines fall short.
        </p>
        
        <ul className="list-disc pl-5 space-y-2 text-[14px] text-gray-600 dark:text-gray-400 mb-8">
          <li><strong>Ultimate Control:</strong> You dictate the schedule, routing, and timing to align perfectly with your pet&apos;s comfort and vet certification windows.</li>
          <li><strong>In-Cabin Comfort:</strong> In most cases, your pets stay with you in the cabin rather than being separated in a dark, noisy cargo hold.</li>
          <li><strong>Tailored Aircraft Selection:</strong> Not every private jet is suitable for every pet. Factors like aircraft size, cabin layout, operator policies, and post-flight cleaning requirements matter. Jetbay sources aircraft based on your entire journey&apos;s safety and compliance, not just the lowest price tag.</li>
        </ul>
        
        <div className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] rounded-[16px] overflow-hidden mb-8">
          <Image 
            src="https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?q=80&w=1200" 
            alt="Dog on a private jet" 
            fill 
            className="object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
      </div>

      {/* A less stressful experience for your pet */}
      <div className="mb-10">
        <h3 className="text-[28px] font-bold text-[#0B1F3A] dark:text-white mb-6">A less stressful experience for your pet</h3>
        <p className="text-[14px] text-gray-600 dark:text-gray-400 mb-4">
          For Singaporean pet owners, the main draw of private aviation isn&apos;t luxury. It&apos;s peace of mind. Keeping your companion close eliminates the trauma of separation.
        </p>
        <p className="text-[14px] text-gray-600 dark:text-gray-400 mb-4">
          Private jet travel provides a quiet cabin environment, fewer airport touchpoints, and flexible boarding. This is a game-changer for senior animals, snub-nosed (brachycephalic) breeds facing commercial travel bans, or highly anxious pets.
        </p>
        <p className="text-[14px] text-gray-600 dark:text-gray-400 mb-4">
          Depending on the operator, arrangements can include custom cabin protection, familiar bedding, constant water access, and stress-free boarding procedures at dedicated private terminals.
        </p>
      </div>

      {/* Why Singapore pet owners choose private jets */}
      <div className="mb-10">
        <h3 className="text-[28px] font-bold text-[#0B1F3A] dark:text-white mb-6">Why Singapore pet owners choose private jets</h3>
        <p className="text-[14px] text-gray-600 dark:text-gray-400 mb-6">
          As a major global hub, Singapore sees significant pet relocation traffic tied to corporate and family moves. Common routes include flights between Singapore and the UK, Europe, Australia, Japan, Hong Kong, and regional Southeast Asian destinations.
        </p>

        <h4 className="text-[20px] font-bold text-[#0B1F3A] dark:text-white mb-4">Why go private in Singapore?</h4>
        <ul className="list-disc pl-5 space-y-2 text-[14px] text-gray-600 dark:text-gray-400 mb-4">
          <li><strong>Bypassing Commercial Restrictions:</strong> Many commercial airlines ban specific snub-nosed breeds (like Pugs, Bulldogs, and Persian cats) or heavy dogs due to safety risks. Private charters offer much greater flexibility.</li>
          <li><strong>Beating the Heat:</strong> The tropical heat on the Changi Airport tarmac can pose severe risks to pets waiting for commercial cargo loading. Private flights minimise outdoor exposure.</li>
          <li><strong>Tight Documentation Timelines:</strong> Singapore&apos;s export and import rules operate on strict timelines. Private flights ensure you don&apos;t miss crucial vet or quarantine slots due to commercial flight delays.</li>
        </ul>
      </div>

      {/* Navigating Singapore's pet rules and restrictions */}
      <div className="mb-10">
        <h3 className="text-[28px] font-bold text-[#0B1F3A] dark:text-white mb-6">Navigating Singapore&apos;s pet rules and restrictions</h3>
        <p className="text-[14px] text-gray-600 dark:text-gray-400 mb-6">
          A private charter does not mean you can bypass the law. Pet imports and exports in Singapore are strictly regulated by the <strong>Animal & Veterinary Service (AVS)</strong>, a cluster of the <strong>National Parks Board (NParks)</strong>.
        </p>

        <h4 className="text-[20px] font-bold text-[#0B1F3A] dark:text-white mb-4">Flying into Singapore (import)</h4>
        <p className="text-[14px] text-gray-600 dark:text-gray-400 mb-4">
          Singapore is rabies-free and categorises countries into <strong>Categories A, B, C, and D</strong> based on risk level. Depending on where you are flying from, your pet will face strict requirements:
        </p>
        <ul className="list-disc pl-5 space-y-2 text-[14px] text-gray-600 dark:text-gray-400 mb-6">
          <li>Microchipping (ISO 11784/11785 standard).</li>
          <li>Up-to-date vaccinations and Rabies Antibody Titer Tests.</li>
          <li>Mandatory quarantine at the <strong>Sembawang Animal Quarantine Station (SAQS)</strong> (ranging from 0 to 30 days depending on the country category).</li>
          <li>Mandatory clinical inspection at <strong>Changi Animal & Plant Quarantine (CAPQ)</strong> immediately upon arrival, whether you land at Changi Airport or Seletar Airport.</li>
        </ul>

        <h4 className="text-[20px] font-bold text-[#0B1F3A] dark:text-white mb-4">Flying out of Singapore (export)</h4>
        <ul className="list-disc pl-5 space-y-2 text-[14px] text-gray-600 dark:text-gray-400 mb-4">
          <li>You must apply for an <strong>AVS Export Licence</strong> via the GoBusiness portal within 30 days of departure.</li>
          <li>You must obtain a Veterinary Health Certificate from an AVS-registered vet, often endorsed by AVS within a strict 7-to-10-day window before departure.</li>
          <li>You must meet the specific import and quarantine requirements of your destination country.</li>
        </ul>

        <p className="text-[13px] italic text-gray-500 dark:text-gray-500 mb-8">
          Note: Certain breeds (such as Pit Bulls, Akita, and Perro de Presa Canario) are restricted or banned from import into Singapore under AVS rules, and local leash/muzzle laws will apply upon landing.
        </p>
        
        <div className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] rounded-[16px] overflow-hidden mb-8">
          <Image 
            src="https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=1200" 
            alt="Cat looking out of private jet window" 
            fill 
            className="object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
      </div>

      {/* Transparent pricing for Singapore pet charters */}
      <div className="mb-10">
        <h3 className="text-[28px] font-bold text-[#0B1F3A] dark:text-white mb-6">Transparent pricing for Singapore pet charters</h3>
        <p className="text-[14px] text-gray-600 dark:text-gray-400 mb-4">Private jet costs vary significantly depending on several variables:</p>
        <ul className="list-disc pl-5 space-y-2 text-[14px] text-gray-600 dark:text-gray-400 mb-4">
          <li><strong>Route & Distance:</strong> A regional flight to Bangkok or Jakarta requires a completely different class of aircraft compared to a long-haul flight to London or Melbourne.</li>
          <li><strong>Operational Costs:</strong> Total pricing includes aircraft type, fuel, crew duty limits, landing/handling fees at Seletar or Changi, mandatory post-pet cabin cleaning fees, and permits.</li>
          <li><strong>Technical Stops:</strong> Long-haul flights may require stops for refuelling, which means checking the pet transit rules of intermediate countries.</li>
        </ul>
        <p className="text-[14px] text-gray-600 dark:text-gray-400 mb-4">
          Jetbay focuses on complete pricing transparency. We provide a clear breakdown of what is included, what potential extra charges exist (like unexpected weather diversions or extended ground handling), and why a specific aircraft is chosen for your pet&apos;s size and safety.
        </p>
      </div>

      {/* How to book your pet charter */}
      <div className="mb-10">
        <h3 className="text-[28px] font-bold text-[#0B1F3A] dark:text-white mb-6">How to book your pet charter</h3>
        <ol className="list-decimal pl-5 space-y-2 text-[14px] text-gray-600 dark:text-gray-400 mb-4">
          <li><strong>Share the Profiles:</strong> Provide your pet&apos;s details (species, breed, weight, age, temperament, and number of animals) along with passenger counts and luggage requirements.</li>
          <li><strong>Review Options:</strong> Jetbay assesses operator pet policies, aircraft suitability, and routing options. For Singapore departures, we factor in AVS export timelines; for arrivals, we cross-reference SAQS quarantine availability.</li>
          <li><strong>Get a Transparent Proposal:</strong> You will receive a detailed quote outlining estimated flight times, exact aircraft models, and all included pet-related logistics.</li>
        </ol>
      </div>

      {/* FAQs */}
      <div className="mb-10">
        <h3 className="text-[28px] font-bold text-[#0B1F3A] dark:text-white mb-8">FAQs about pet charter flights in Singapore</h3>
        
        <div className="space-y-8">
          <div>
            <h4 className="text-[18px] font-bold text-[#0B1F3A] dark:text-white mb-2">Can my pet sit on my lap during a private jet flight from Singapore?</h4>
            <p className="text-[14px] text-gray-600 dark:text-gray-400">Yes, in most cases. While rules vary by aircraft operator and country regulations, pets are typically allowed out of their crates in the cabin once the aircraft reaches cruising altitude, provided they are well-behaved.</p>
          </div>
          <div>
            <h4 className="text-[18px] font-bold text-[#0B1F3A] dark:text-white mb-2">Do private jets land at Changi Airport or Seletar Airport for pet flights?</h4>
            <p className="text-[14px] text-gray-600 dark:text-gray-400">Private charters can utilise both, but <strong>Seletar Airport (WSSL)</strong> is highly preferred for private aviation due to quicker processing times, dedicated private terminals, and less congestion, making it less stressful for animals. Regardless of the airport, arrival inspections by CAPQ officers remain mandatory.</p>
          </div>
          <div>
            <h4 className="text-[18px] font-bold text-[#0B1F3A] dark:text-white mb-2">Can I share a pet charter flight with other owners to split the cost?</h4>
            <p className="text-[14px] text-gray-600 dark:text-gray-400">Yes. Group pet pooling (sharing a charter with other families relocating to the same destination, like Singapore to the UK) is a popular way to make private pet travel more cost-effective while still enjoying in-cabin benefits.</p>
          </div>
        </div>
      </div>

    </div>
  );
};
