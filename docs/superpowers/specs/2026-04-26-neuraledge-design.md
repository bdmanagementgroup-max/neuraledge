# NeuralEdge — Design Spec

Date: 2026-04-26

## Context

NeuralEdge is an AI automation consulting business. The goal is a full-stack web platform that:
- Markets and sells AI automation packages and custom projects
- Gives clients a protected dashboard to track their project status and automation metrics
- Gives the admin (owner) a portal to manage clients, projects, leads, articles, and the automation catalogue

Stack mirrors the proven Eleusis FX platform (Next.js 16, Supabase, Vercel) adapted for the AI consulting domain. The existing `neuraledge.html` design is evolved (not replaced) into the Next.js site.

---

## Architecture

**Stack:** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4, Supabase (auth + PostgreSQL), Vercel

**Reused from Eleusis (copy and adapt):**
- `lib/supabase/client.ts` — browser Supabase singleton
- `lib/supabase/server.ts` — `getSupabaseServerClient()` + `getSupabaseAdminClient()`
- Auth login page and session pattern
- Admin/dashboard layout guards
- `CustomCursor`, `RevealInit`, `RevealWrapper` components
- Article pages pattern (list + detail with hardcoded fallbacks)
- `POST /api/leads` route
- Vercel config, ESLint config, Tailwind setup

**New for NeuralEdge:**
- Automation catalogue (public page + admin CRUD)
- Enquiry form and API route
- Client project tracker (`projects` + `project_milestones` tables)
- Automation metrics panel (`automation_metrics` table)
- Admin project management (create, milestone updates, metrics editing)

**Project root:** `/Users/benjamindavies/Documents/Claude - NeuralEdge /`
**GitHub remote:** `https://github.com/bdmanagementgroup-max/neuraledge`

---

## File Structure

```
app/
  page.tsx                          ← homepage
  login/page.tsx                    ← Supabase auth (reused)
  automations/page.tsx              ← public automation catalogue
  articles/page.tsx                 ← blog list
  articles/[slug]/page.tsx          ← article detail
  dashboard/
    layout.tsx                      ← auth guard → /login if no session
    page.tsx                        ← client overview
    projects/page.tsx               ← client project list
    projects/[id]/page.tsx          ← project detail + metrics
  admin/
    layout.tsx                      ← admin role guard
    page.tsx                        ← admin home
    clients/page.tsx                ← all clients + leads table
    clients/[id]/page.tsx           ← client detail + create project
    projects/page.tsx               ← all projects
    projects/new/page.tsx           ← create project
    projects/[id]/page.tsx          ← manage project milestones + metrics
    automations/page.tsx            ← automation catalogue CRUD
    articles/page.tsx               ← blog management
    articles/new/page.tsx           ← create article
    leads/page.tsx                  ← leads + enquiries inbox
  api/
    leads/route.ts                  ← POST → leads
    enquiries/route.ts              ← POST → enquiries
    automations/route.ts            ← GET (public)
    articles/route.ts               ← GET list + POST (admin)
    admin/
      automations/route.ts          ← POST/PUT/DELETE
      projects/route.ts             ← POST
      projects/[id]/route.ts        ← PUT (status, milestones)
      metrics/[projectId]/route.ts  ← PUT
      clients/route.ts              ← GET all clients
  globals.css
  layout.tsx
  favicon.ico

components/
  layout/
    Nav.tsx
    Footer.tsx
    CustomCursor.tsx                ← reused from Eleusis
    RevealInit.tsx                  ← reused from Eleusis
    RevealWrapper.tsx               ← reused from Eleusis
  home/
    Hero.tsx
    StatsBar.tsx
    Services.tsx
    Marquee.tsx
    Process.tsx
    Testimonials.tsx
    Pricing.tsx
    CtaSection.tsx
    LeadMagnet.tsx
    EnquiryModal.tsx
  dashboard/
    ProjectCard.tsx
    MetricsPanel.tsx
    MilestoneTracker.tsx
    StatStrip.tsx
  admin/
    ClientsTable.tsx
    ProjectsTable.tsx
    AutomationsClient.tsx
    LeadsInbox.tsx

lib/
  supabase/
    client.ts                       ← reused from Eleusis
    server.ts                       ← reused from Eleusis

supabase-migration.sql
.env.local.example
CLAUDE.md
```

---

## Database Schema

### `leads`
| Column | Type | Notes |
|---|---|---|
| id | uuid PK | |
| email | text | |
| name | text | |
| created_at | timestamptz | |

### `enquiries`
| Column | Type | Notes |
|---|---|---|
| id | uuid PK | |
| name | text | |
| email | text | |
| company | text | |
| message | text | |
| automation_type | text | pre-filled from catalogue card |
| created_at | timestamptz | |

### `articles`
| Column | Type | Notes |
|---|---|---|
| id | uuid PK | |
| title | text | |
| slug | text UNIQUE | |
| content | text | |
| excerpt | text | |
| published | bool | default false |
| published_at | timestamptz | |
| created_at | timestamptz | |

### `automations`
| Column | Type | Notes |
|---|---|---|
| id | uuid PK | |
| name | text | |
| slug | text UNIQUE | |
| description | text | |
| category | text | e.g. "Lead Gen", "Ops", "Finance" |
| price_from | int | starting price in cents (USD); null = custom |
| active | bool | default true |
| sort_order | int | |
| created_at | timestamptz | |

### `clients`
| Column | Type | Notes |
|---|---|---|
| id | uuid PK | |
| user_id | uuid FK → auth.users | RLS anchor |
| name | text | |
| email | text | |
| company | text | |
| plan | text | "Launchpad" \| "Transform" \| "Enterprise" |
| status | text | "active" \| "paused" \| "completed" |
| created_at | timestamptz | |

### `projects`
| Column | Type | Notes |
|---|---|---|
| id | uuid PK | |
| client_id | uuid FK → clients | |
| user_id | uuid FK → auth.users | denormalised for RLS |
| title | text | |
| description | text | |
| status | text | "discovery" \| "build" \| "review" \| "live" \| "paused" |
| automation_id | uuid FK → automations | nullable (null = custom project) |
| start_date | date | |
| target_date | date | |
| created_at | timestamptz | |

### `project_milestones`
| Column | Type | Notes |
|---|---|---|
| id | uuid PK | |
| project_id | uuid FK → projects | |
| title | text | |
| status | text | "pending" \| "in_progress" \| "completed" |
| completed_at | timestamptz | |
| sort_order | int | |

### `automation_metrics`
| Column | Type | Notes |
|---|---|---|
| id | uuid PK | |
| project_id | uuid FK → projects | |
| user_id | uuid FK → auth.users | for RLS |
| runs_total | int | default 0 |
| runs_this_month | int | default 0 |
| hours_saved_total | numeric | default 0 |
| hours_saved_this_month | numeric | default 0 |
| error_rate | numeric | % — default 0 |
| last_run_at | timestamptz | |
| updated_at | timestamptz | |

**RLS:** `clients`, `projects`, `project_milestones`, `automation_metrics` — SELECT where `user_id = auth.uid()`. Admin client bypasses all RLS via service role key.

---

## Public Pages

| Route | Components | Data |
|---|---|---|
| `/` | Hero, StatsBar, Services, Marquee, Process, Testimonials, Pricing, CtaSection, LeadMagnet | Static. LeadMagnet → `POST /api/leads`. CTA opens EnquiryModal → `POST /api/enquiries` |
| `/automations` | AutomationCard grid | Supabase `automations` (active, ordered by sort_order) |
| `/articles` | ArticleCard grid | Supabase `articles` (published) |
| `/articles/[slug]` | Article content | Supabase first, 3 hardcoded fallbacks |
| `/login` | Supabase auth form | Reused from Eleusis |

**Homepage design:** Port all sections from `neuraledge.html` with evolved Tailwind CSS. Replace raw JS cursor/reveal with React components. Replace `mailto:` CTA with EnquiryModal.

**EnquiryModal:** Collects name, email, company, message, automation interest. `POST /api/enquiries`. Can be pre-filled with automation name from catalogue.

---

## Client Dashboard

All routes protected — redirect to `/login` if no session. Uses `getSupabaseServerClient()` (RLS enforced by DB).

| Route | Content |
|---|---|
| `/dashboard` | Stat strip (active projects, total runs, hours saved, error rate). Project cards with status badge + milestone progress bar. Empty state if no projects. |
| `/dashboard/projects` | Full project list, filterable by status |
| `/dashboard/projects/[id]` | Milestone tracker (vertical stepper), metrics panel (shown only when `status = "live"`), project info |

---

## Admin Portal

All routes protected — `app_metadata.role === "admin"` required. Uses `getSupabaseAdminClient()` (bypasses RLS).

| Route | Function |
|---|---|
| `/admin` | Counts: active clients, open leads/enquiries, live projects |
| `/admin/clients` | All clients table + leads count |
| `/admin/clients/[id]` | Client detail, their projects, "Create Project" button |
| `/admin/projects` | All projects, filterable by status |
| `/admin/projects/new` | Form: pick client, title, description, automation, dates. Auto-creates 4 default milestones. |
| `/admin/projects/[id]` | Update milestone status, edit metrics, change project status |
| `/admin/automations` | CRUD: add, edit, deactivate, reorder automation catalogue entries |
| `/admin/articles` | List articles, publish/unpublish toggle |
| `/admin/articles/new` | Create article: title, slug, content, excerpt |
| `/admin/leads` | Merged inbox: `leads` + `enquiries`, newest first |

---

## Auth & Role Routing

Supabase handles sessions. After login:
- `app_metadata.role === "admin"` → `/admin`
- Any other authenticated user → `/dashboard`
- Unauthenticated → `/login`

Set role in Supabase dashboard per user. Admin client onboards new clients by creating a Supabase auth user, then creating a `clients` row linked to that `user_id`.

---

## Data Flows

- Lead capture → `POST /api/leads` → Supabase `leads`
- Enquiry form → `POST /api/enquiries` → Supabase `enquiries`
- Automation catalogue → `GET /api/automations` → Supabase `automations` (active)
- New article → `POST /api/articles` → Supabase `articles`
- Create project → `POST /api/admin/projects` → Supabase `projects` + 4 default `project_milestones`
- Update project → `PUT /api/admin/projects/[id]` → Supabase `projects` + `project_milestones`
- Update metrics → `PUT /api/admin/metrics/[projectId]` → Supabase `automation_metrics`
- Client dashboard → `getSupabaseServerClient()` reads `projects` + `project_milestones` + `automation_metrics` (RLS by user_id)

---

## Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
NEXT_PUBLIC_SITE_URL
```

---

## Styling

- Tailwind CSS 4 with custom properties in `globals.css` matching `neuraledge.html` tokens
- `--black: #050508`, `--deep: #0a0a12`, `--surface: #0f0f1a`, `--edge: #1a1a2e`
- `--accent: #00f5d4`, `--gold: #f5a623`, `--white: #f0eff8`, `--muted: #6b6a80`
- Fonts: Syne (display), DM Mono (body), Instrument Serif (italic accents)
- Noise overlay, grid background, scroll reveal animations — all ported from HTML
