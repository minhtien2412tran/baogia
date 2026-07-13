/**
 * Shared platform endpoints — admin dashboard ↔ API server.
 */
export const PLATFORM = {
  api: process.env.NEXT_PUBLIC_API_URL ?? 'https://api.minhtien.online',
  web: process.env.NEXT_PUBLIC_WEB_URL ?? 'https://www.minhtien.online',
  admin: process.env.NEXT_PUBLIC_ADMIN_URL ?? 'https://admin.minhtien.online',
  docs: process.env.NEXT_PUBLIC_DOCS_URL ?? 'https://docs.minhtien.online/swagger',
  localWeb: 'http://localhost:3000',
  localAdmin: 'http://localhost:3001',
} as const;
