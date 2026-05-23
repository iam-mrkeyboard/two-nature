## Goal
- Clone One Nature Hotels website using Astro + StudioCMS with CMS-editable homepage, polished luxury design

## Current Architecture
- **Hosting**: Cloudflare Pages (SSR via Workers)
- **Database**: Turso (remote libSQL)
- **Images**: Cloudflare R2 (S3-compatible object storage)
- **Astro**: v6.3.3 SSR with `@astrojs/cloudflare`
- **StudioCMS**: v0.4.4 (auth disabled, direct SQL reads)

## Constraints & Preferences
- Astro SSR with Cloudflare adapter
- Turso remote database (libSQL)
- Cloudflare R2 for image uploads
- Package manager: bun
- Luxury gold/dark theme (gold #C8A977 decorative, #B8966A text)
- Option B gold palette

## Progress
### Done
- All 11 homepage sections built with Swiper + scroll animations
- StudioCMS database migrated and seeded
- Auth migrated to Astro native sessions, StudioCMS auth disabled
- TypeScript errors fixed (zero errors)
- TinyMCE rich text editor in section editor
- Drag-and-drop image upload with R2 + Browser gallery modal
- Blog management CRUD with TinyMCE + image upload
- All data reads via direct SQL (bypass SDK cache)
- Type-safe CMS with Zod schemas for all 11 sections
- BlogCarousel and Navigation editable via CMS
- Design polish: warm ivory palette, fluid typography, clean editorial blog cards, grounded booking bar, gold/dark swiper buttons

### Migration Complete (Cloudflare + Turso + R2)
- libSQL client switched to `@libsql/client/web` for Workers compatibility
- `@astrojs/node` → `@astrojs/cloudflare` adapter
- Filesystem session driver removed (cookie-based now)
- Image upload API rewritten from `fs` → R2 S3 API
- Image gallery API rewritten from `fs.readdirSync` → R2 S3 list
- `@node-rs/argon2` stubbed (native addon → Workers-incompatible, auth is disabled)
- `pg` and `mysql2` installed (StudioCMS optional peer deps)
- Database dump exported (`twonature-dump.sql`) for Turso import
- Build verified: `astro build` succeeds

## Deployment Setup
- Requires Turso DB: `turso db create two-nature` → import `twonature-dump.sql`
- Requires R2 bucket: `wrangler r2 bucket create two-nature-uploads`
- Environment variables needed:
  - `CMS_LIBSQL_URL` = Turso connection URL
  - `TURSO_DB_AUTH_TOKEN` = Turso auth token
  - `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET_NAME`
- Deploy: `bun run build` → `wrangler pages deploy ./dist`

## Key Decisions
- Direct SQL for reads, SDK for writes (where possible)
- S3-compatible R2 API (not Workers R2 bindings) — portable, no wrangler config needed
- Stub `@node-rs/argon2` since auth disabled and native addon incompatible with Workers
- Cookie-based sessions (no filesystem)

## To Do (after Turso + R2 setup)
1. User creates Turso database & imports dump
2. User creates R2 bucket & generates API keys
3. User configures Cloudflare Pages project with env vars
4. Deploy & test admin login + image upload + frontend
5. Set up custom domain in Cloudflare dashboard

## Relevant Files
- `astro.config.mjs` — Cloudflare adapter, Vite alias for argon2 stub
- `src/lib/cms.ts` — Turso-compatible libSQL client
- `src/lib/storage.ts` — R2 image upload/list module
- `src/stubs/argon2.ts` — Native addon stub for Workers
- `src/pages/api/admin/upload.ts` — R2-based upload
- `src/pages/api/admin/images.ts` — R2-based gallery
- `.env` — Template with Turso + R2 + CMS config
- `twonature-dump.sql` — Full DB dump for Turso import
