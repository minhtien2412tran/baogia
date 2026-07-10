export const DESTINATION_CATEGORIES = [
  { label: 'Island Escapes', api: 'ISLAND' },
  { label: 'Ski Escapes', api: 'SKI' },
  { label: 'Golf Escapes', api: 'GOLF' },
] as const;

export type DestinationCategory = (typeof DESTINATION_CATEGORIES)[number]['api'];

/** @deprecated Use `apiLocale` from `config/locales` */
export { apiLocale } from './locales';
