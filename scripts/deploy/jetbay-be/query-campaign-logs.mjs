#!/usr/bin/env node
/** Query EmailCampaignLog by booking ref — run on VPS: node /tmp/query-campaign-logs.mjs BK-000123 */
const { PrismaClient } = require('@prisma/client');
const ref = process.argv[2];
if (!ref) {
  console.error('usage: node query-campaign-logs.mjs <bookingRef>');
  process.exit(1);
}
const p = new PrismaClient();
(async () => {
  const rows = await p.emailCampaignLog.findMany({
    where: { referenceId: { contains: ref } },
    orderBy: { id: 'desc' },
    take: 40,
  });
  console.log(
    JSON.stringify({
      ref,
      n: rows.length,
      hit: rows.map((r) => ({
        id: r.id,
        key: r.campaignKey,
        status: r.status,
        sentAt: r.sentAt ? new Date(r.sentAt).toISOString() : null,
        email: String(r.email || '').replace(/(.{2}).+(@.+)/, '$1***$2'),
      })),
    }),
  );
  await p.$disconnect();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
