import Link from 'next/link';
import { t } from '@jetbay/i18n';
import { navHref } from '../../config/navigation';

const CONTINENTS = [
  { code: 'AS', label: 'Asia (AS)' },
  { code: 'EU', label: 'Europe (EU)' },
  { code: 'NA', label: 'North America (NA)' },
  { code: 'SA', label: 'South America (SA)' },
  { code: 'AF', label: 'Africa (AF)' },
  { code: 'OC', label: 'Oceania (OC)' },
] as const;

export type EmptyLegFilterValues = {
  fromContinent?: string;
  toContinent?: string;
  fromAirport?: string;
  toAirport?: string;
  dateFrom?: string;
  passengers?: string;
};

export function EmptyLegFilterForm({
  locale,
  values,
  resultCount,
}: {
  locale: string;
  values: EmptyLegFilterValues;
  resultCount: number;
}) {
  const clearHref = navHref(locale, '/empty-leg');

  return (
    <form method="get" className="jb-el-filters" action={clearHref}>
      <div className="jb-el-filters-grid">
        <label className="jb-el-field">
          <span>{t(locale, 'elFilterFromContinent')}</span>
          <select name="fromContinent" defaultValue={values.fromContinent ?? ''}>
            <option value="">{t(locale, 'elFilterAny')}</option>
            {CONTINENTS.map((c) => (
              <option key={c.code} value={c.code}>
                {c.label}
              </option>
            ))}
          </select>
        </label>
        <label className="jb-el-field">
          <span>{t(locale, 'elFilterToContinent')}</span>
          <select name="toContinent" defaultValue={values.toContinent ?? ''}>
            <option value="">{t(locale, 'elFilterAny')}</option>
            {CONTINENTS.map((c) => (
              <option key={c.code} value={c.code}>
                {c.label}
              </option>
            ))}
          </select>
        </label>
        <label className="jb-el-field">
          <span>{t(locale, 'elFilterFromAirport')}</span>
          <input
            name="fromAirport"
            defaultValue={values.fromAirport ?? ''}
            placeholder="SGN"
            maxLength={4}
            autoComplete="off"
          />
        </label>
        <label className="jb-el-field">
          <span>{t(locale, 'elFilterToAirport')}</span>
          <input
            name="toAirport"
            defaultValue={values.toAirport ?? ''}
            placeholder="HAN"
            maxLength={4}
            autoComplete="off"
          />
        </label>
        <label className="jb-el-field">
          <span>{t(locale, 'elFilterDateFrom')}</span>
          <input name="dateFrom" type="date" defaultValue={values.dateFrom ?? ''} />
        </label>
        <label className="jb-el-field">
          <span>{t(locale, 'elFilterPassengers')}</span>
          <input
            name="passengers"
            type="number"
            min={1}
            max={20}
            defaultValue={values.passengers ?? ''}
            placeholder="1"
          />
        </label>
      </div>
      <div className="jb-el-filters-actions">
        <button type="submit" className="jb-btn jb-btn-primary">
          {t(locale, 'elFilterSearch')}
        </button>
        <Link href={clearHref} className="jb-btn jb-btn-outline">
          {t(locale, 'elFilterClear')}
        </Link>
        <p className="jb-el-filter-count">{t(locale, 'elFilterResults', { n: resultCount })}</p>
      </div>
    </form>
  );
}
