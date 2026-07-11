'use client';

type Props = {
  fromIata: string;
  fromCity: string;
  toIata: string;
  toCity: string;
};

export function RouteFlightBanner({ fromIata, fromCity, toIata, toCity }: Props) {
  return (
    <div className="jb-route-flight-banner" aria-hidden>
      <div className="jb-route-flight-end">
        <span className="jb-route-flight-iata">{fromIata}</span>
        <span className="jb-route-flight-city">{fromCity}</span>
      </div>
      <div className="jb-route-flight-track">
        <span className="jb-route-flight-dash" />
        <span className="jb-route-flight-plane">
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
          </svg>
        </span>
        <span className="jb-route-flight-dot" />
      </div>
      <div className="jb-route-flight-end jb-route-flight-end--dest">
        <span className="jb-route-flight-iata">{toIata}</span>
        <span className="jb-route-flight-city">{toCity}</span>
      </div>
    </div>
  );
}
