import { AccountLayoutClient } from '../../../components/account/AccountLayoutClient';

export default async function AccountLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return <AccountLayoutClient locale={locale}>{children}</AccountLayoutClient>;
}
