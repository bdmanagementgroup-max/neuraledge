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

const SEED_LEAD_GEN_BOT: AutomationFull = {
  id: "seed-lgb",
  name: "Lead Generation Bot",
  slug: "lead-generation-bot",
  category: "Lead Gen",
  price_from: 250000,
  description:
    "Automatically qualify and nurture inbound leads from your website, LinkedIn, and email. Runs 24/7 so your sales team only talks to warm prospects.",
  long_description:
    "Most sales teams spend 60–70% of their time chasing leads that will never convert. The Lead Generation Bot fixes that at the source.\n\nIt connects to every channel where potential customers reach out — your website contact form, LinkedIn DMs, and inbound email — and applies a consistent qualification framework automatically. Each lead is scored against your ideal customer profile, enriched with company and role data, and either nurtured through a personalised sequence or escalated to your sales team as a warm, context-rich handoff.\n\nYour team stops chasing dead ends and starts every conversation already knowing what the prospect needs and why they reached out.",
  features: [
    "Multi-channel lead intake (website, LinkedIn, email)",
    "AI-powered ICP scoring and lead qualification",
    "Automatic lead enrichment (company, role, intent signals)",
    "Personalised nurture sequences triggered by behaviour",
    "CRM sync — leads pushed directly into HubSpot, Salesforce, or Pipedrive",
    "Warm handoff alerts with full context for your sales team",
    "Real-time dashboard showing pipeline volume and conversion rates",
    "Weekly digest email summarising lead quality and funnel health",
  ],
};

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Setup & Integration",
    body: "We connect the bot to your website forms, LinkedIn, and email inbox. Configure your ICP scoring criteria and CRM destination in a single onboarding session.",
  },
  {
    step: "02",
    title: "Capture & Score",
    body: "Every inbound lead is automatically captured, enriched with company and role data, then scored against your ICP. Below-threshold leads enter a nurture sequence; above-threshold leads trigger an immediate sales alert.",
  },
  {
    step: "03",
    title: "Nurture & Handoff",
    body: "Warm leads are handed off to your sales team with full context: company data, lead score, and conversation history — ready to close.",
  },
];

const WHATS_INCLUDED = [
  "Fully configured automation (n8n, Make, or custom stack)",
  "CRM integration (HubSpot, Salesforce, or Pipedrive)",
  "Lead scoring model calibrated to your ICP",
  "3 nurture email templates written and loaded",
  "30-day post-launch monitoring and optimisation",
];

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
  return SEED_LEAD_GEN_BOT.slug === slug ? SEED_LEAD_GEN_BOT : null;
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
            {HOW_IT_WORKS.map((item, i) => (
              <div
                key={item.step}
                style={{
                  display: "grid", gridTemplateColumns: "80px 1fr", gap: 32,
                  padding: "36px 0", alignItems: "start",
                  borderBottom: i < HOW_IT_WORKS.length - 1 ? "1px solid rgba(255,255,255,0.06)" : "none",
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
              {WHATS_INCLUDED.map((item, i) => (
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
