/**
 * Generate apps/api/.env with random local secrets (never commit).
 * Usage: node scripts/generate-local-env.mjs
 */
import { randomBytes } from 'crypto';
import { writeFileSync, existsSync, copyFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const envPath = resolve(root, 'apps/api/.env');
const examplePath = resolve(root, 'apps/api/.env.example');

const secret = (n = 48) => randomBytes(n).toString('hex');

const content = `# Generated ${new Date().toISOString()} — DO NOT COMMIT
# Regenerate: node scripts/generate-local-env.mjs

APP_NAME=JetBay
APP_ENV=development
APP_VERSION=1.0.0
HOST=127.0.0.1
PORT=4000
NODE_ENV=development

DATABASE_URL="postgresql://jta_user:jta_password@127.0.0.1:5432/jta_db?schema=public"
REDIS_URL="redis://127.0.0.1:6379/0"

JWT_SECRET="${secret(48)}"
REFRESH_TOKEN_SECRET="${secret(48)}"
API_KEY="${secret(32)}"
PAYMENT_SECRET="${secret(32)}"

CORS_ORIGIN="http://localhost:3000,http://localhost:3001,http://127.0.0.1:3000,http://127.0.0.1:3001"
API_PUBLIC_URL="http://127.0.0.1:4000"
PAYMENT_RETURN_URL="http://localhost:3000/en-us/account"

MINIO_ENDPOINT="localhost"
MINIO_PORT=9000
MINIO_ACCESS_KEY="minio_admin"
MINIO_SECRET_KEY="minio_password"
MINIO_BUCKET="jetbay-uploads"

SMTP_HOST="localhost"
SMTP_PORT=1025
SMTP_FROM="JetBay <noreply@j-ta.local>"

STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
GOOGLE_CLIENT_ID=
APPLE_CLIENT_ID=
SMS_API_URL=
SMS_API_KEY=
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_FROM_NUMBER=
ESMS_API_KEY=
ESMS_SECRET_KEY=
ESMS_BRANDNAME=
ONEPAY_MERCHANT_ID=
ONEPAY_ACCESS_CODE=
ONEPAY_SECURE_SECRET=
ONEPAY_URL="https://mtf.onepay.vn/paygate/vpcpay.op"
NINEPAY_MERCHANT_KEY=
NINEPAY_SECRET_KEY=
NINEPAY_ENDPOINT=
`;

if (existsSync(envPath)) {
  const bak = `${envPath}.bak.${Date.now()}`;
  copyFileSync(envPath, bak);
  console.log('Backed up existing .env ->', bak);
}

writeFileSync(envPath, content, { mode: 0o600 });
console.log('Wrote', envPath);
console.log('Secrets randomized (values not printed).');
console.log('Template remains at', examplePath);
