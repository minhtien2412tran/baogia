'use client';

import { use, useState } from 'react';
import Link from 'next/link';
import { useAccount } from '../../../../components/account/AccountContext';
import { AccountEmpty, AccountPanel, StatusBadge } from '../../../../components/account/AccountUI';
import { t } from '../../../../lib/i18n';

function DocumentsContent({ locale }: { locale: string }) {
  const { data, token } = useAccount();
  if (!data) return null;

  return (
    <>
      <header className="jb-account-hero">
        <h1>{t(locale, 'documents')}</h1>
        <p>{data.documents.length} charter documents</p>
      </header>
      <AccountPanel title="Charter Documents" subtitle="Agreements and contracts for your bookings">
        {data.documents.length === 0 ? (
          <AccountEmpty
            title={t(locale, 'noDocumentsTitle')}
            hint={t(locale, 'noDocumentsHint')}
            action={
              data.bookings.length === 0 ? (
                <Link href={`/${locale}`} className="jb-btn-primary">
                  {t(locale, 'searchFlights')}
                </Link>
              ) : undefined
            }
          />
        ) : (
          <div className="jb-account-doc-grid">
            {data.documents.map((d) => (
              <article key={d.id} className="jb-account-doc-card">
                <div className="jb-account-doc-card__icon" aria-hidden />
                <div>
                  <h3>{d.documentType.replace(/_/g, ' ')}</h3>
                  <p className="jb-account-meta">Booking #{d.bookingId}</p>
                  <StatusBadge status={d.status} />
                </div>
                <div className="jb-account-doc-card__actions">
                  {d.fileUrl && (
                    <DocumentDownloadButton token={token} url={d.fileUrl} label="PDF" />
                  )}
                  {d.htmlUrl && (
                    <DocumentDownloadButton token={token} url={d.htmlUrl} label="HTML" />
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </AccountPanel>
    </>
  );
}

function DocumentDownloadButton({
  token,
  url,
  label,
}: {
  token: string | null;
  url: string;
  label: string;
}) {
  const [loading, setLoading] = useState(false);

  async function download() {
    if (!token || loading) return;
    setLoading(true);
    try {
      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Unable to download document');
      const blob = await response.blob();
      const href = URL.createObjectURL(blob);
      window.open(href, '_blank', 'noopener,noreferrer');
      window.setTimeout(() => URL.revokeObjectURL(href), 60_000);
    } catch {
      window.alert('Unable to download document');
    } finally {
      setLoading(false);
    }
  }

  return (
    <button type="button" className="jb-btn-ghost" onClick={() => void download()} disabled={loading}>
      {loading ? '…' : label}
    </button>
  );
}

export default function AccountDocumentsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: loc } = use(params);
  const locale = loc ?? 'en-us';
  return <DocumentsContent locale={locale} />;
}
