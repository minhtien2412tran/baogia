'use client';

import { AccountProvider } from './AccountContext';
import { AccountLayoutInner } from './AccountShell';

export function AccountLayoutClient({
  locale,
  children,
}: {
  locale: string;
  children: React.ReactNode;
}) {
  return (
    <AccountProvider locale={locale}>
      <AccountLayoutInner locale={locale}>{children}</AccountLayoutInner>
    </AccountProvider>
  );
}
