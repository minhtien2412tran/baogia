'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Muted } from '@jetbay/ui';
import { ActionBtn } from './AdminFormFields';
import { adminApi, type FlightScheduleEvent } from '../lib/api';

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function monthBounds(year: number, month: number) {
  const from = new Date(Date.UTC(year, month, 1));
  const to = new Date(Date.UTC(year, month + 1, 0, 23, 59, 59, 999));
  return { from, to };
}

function ymd(d: Date) {
  return d.toISOString().slice(0, 10);
}

function formatTime(iso: string) {
  try {
    return new Date(iso).toLocaleTimeString(undefined, {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: 'UTC',
    }) + ' UTC';
  } catch {
    return iso.slice(11, 16);
  }
}

function sourceLabel(source: FlightScheduleEvent['source']) {
  if (source === 'booking') return 'Booking';
  if (source === 'quote') return 'Quote';
  return 'Empty leg';
}

function sourceClass(source: FlightScheduleEvent['source']) {
  if (source === 'booking') return 'is-booking';
  if (source === 'quote') return 'is-quote';
  return 'is-empty';
}

export function FlightCalendar({
  compact = false,
  initialYear,
  initialMonth,
}: {
  compact?: boolean;
  initialYear?: number;
  initialMonth?: number;
}) {
  const now = new Date();
  const [year, setYear] = useState(initialYear ?? now.getUTCFullYear());
  const [month, setMonth] = useState(initialMonth ?? now.getUTCMonth());
  const [events, setEvents] = useState<FlightScheduleEvent[]>([]);
  const [upcoming, setUpcoming] = useState<FlightScheduleEvent[]>([]);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [selectedDay, setSelectedDay] = useState<string | null>(ymd(now));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const { from, to } = monthBounds(year, month);
    let cancelled = false;
    setLoading(true);
    setError('');
    void adminApi
      .getFlightSchedule(from.toISOString(), to.toISOString())
      .then((res) => {
        if (cancelled) return;
        setEvents(res.events ?? []);
        setUpcoming(res.upcoming ?? []);
        setCounts(res.counts ?? {});
      })
      .catch((e) => {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Load schedule failed');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [year, month]);

  const byDay = useMemo(() => {
    const map = new Map<string, FlightScheduleEvent[]>();
    for (const e of events) {
      const key = e.departureAt.slice(0, 10);
      const list = map.get(key) ?? [];
      list.push(e);
      map.set(key, list);
    }
    return map;
  }, [events]);

  const cells = useMemo(() => {
    const first = new Date(Date.UTC(year, month, 1));
    // Monday-based: getUTCDay Sun=0 → shift
    const startPad = (first.getUTCDay() + 6) % 7;
    const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
    const out: Array<{ date: string | null; day: number | null }> = [];
    for (let i = 0; i < startPad; i++) out.push({ date: null, day: null });
    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(Date.UTC(year, month, d));
      out.push({ date: ymd(date), day: d });
    }
    while (out.length % 7 !== 0) out.push({ date: null, day: null });
    return out;
  }, [year, month]);

  const dayEvents = selectedDay ? byDay.get(selectedDay) ?? [] : [];
  const monthLabel = new Date(Date.UTC(year, month, 1)).toLocaleString(undefined, {
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });

  function shiftMonth(delta: number) {
    const d = new Date(Date.UTC(year, month + delta, 1));
    setYear(d.getUTCFullYear());
    setMonth(d.getUTCMonth());
  }

  return (
    <div className={`jb-cal${compact ? ' jb-cal--compact' : ''}`}>
      <div className="jb-cal__toolbar">
        <div className="jb-cal__nav">
          <ActionBtn onClick={() => shiftMonth(-1)}>←</ActionBtn>
          <strong className="jb-cal__month">{monthLabel}</strong>
          <ActionBtn onClick={() => shiftMonth(1)}>→</ActionBtn>
          <ActionBtn
            onClick={() => {
              const t = new Date();
              setYear(t.getUTCFullYear());
              setMonth(t.getUTCMonth());
              setSelectedDay(ymd(t));
            }}
          >
            Today
          </ActionBtn>
        </div>
        <div className="jb-cal__legend">
          <span className="jb-cal__dot is-booking" /> Booking
          <span className="jb-cal__dot is-quote" /> Quote
          <span className="jb-cal__dot is-empty" /> Empty leg
        </div>
        {!compact ? (
          <Muted>
            {counts.total ?? 0} flights · {counts.booking ?? 0} booked · {counts.quote ?? 0} quote ·{' '}
            {counts.emptyLeg ?? 0} empty
          </Muted>
        ) : (
          <Link href="/dashboard/schedule" className="jb-cal__more">
            Full calendar →
          </Link>
        )}
      </div>

      {error ? <p className="jb-cal__error">{error}</p> : null}
      {loading ? <Muted>Loading flight times…</Muted> : null}

      <div className="jb-cal__grid" role="grid" aria-label="Flight calendar">
        {WEEKDAYS.map((w) => (
          <div key={w} className="jb-cal__dow">
            {w}
          </div>
        ))}
        {cells.map((c, i) => {
          if (!c.date) {
            return <div key={`e-${i}`} className="jb-cal__cell is-empty" />;
          }
          const dayList = byDay.get(c.date) ?? [];
          const isSelected = selectedDay === c.date;
          const isToday = c.date === ymd(new Date());
          return (
            <button
              key={c.date}
              type="button"
              className={`jb-cal__cell${isSelected ? ' is-selected' : ''}${isToday ? ' is-today' : ''}`}
              onClick={() => setSelectedDay(c.date)}
            >
              <span className="jb-cal__daynum">{c.day}</span>
              <span className="jb-cal__marks">
                {dayList.slice(0, 3).map((e) => (
                  <span
                    key={e.id}
                    className={`jb-cal__dot ${sourceClass(e.source)}`}
                    title={`${e.route} ${formatTime(e.departureAt)}`}
                  />
                ))}
                {dayList.length > 3 ? (
                  <span className="jb-cal__more-count">+{dayList.length - 3}</span>
                ) : null}
              </span>
            </button>
          );
        })}
      </div>

      <div className="jb-cal__detail">
        <h4 className="jb-cal__detail-title">
          {selectedDay
            ? `Flights · ${selectedDay}`
            : 'Select a day'}
        </h4>
        {!dayEvents.length ? (
          <Muted>No departures this day.</Muted>
        ) : (
          <ul className="jb-cal__list">
            {dayEvents.map((e) => (
              <li key={e.id} className={`jb-cal__item ${sourceClass(e.source)}`}>
                <div className="jb-cal__time">{formatTime(e.departureAt)}</div>
                <div className="jb-cal__meta">
                  <Link href={e.href} className="jb-cal__route">
                    {e.route}
                  </Link>
                  <div className="jb-cal__sub">
                    {sourceLabel(e.source)}
                    {e.bookingCode ? ` · ${e.bookingCode}` : ''}
                    {e.customer ? ` · ${e.customer}` : ''}
                    {e.passengers != null ? ` · ${e.passengers} pax` : ''}
                    {e.aircraft ? ` · ${e.aircraft}` : ''}
                    {' · '}
                    {e.status}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {compact && upcoming.length > 0 ? (
        <div className="jb-cal__upcoming">
          <h4 className="jb-cal__detail-title">Upcoming</h4>
          <ul className="jb-cal__list">
            {upcoming.slice(0, 5).map((e) => (
              <li key={`u-${e.id}`} className={`jb-cal__item ${sourceClass(e.source)}`}>
                <div className="jb-cal__time">
                  {e.departureAt.slice(0, 10)} · {formatTime(e.departureAt)}
                </div>
                <div className="jb-cal__meta">
                  <Link href={e.href} className="jb-cal__route">
                    {e.route}
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
