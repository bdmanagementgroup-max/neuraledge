import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";
import AutomationCTA from "@/components/automations/AutomationCTA";
import { getSupabaseServerClient } from "@/lib/supabase/server";

type AutomationFull = {
  id: string;
  name: string;
  slug: string;
  description: string;
  long_description?: string | null;
  features?: string[];
  category: string;
  price_from: number | null;
};


type Step = { step: string; title: string; body: string };

const HOW_IT_WORKS_MAP: Record<string, Step[]> = {
  "lead-generation-bot": [
    { step: "01", title: "Setup & Integration", body: "We connect the bot to your website forms, LinkedIn, and email inbox. Configure your ICP scoring criteria and CRM destination in a single onboarding session." },
    { step: "02", title: "Capture & Score", body: "Every inbound lead is automatically captured, enriched with company and role data, then scored against your ICP. Below-threshold leads enter a nurture sequence; above-threshold leads trigger an immediate sales alert." },
    { step: "03", title: "Nurture & Handoff", body: "Warm leads are handed off to your sales team with full context: company data, lead score, and conversation history — ready to close." },
  ],
  "invoice": [
    { step: "01", title: "Connect & Configure", body: "We integrate with your email inbox, document storage, and accounting system (Xero, QuickBooks, or Sage). Define your chart of accounts, supplier list, and exception thresholds in a single onboarding session." },
    { step: "02", title: "Extract & Match", body: "Every invoice — PDF, image, or email — is processed automatically. AI extracts line items, supplier details, and amounts, then matches each record against open purchase orders in your system." },
    { step: "03", title: "Post & Alert", body: "Clean, matched records are posted directly to your accounting system. Anomalies, duplicates, and unmatched items are flagged for human review — nothing is posted without confidence." },
  ],
  "support": [
    { step: "01", title: "Connect Your Helpdesk", body: "We integrate with Zendesk, Intercom, Freshdesk, or your email inbox. Define your ticket taxonomy, priority rules, and escalation paths in a single onboarding session." },
    { step: "02", title: "Triage & Route", body: "Every inbound ticket is classified by type, urgency, and customer sentiment. Common queries are resolved automatically with on-brand responses; complex issues are routed to the right team member instantly." },
    { step: "03", title: "Learn & Improve", body: "The system tracks resolution rates and surfaces recurring issues — giving you the data to reduce ticket volume at the source over time." },
  ],
};

const WHATS_INCLUDED_MAP: Record<string, string[]> = {
  "lead-generation-bot": [
    "Fully configured automation (n8n, Make, or custom stack)",
    "CRM integration (HubSpot, Salesforce, or Pipedrive)",
    "Lead scoring model calibrated to your ICP",
    "3 nurture email templates written and loaded",
    "30-day post-launch monitoring and optimisation",
  ],
  "invoice": [
    "Fully configured automation (n8n, Make, or custom stack)",
    "Accounting system integration (Xero, QuickBooks, or Sage)",
    "Custom exception rules and approval thresholds",
    "Anomaly detection and duplicate flagging",
    "30-day post-launch monitoring and optimisation",
  ],
  "support": [
    "Fully configured automation (n8n, Make, or custom stack)",
    "Helpdesk integration (Zendesk, Intercom, Freshdesk, or email)",
    "Custom triage taxonomy and routing rules",
    "Auto-response templates for your top 10 query types",
    "30-day post-launch monitoring and optimisation",
  ],
};

const DEFAULT_HOW_IT_WORKS: Step[] = [
  { step: "01", title: "Discovery & Setup", body: "We audit your current workflow and connect the automation to your existing tools. Configuration and integration completed in a single onboarding session." },
  { step: "02", title: "Build & Test", body: "The automation is built, tested against real data, and refined until it runs cleanly end-to-end with no manual intervention required." },
  { step: "03", title: "Go Live & Optimise", body: "We deploy to production and monitor closely for 30 days, tuning performance and handling any edge cases that emerge." },
];

const DEFAULT_WHATS_INCLUDED = [
  "Fully configured automation (n8n, Make, or custom stack)",
  "Integration with your existing tools and systems",
  "Full documentation and handover",
  "30-day post-launch monitoring and optimisation",
  "Admin dashboard for visibility and control",
];

const SEEDS: Record<string, AutomationFull> = {
  "lead-generation-bot": {
    id: "seed-lgb", name: "Lead Generation Bot", slug: "lead-generation-bot", category: "Lead Gen", price_from: 250000,
    description: "Automatically qualify and nurture inbound leads from your website, LinkedIn, and email. Runs 24/7 so your sales team only talks to warm prospects.",
    long_description: "Most sales teams spend 60–70% of their time chasing leads that will never convert. The Lead Generation Bot fixes that at the source.\n\nIt connects to every channel where potential customers reach out — your website contact form, LinkedIn DMs, and inbound email — and applies a consistent qualification framework automatically. Each lead is scored against your ideal customer profile, enriched with company and role data, and either nurtured through a personalised sequence or escalated to your sales team as a warm, context-rich handoff.\n\nYour team stops chasing dead ends and starts every conversation already knowing what the prospect needs and why they reached out.",
    features: ["Multi-channel lead intake (website, LinkedIn, email)", "AI-powered ICP scoring and lead qualification", "Automatic lead enrichment (company, role, intent signals)", "Personalised nurture sequences triggered by behaviour", "CRM sync — leads pushed directly into HubSpot, Salesforce, or Pipedrive", "Warm handoff alerts with full context for your sales team", "Real-time dashboard showing pipeline volume and conversion rates", "Weekly digest email summarising lead quality and funnel health"],
  },
  "invoice": {
    id: "seed-inv", name: "Invoice & Finance Automation", slug: "invoice", category: "Finance", price_from: 180000,
    description: "Auto-extract data from invoices, reconcile with your accounting system, and flag anomalies. Eliminates manual data entry from your finance workflow.",
    long_description: "Finance teams spend hours every week manually keying invoice data into accounting systems — work that is error-prone, soul-destroying, and completely automatable.\n\nThe Invoice & Finance Automation connects to wherever invoices arrive (email, cloud storage, supplier portals) and processes them end-to-end. AI extracts every field — supplier, amounts, line items, payment terms — with high accuracy across PDFs, scanned images, and structured documents.\n\nEach record is matched against your open purchase orders and posted directly to your accounting system. Anomalies, duplicates, and unmatched items are flagged for review rather than posted blindly — so your books stay clean without requiring a human to touch every document.",
    features: ["Automated invoice ingestion (email, PDF, image, portal)", "AI field extraction — supplier, amounts, line items, terms", "PO matching and three-way reconciliation", "Direct posting to your accounting system (Xero, QuickBooks, Sage)", "Duplicate detection and anomaly flagging", "Approval workflow for exceptions above defined thresholds", "Audit trail for every processed document", "Monthly processing report and exception summary"],
  },
  "support": {
    id: "seed-sup", name: "Customer Support Triage", slug: "support", category: "Ops", price_from: 220000,
    description: "AI triage that categorises, prioritises, and routes support tickets — and resolves common queries automatically. Reduces support volume by 40–60%.",
    long_description: "Support teams burn out on repetitive tickets. Password resets, order status checks, refund requests — the same queries, over and over, handled manually by people who could be solving real problems.\n\nThe Customer Support Triage automation sits between your customers and your team. Every inbound ticket is instantly classified by type, urgency, and sentiment. Common queries are resolved automatically with accurate, on-brand responses. Complex issues are enriched with context and routed to the right person — not just the next available agent.\n\nThe result is a support operation that handles 40–60% more volume without adding headcount, with faster first-response times and higher customer satisfaction scores.",
    features: ["Multi-channel ingestion (email, chat, helpdesk, social)", "AI classification by type, urgency, and customer sentiment", "Automatic resolution of common query types", "Smart routing to the right team or individual", "Customer history and context attached to every escalation", "SLA tracking and breach alerting", "Real-time dashboard — volume, resolution rate, CSAT", "Weekly report on top query types and resolution performance"],
  },
};

async function getAutomation(slug: string): Promise<AutomationFull | null> {
  try {
    const supabase = await getSupabaseServerClient();
    const { data } = await supabase
      .from("automations")
      .select("id, name, slug, description, long_description, features, category, price_from")
      .eq("slug", slug)
      .eq("active", true)
      .single();
    if (data) return data as AutomationFull;
  } catch {}
  return SEEDS[slug] ?? null;
}

function formatPrice(cents: number | null): string {
  if (!cents) return "Custom Quote";
  return `From $${(cents / 100).toLocaleString()}`;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const automation = await getAutomation(slug);
  return {
    title: automation ? `${automation.name} — NeuralEdge` : "Automation — NeuralEdge",
  };
}

export default async function AutomationProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const automation = await getAutomation(slug);
  if (!automation) notFound();

  const features = automation.features ?? [];
  const longDesc = automation.long_description || automation.description;
  const paragraphs = longDesc.split("\n\n").filter(Boolean);
  const howItWorks = HOW_IT_WORKS_MAP[slug] ?? DEFAULT_HOW_IT_WORKS;
  const whatsIncluded = WHATS_INCLUDED_MAP[slug] ?? DEFAULT_WHATS_INCLUDED;

  return (
    <>
      <Nav />
      <main style={{ paddingTop: 120 }}>
        {/* Hero */}
        <section style={{ padding: "80px 60px 100px" }} className="product-section">
          <Link
            href="/automations"
            style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              color: "var(--muted)", fontSize: 12, letterSpacing: "0.1em",
              textTransform: "uppercase", textDecoration: "none", marginBottom: 48,
            }}
            className="back-link"
          >
            ← All Automations
          </Link>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "80px", alignItems: "start" }} className="hero-grid">
            <div>
              <div style={{ fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--accent)", marginBottom: 20, display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ color: "var(--muted)" }}>{"//"}</span> {automation.category}
              </div>
              <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(36px, 5vw, 64px)", fontWeight: 800, letterSpacing: -2, lineHeight: 1.05, marginBottom: 24 }}>
                {automation.name}
              </h1>
              <p style={{ color: "var(--muted)", fontSize: 15, lineHeight: 1.9, maxWidth: 520, marginBottom: 40 }}>
                {automation.description}
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 32, flexWrap: "wrap" }}>
                <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 28, color: "var(--gold)" }}>
                  {formatPrice(automation.price_from)}
                </span>
                <AutomationCTA automationName={automation.name} variant="hero" />
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 2 }} className="hero-stats">
              {[
                { label: "Availability", value: "24/7" },
                { label: "Setup time", value: "2–3 weeks" },
                { label: "Avg. lead quality uplift", value: "3×" },
                { label: "Post-launch support", value: "30 days" },
              ].map(({ label, value }) => (
                <div key={label} style={{ background: "var(--surface)", padding: "20px 28px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 12, color: "var(--muted)", letterSpacing: "0.05em" }}>{label}</span>
                  <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 20, color: "var(--accent)" }}>{value}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* What It Does */}
        <section style={{ background: "var(--surface)", padding: "80px 60px", borderTop: "1px solid rgba(255,255,255,0.04)" }} className="product-section">
          <div style={{ maxWidth: 760 }}>
            <div style={{ fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--accent)", marginBottom: 16, display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ color: "var(--muted)" }}>{"//"}</span> What It Does
            </div>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(24px, 3vw, 40px)", fontWeight: 800, letterSpacing: -1, marginBottom: 32 }}>
              Your 24/7 sales development rep — minus the salary.
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {paragraphs.map((p, i) => (
                <p key={i} style={{ color: "var(--muted)", fontSize: 15, lineHeight: 1.9 }}>{p}</p>
              ))}
            </div>
          </div>
        </section>

        {/* Key Features */}
        {features.length > 0 && (
          <section style={{ padding: "80px 60px", borderTop: "1px solid rgba(255,255,255,0.04)" }} className="product-section">
            <div style={{ fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--accent)", marginBottom: 16, display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ color: "var(--muted)" }}>{"//"}</span> Key Features
            </div>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(24px, 3vw, 40px)", fontWeight: 800, letterSpacing: -1, marginBottom: 48 }}>
              Everything in the box.
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2px" }} className="features-grid">
              {features.map((f, i) => (
                <div key={i} style={{ background: "var(--surface)", padding: "24px 28px", display: "flex", alignItems: "flex-start", gap: 16 }}>
                  <span style={{ color: "var(--accent)", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18, lineHeight: 1.2, flexShrink: 0 }}>—</span>
                  <span style={{ color: "var(--white)", fontSize: 14, lineHeight: 1.7 }}>{f}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* How It Works */}
        <section style={{ background: "var(--surface)", padding: "80px 60px", borderTop: "1px solid rgba(255,255,255,0.04)" }} className="product-section">
          <div style={{ fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--accent)", marginBottom: 16, display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ color: "var(--muted)" }}>{"//"}</span> How It Works
          </div>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(24px, 3vw, 40px)", fontWeight: 800, letterSpacing: -1, marginBottom: 48 }}>
            Live in three steps.
          </h2>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {howItWorks.map((item, i) => (
              <div
                key={item.step}
                style={{
                  display: "grid", gridTemplateColumns: "80px 1fr", gap: 32,
                  padding: "36px 0", alignItems: "start",
                  borderBottom: i < howItWorks.length - 1 ? "1px solid rgba(255,255,255,0.06)" : "none",
                }}
              >
                <span style={{ fontFamily: "var(--font-display)", fontSize: 40, fontWeight: 800, color: "rgba(0,245,212,0.15)", lineHeight: 1 }}>{item.step}</span>
                <div>
                  <h3 style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 700, letterSpacing: -0.5, marginBottom: 12 }}>{item.title}</h3>
                  <p style={{ color: "var(--muted)", fontSize: 14, lineHeight: 1.9 }}>{item.body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* What's Included */}
        <section style={{ padding: "80px 60px", borderTop: "1px solid rgba(255,255,255,0.04)" }} className="product-section">
          <div style={{ maxWidth: 760 }}>
            <div style={{ fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--accent)", marginBottom: 16, display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ color: "var(--muted)" }}>{"//"}</span> What&apos;s Included
            </div>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(24px, 3vw, 40px)", fontWeight: 800, letterSpacing: -1, marginBottom: 40 }}>
              No hidden extras.
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2px" }} className="included-grid">
              {whatsIncluded.map((item, i) => (
                <div key={i} style={{ background: "var(--surface)", padding: "20px 24px", display: "flex", alignItems: "flex-start", gap: 12 }}>
                  <span style={{ color: "var(--accent)", fontWeight: 700, flexShrink: 0, fontSize: 16 }}>✓</span>
                  <span style={{ color: "var(--white)", fontSize: 13, lineHeight: 1.7 }}>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <AutomationCTA automationName={automation.name} variant="section" />
      </main>
      <Footer />

      <style>{`
        .back-link:hover { color: var(--white) !important; }
        @media (max-width: 900px) {
          .product-section { padding: 60px 24px !important; }
          .hero-grid { grid-template-columns: 1fr !important; gap: 48px !important; }
          .features-grid { grid-template-columns: 1fr !important; }
          .included-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  );
}
