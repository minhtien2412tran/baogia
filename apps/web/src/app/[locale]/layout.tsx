import '../../styles/jetbay-home.css';
import { JetBayHeader } from '../../components/home/JetBayHeader';
import { JetBayFooter } from '../../components/home/JetBayFooter';

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return (
    <div className="jb-page">
      <JetBayHeader locale={locale} />
      {children}
      <JetBayFooter locale={locale} />
    </div>
  );
}
