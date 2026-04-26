# CLAUDE.md

This file provides guidance to Claude Code when working in this repository.

## Commands

```bash
npm run dev      # Start dev server (Next.js, port 3000)
npm run build    # Production build
npm run lint     # ESLint
```

No test suite configured. Requires `.env.local` with Supabase keys to run locally (see `.env.local.example`).

## Architecture

**NeuralEdge** is a Next.js 16 (App Router) + TypeScript platform for an AI automation consulting business. It serves a public marketing site, a protected client dashboard, and an admin portal.

**Stack:** Next.js 16, React 19, Tailwind CSS 4, Supabase (auth + PostgreSQL), Vercel.

## Route Map

### Public
| Route | Purpose |
|---|---|
| `/` | Marketing homepage |
| `/automations` | Automation catalogue (Supabase-driven) |
| `/articles` | Blog list |
| `/articles/[slug]` | Article detail |
| `/login` | Supabase auth |

### Client Dashboard (any authenticated user)
| Route | Purpose |
|---|---|
| `/dashboard` | Overview: projects + stats |
| `/dashboard/projects` | Project list |
| `/dashboard/projects/[id]` | Project detail: milestones + metrics |

### Admin Portal (role === "admin" only)
| Route | Purpose |
|---|---|
| `/admin` | Admin home (counts) |
| `/admin/clients` | All clients table |
| `/admin/clients/new` | Create client (creates Supabase auth user) |
| `/admin/clients/[id]` | Client detail + projects |
| `/admin/projects` | All projects |
| `/admin/projects/new` | Create project |
| `/admin/projects/[id]` | Manage project: milestones + metrics |
| `/admin/automations` | Automation catalogue CRUD |
| `/admin/articles` | Blog management |
| `/admin/articles/new` | Create article |
| `/admin/leads` | Leads + enquiries inbox |

## Auth & Role Routing

Supabase handles sessions. After login:
- `app_metadata.role === "admin"` → `/admin`
- Any other authenticated user → `/dashboard`
- Unauthenticated → `/login`

Set role in Supabase dashboard: Authentication → Users → Edit user → app_metadata: `{"role": "admin"}`

## Supabase Client Wrappers (`lib/supabase/`)

- `client.ts` — `getSupabaseBrowserClient()` — browser singleton for client components
- `server.ts` — `getSupabaseServerClient()` — user session, for server components (respects RLS)
- `server.ts` — `getSupabaseAdminClient()` — service role, bypasses RLS (admin pages only)

## Key Database Tables

| Table | Purpose |
|---|---|
| `leads` | Email captures |
| `enquiries` | Custom automation scoping requests |
| `articles` | Blog articles (admin-managed) |
| `automations` | Automation catalogue (admin-managed) |
| `clients` | Client records linked to auth users |
| `projects` | Per-client automation projects |
| `project_milestones` | Ordered milestones per project |
| `automation_metrics` | Per-project performance data |

See `supabase-migration.sql` for schemas and RLS policies.

## Styling

- Tailwind CSS 4 with custom properties in `globals.css`
- Colours: `--black #050508`, `--accent #00f5d4`, `--gold #f5a623`, `--white #f0eff8`, `--muted #6b6a80`
- Fonts: Syne (display/headings), DM Mono (body), Instrument Serif (italic accents)

## Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
NEXT_PUBLIC_SITE_URL
```

## Deployment

- **Live URL:** https://neuraledge-alpha.vercel.app
- **Vercel project:** neuraledge (team: bdmanagementgroup)
- **Framework preset must be "Next.js"** — "Other" causes 404 on all routes
- Push to `main` triggers auto-deploy

## Design Spec

Full design specification at `docs/superpowers/specs/2026-04-26-neuraledge-design.md` — covers architecture, DB schema, all pages, auth flow, and data flows.

## Known Gotchas

- **Section labels use `{"//"}`** — writing `//` as JSX text triggers `react/jsx-no-comment-textnodes`. Use `<span>{"//"}</span>` instead.
- **Supabase FK joins type as arrays** — `.select("automations(name)")` gives `{ name: string }[]`, not `{ name: string }`. Cast via `as unknown as { name: string } | { name: string }[] | null` and handle both.
- **Always use `<Link>` for internal navigation** — bare `<a href="/internal">` triggers `@next/next/no-html-link-for-pages` lint error.
- **`price_from` stored in cents** — divide by 100 for display (e.g. `250000` → `$2,500`).
- **`middleware.ts` deprecation warning** — Next.js 16 warns to use `proxy.ts` instead, but `middleware.ts` still works fine.

## Setting Admin Role

The Supabase UI doesn't expose `app_metadata` directly. Use the SQL editor:
```sql
UPDATE auth.users
SET raw_app_meta_data = raw_app_meta_data || '{"role": "admin"}'
WHERE email = 'your@email.com';
```
