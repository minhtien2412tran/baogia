import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export const GroupCharterFAQ = () => {
  const faqs = [
    {
      question: "What are the benefits of booking a private group air charter?",
      answer: "Booking a private group air charter offers numerous benefits, including personalized scheduling, flexibility in choosing departure and arrival airports, enhanced privacy, bespoke catering and amenities, and a dedicated crew ensuring a seamless experience for the entire group."
    },
    {
      question: "Are there any luggage restrictions for group air chartering?",
      answer: "Luggage restrictions vary depending on the aircraft model chosen. However, private charters generally offer more generous baggage allowances than commercial flights. Our team will assist in selecting an aircraft that accommodates your group's specific luggage requirements."
    },
    {
      question: "Is it cost-effective to book a group air charter over commercial flights?",
      answer: "For large groups, booking a private charter can be highly cost-effective when comparing the total price per passenger against first or business class commercial tickets. It also saves valuable time and provides unparalleled convenience."
    },
    {
      question: "What in-flight amenities and services are available on group air charters?",
      answer: "In-flight amenities can be tailored to your group's preferences. This includes custom catering, high-speed Wi-Fi, entertainment systems, comfortable sleeping arrangements, and dedicated flight attendants to ensure exceptional service throughout the journey."
    },
    {
      question: "What types of aircraft are available for group air charters?",
      answer: "We offer a diverse fleet ranging from turboprops and light jets to heavy jets and VIP airliners. The choice of aircraft depends on your group size, travel distance, and specific requirements."
    },
    {
      question: "Can I charter a flight for 50 people?",
      answer: "Yes, we can arrange charters for groups of 50 or more using regional airliners or VIP configured wide-body aircraft, ensuring everyone travels together comfortably."
    },
    {
      question: "Do you offer flexibility in departure and arrival schedules for group air charter flights?",
      answer: "Absolutely. One of the main advantages of a private group charter is the ability to set your own schedule, including departure times that suit your group and the flexibility to adjust times if needed."
    },
    {
      question: "Can I bring pets on a group air charter flight?",
      answer: "Yes, many of our charter operators are pet-friendly. Please inform our concierge team in advance so we can ensure the selected aircraft and destination regulations accommodate your pets safely."
    }
  ];

  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 lg:px-8 py-12 mb-20">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-1.5 h-6 bg-[#D4A64A]"></div>
        <h2 className="text-[28px] md:text-[32px] font-bold text-[#0B1F3A] dark:text-white tracking-tight">
          Frequently Asked Questions about Group Air Charter Services
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-4">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div key={index} className="border-b border-gray-200 dark:border-gray-800 py-4">
              <button 
                className="w-full flex justify-between items-center text-left gap-4"
                onClick={() => setOpenIndex(isOpen ? null : index)}
              >
                <span className="text-[14px] md:text-[15px] font-medium text-[#0B1F3A] dark:text-gray-200">
                  {faq.question}
                </span>
                <ChevronDown 
                  size={18} 
                  className={`text-gray-400 shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
                />
              </button>
              
              <div 
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  isOpen ? 'max-h-[300px] opacity-100 mt-4' : 'max-h-0 opacity-0'
                }`}
              >
                <p className="text-[14px] text-gray-500 dark:text-gray-400 leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
