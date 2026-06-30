import { AdminAuthGate } from '../../components/AdminAuthGate';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <AdminAuthGate>{children}</AdminAuthGate>;
}
