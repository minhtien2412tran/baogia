import { t, type MessageKey } from '@jetbay/i18n';

/** Visible notice when listing API failed or returned empty. */
export function ApiLoadNotice({
  locale,
  kind,
  className = '',
}: {
  locale: string;
  kind: 'error' | 'empty';
  className?: string;
}) {
  const key: MessageKey = kind === 'error' ? 'apiLoadFailed' : 'listEmpty';
  return (
    <p
      className={`jb-api-load-notice jb-api-load-notice--${kind} ${className}`.trim()}
      role={kind === 'error' ? 'alert' : 'status'}
    >
      {t(locale, key)}
    </p>
  );
}
