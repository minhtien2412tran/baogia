'use client';

import { SectionTitle, Muted } from '@jetbay/ui';
import { AdminShell } from '../../../components/AdminShell';
import { FlightCalendar } from '../../../components/FlightCalendar';

export default function FlightSchedulePage() {
  return (
    <AdminShell active="/dashboard/schedule">
      <SectionTitle>Flight calendar</SectionTitle>
      <Muted>
        Lịch bay / giờ bay từ cùng nguồn web: booking legs, quote itinerary, empty legs. Giờ hiển thị
        UTC (local airport time lưu trong itinerary).
      </Muted>
      <div style={{ marginTop: 16 }}>
        <FlightCalendar />
      </div>
    </AdminShell>
  );
}
