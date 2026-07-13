'use client';

import { use } from 'react';
import Link from 'next/link';
import { useAccount } from '../../../../components/account/AccountContext';
import { AccountEmpty, AccountPanel, StatusBadge } from '../../../../components/account/AccountUI';
import { t } from '../../../../lib/i18n';

function DocumentsContent({ locale }: { locale: string }) {
  const { data } = useAccount();
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
            title="No documents yet"
            hint="Documents are generated when you have an active or completed booking."
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
                <div className="jb-account-doc-card__icon" aria-hidden>📄</div>
                <div>
                  <h3>{d.documentType.replace(/_/g, ' ')}</h3>
                  <p className="jb-account-meta">Booking #{d.bookingId}</p>
                  <StatusBadge status={d.status} />
                </div>
                <div className="jb-account-doc-card__actions">
                  {d.fileUrl && (
                    <a href={d.fileUrl} className="jb-btn-ghost" target="_blank" rel="noreferrer">
                      PDF
                    </a>
                  )}
                  {d.htmlUrl && (
                    <a href={d.htmlUrl} className="jb-btn-ghost" target="_blank" rel="noreferrer">
                      HTML
                    </a>
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

export default function AccountDocumentsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: loc } = use(params);
  const locale = loc ?? 'en-us';
  return <DocumentsContent locale={locale} />;
}
