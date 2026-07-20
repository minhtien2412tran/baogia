import React from 'react';

export const LogoStrip = () => {
  const content = (
    <div className="flex items-center gap-12 md:gap-16 lg:gap-24 text-white whitespace-nowrap min-w-max px-6">
      {/* Featured Media */}
      <div className="flex items-center gap-8 md:gap-12">
        <span className="font-bold text-[18px] md:text-[20px]">Featured Media</span>
        <div className="flex items-center gap-8 md:gap-12 opacity-90">
          <span className="font-serif text-2xl">BT</span>
          <span className="font-bold text-sm tracking-widest uppercase leading-tight text-center">Business<br/>Insider</span>
          <span className="font-bold text-lg italic tracking-tighter">Supercar Blondie</span>
          <span className="font-bold text-xl">EINPRESSWIRE</span>
          <span className="font-bold text-sm uppercase">Business Air News</span>
        </div>
      </div>

      {/* Industry Membership */}
      <div className="flex items-center gap-8 md:gap-12">
        <span className="font-bold text-[18px] md:text-[20px]">Industry Membership</span>
        <div className="flex items-center gap-8 md:gap-12 opacity-90">
          <span className="font-bold text-sm uppercase">WYVERN</span>
          <span className="font-bold text-sm uppercase tracking-widest">ASBAA</span>
          <span className="font-bold text-sm uppercase">NBAA</span>
          <span className="font-bold text-sm uppercase italic">BBGA</span>
          <span className="font-bold text-sm uppercase">EBAA MEMBER</span>
          <span className="font-bold text-sm leading-tight text-center">The Air Charter<br/>Association</span>
        </div>
      </div>

      {/* Social Media */}
      <div className="flex items-center gap-8 md:gap-12">
        <span className="font-bold text-[18px] md:text-[20px]">Social Media</span>
        <div className="flex items-center gap-8 md:gap-12 opacity-90">
          <span className="font-semibold text-base italic">Instagram</span>
          <span className="font-semibold text-base">Facebook</span>
          <span className="font-semibold text-base">LinkedIn</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full bg-gradient-to-r from-[#699E96] via-[#5FB2A6] to-[#699E96] dark:from-[#1E302D] dark:via-[#162B28] dark:to-[#1E302D] py-8 mb-24 overflow-hidden relative flex items-center">
      <div className="flex animate-marquee min-w-max">
        {content}
        {content}
      </div>
    </div>
  );
};
