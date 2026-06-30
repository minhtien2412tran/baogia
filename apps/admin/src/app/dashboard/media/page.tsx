'use client';

import { SectionTitle, Muted } from '@j-ta/ui';
import { AdminShell } from '../../../components/AdminShell';

export default function MediaAdminPage() {
  return (
    <AdminShell active="/dashboard/media">
      <SectionTitle>Media Library</SectionTitle>
      <Muted>
        Media assets use JETBAY CDN URLs configured in the web app. Upload integration (MinIO) is planned for a future sprint.
      </Muted>
    </AdminShell>
  );
}
