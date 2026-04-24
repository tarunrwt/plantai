import Link from "next/link";
import type { Metadata } from "next";
import { Leaf, Zap, BarChart3, Shield, Clock, Users, CheckCircle, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "PlantAI — AI Plant Disease Detection for Farmers",
  description: "Instantly detect plant diseases with AI. Upload a leaf photo, get diagnosis with confidence score, severity rating, and actionable treatment steps. Free to start.",
};

const features = [
  { icon: Zap, title: "Instant AI Diagnosis", desc: "Get results in under 5 seconds. Our model recognizes 38 plant disease classes trained on the PlantVillage dataset." },
  { icon: Shield, title: "Severity Rating", desc: "Every scan is rated Low, Medium, High, or Critical so you know exactly how urgent treatment is." },
  { icon: BarChart3, title: "Scan History & Trends", desc: "Track disease outbreaks across time with charts. See which crops are most affected in your region." },
  { icon: Clock, title: "Treatment Steps", desc: "Actionable, step-by-step treatment guidance specific to each detected disease — no guesswork." },
  { icon: Users, title: "Team Collaboration", desc: "Share scan reports with agronomists and team members via secure links or PDF export." },
  { icon: Leaf, title: "Mobile First", desc: "Capture leaf photos directly from your phone. Designed for the field, not just the office." },
];

const tiers = [
  { name: "Free", price: "$0", period: "/month", color: "#7a9488", features: ["10 scans / month", "Basic history (7 days)", "AI diagnosis", "Treatment steps"], cta: "Get Started Free", href: "/signup" },
  { name: "Pro", price: "$9", period: "/month", color: "#52b788", popular: true, features: ["Unlimited scans", "Full scan history", "PDF export", "Share links", "Priority support"], cta: "Start Pro Trial", href: "/signup" },
  { name: "Team", price: "$29", period: "/month", color: "#9b1dff", features: ["Everything in Pro", "Multi-user access", "Batch upload", "CSV export", "API access", "Team dashboard"], cta: "Start Team Trial", href: "/signup" },
];

const testimonials = [
  { name: "Ravi Kumar", role: "Wheat Farmer, Punjab", text: "I identified early blight on my tomatoes before it spread. Saved me at least ₹40,000 this season." },
  { name: "Dr. Kavitha Rao", role: "Agronomist, Karnataka", text: "I use PlantAI to quickly pre-screen before field visits. Cuts my diagnosis time by 60%." },
  { name: "James Osei", role: "Cocoa Farmer, Ghana", text: "The treatment steps are practical and local. I trust the recommendations and they work." },
];

export default function LandingPage() {
  return (
    <div style={{ background: "var(--color-bg)", minHeight: "100vh" }}>
      {/* Nav */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 50,
        borderBottom: "1px solid var(--color-border)",
        background: "rgba(8,13,10,0.85)", backdropFilter: "blur(12px)",
        padding: "0 1.5rem",
      }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 60 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
            <div style={{ width: 32, height: 32, background: "var(--color-primary)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Leaf size={18} color="#fff" />
            </div>
            <span style={{ fontWeight: 700, fontSize: "1.0625rem" }}>PlantAI</span>
          </div>
          <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
            <Link href="/login" className="btn-ghost" style={{ minHeight: 36, padding: "0.5rem 0.875rem", fontSize: "0.875rem" }}>Sign in</Link>
            <Link href="/signup" className="btn-primary" style={{ minHeight: 36, padding: "0.5rem 1rem", fontSize: "0.875rem" }}>Get Started Free</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "5rem 1.5rem 4rem", textAlign: "center" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.375rem 0.875rem", borderRadius: 999, background: "rgba(82,183,136,0.1)", border: "1px solid rgba(82,183,136,0.25)", marginBottom: "1.75rem", fontSize: "0.8125rem", color: "var(--color-accent)", fontWeight: 500 }}>
          <Zap size={13} /> Powered by HuggingFace AI · 38 Disease Classes
        </div>
        <h1 style={{ fontSize: "clamp(2rem, 5vw, 3.25rem)", fontWeight: 800, lineHeight: 1.15, marginBottom: "1.25rem", maxWidth: 720, margin: "0 auto 1.25rem" }}>
          Detect Plant Diseases <span className="gradient-text">Before They Spread</span>
        </h1>
        <p style={{ fontSize: "1.0625rem", color: "var(--color-muted)", maxWidth: 540, margin: "0 auto 2.5rem", lineHeight: 1.7 }}>
          Upload a leaf photo. Get an AI diagnosis with confidence score, severity rating, and treatment steps — in seconds. Built for farmers and agronomists.
        </p>
        <div style={{ display: "flex", gap: "0.875rem", justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/signup" className="btn-primary" style={{ fontSize: "1rem", padding: "0.75rem 1.75rem" }}>
            Try Free — No Credit Card <ArrowRight size={18} />
          </Link>
          <Link href="/login" className="btn-secondary" style={{ fontSize: "1rem", padding: "0.75rem 1.5rem" }}>
            Sign In
          </Link>
        </div>
        <div style={{ marginTop: "1.25rem", fontSize: "0.8125rem", color: "var(--color-muted)" }}>
          ✓ 10 free scans/month  ✓ No credit card  ✓ Mobile ready
        </div>

        {/* Hero visual */}
        <div style={{ marginTop: "3.5rem", position: "relative", maxWidth: 760, margin: "3.5rem auto 0" }}>
          <div style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-lg)", padding: "1.5rem", boxShadow: "0 24px 80px rgba(0,0,0,0.5)" }}>
            <div style={{ display: "flex", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
              <div style={{ width: 100, height: 100, background: "linear-gradient(135deg, #2d6a4f, #52b788)", borderRadius: "var(--radius)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2.5rem", flexShrink: 0 }}>🍅</div>
              <div style={{ flex: 1, minWidth: 200 }}>
                <div style={{ display: "flex", gap: "0.625rem", alignItems: "center", marginBottom: "0.75rem" }}>
                  <span className="badge badge-high">high severity</span>
                  <span style={{ fontSize: "0.75rem", color: "var(--color-muted)" }}>just now</span>
                </div>
                <h3 style={{ fontWeight: 700, fontSize: "1.0625rem", marginBottom: "0.75rem" }}>Tomato Late Blight</h3>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8125rem", color: "var(--color-muted)", marginBottom: "0.375rem" }}>
                  <span>Confidence</span><span style={{ fontWeight: 600, color: "var(--color-text)" }}>94%</span>
                </div>
                <div style={{ height: 8, background: "var(--color-border)", borderRadius: 4, overflow: "hidden" }}>
                  <div style={{ width: "94%", height: "100%", background: "linear-gradient(90deg, var(--color-primary), var(--color-accent))", borderRadius: 4 }} />
                </div>
              </div>
            </div>
            <div style={{ marginTop: "1rem", padding: "0.875rem", background: "var(--color-surface-2)", borderRadius: "var(--radius-sm)", fontSize: "0.875rem", color: "var(--color-muted)" }}>
              <strong style={{ color: "var(--color-text)" }}>Step 1:</strong> Remove and destroy all infected plant parts immediately to prevent spread…
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "4rem 1.5rem" }}>
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <h2 style={{ fontSize: "clamp(1.5rem, 3vw, 2.25rem)", fontWeight: 700, marginBottom: "0.75rem" }}>Everything you need to protect your crops</h2>
          <p style={{ color: "var(--color-muted)", fontSize: "1rem" }}>Built specifically for farmers and agronomists working in the field</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1rem" }}>
          {features.map((f, i) => (
            <div key={f.title} className="card" style={{ padding: "1.5rem" }}>
              <div style={{ width: 44, height: 44, background: "rgba(82,183,136,0.1)", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1rem" }}>
                <f.icon size={22} color="var(--color-accent)" />
              </div>
              <h3 style={{ fontWeight: 600, marginBottom: "0.5rem" }}>{f.title}</h3>
              <p style={{ color: "var(--color-muted)", fontSize: "0.9rem", lineHeight: 1.6 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "3rem 1.5rem" }}>
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <h2 style={{ fontSize: "clamp(1.375rem, 3vw, 2rem)", fontWeight: 700 }}>Trusted by farmers across 30+ countries</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1rem" }}>
          {testimonials.map((t) => (
            <div key={t.name} className="card" style={{ padding: "1.5rem" }}>
              <p style={{ color: "var(--color-text)", fontSize: "0.9375rem", lineHeight: 1.65, marginBottom: "1.25rem" }}>&ldquo;{t.text}&rdquo;</p>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <div style={{ width: 36, height: 36, background: "var(--color-primary)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1rem" }}>
                  {t.name[0]}
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: "0.875rem" }}>{t.name}</div>
                  <div style={{ fontSize: "0.75rem", color: "var(--color-muted)" }}>{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" style={{ maxWidth: 1100, margin: "0 auto", padding: "4rem 1.5rem" }}>
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <h2 style={{ fontSize: "clamp(1.5rem, 3vw, 2.25rem)", fontWeight: 700, marginBottom: "0.75rem" }}>Simple, transparent pricing</h2>
          <p style={{ color: "var(--color-muted)" }}>Start free. Upgrade when you need more.</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1rem", alignItems: "start" }}>
          {tiers.map((tier) => (
            <div key={tier.name} className="card" style={{
              padding: "1.75rem", position: "relative",
              border: tier.popular ? "1px solid rgba(82,183,136,0.4)" : "1px solid var(--color-border)",
              boxShadow: tier.popular ? "0 0 30px rgba(82,183,136,0.1)" : "none",
            }}>
              {tier.popular && (
                <div style={{ position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)", background: "var(--color-accent)", color: "#fff", fontSize: "0.75rem", fontWeight: 700, padding: "0.25rem 0.875rem", borderRadius: 999, whiteSpace: "nowrap" }}>
                  MOST POPULAR
                </div>
              )}
              <div style={{ marginBottom: "1.25rem" }}>
                <div style={{ fontSize: "0.875rem", fontWeight: 600, color: tier.color, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.5rem" }}>{tier.name}</div>
                <div style={{ display: "flex", alignItems: "baseline", gap: "0.25rem" }}>
                  <span style={{ fontSize: "2.25rem", fontWeight: 800 }}>{tier.price}</span>
                  <span style={{ color: "var(--color-muted)", fontSize: "0.875rem" }}>{tier.period}</span>
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem", marginBottom: "1.75rem" }}>
                {tier.features.map(f => (
                  <div key={f} style={{ display: "flex", alignItems: "center", gap: "0.625rem", fontSize: "0.9rem" }}>
                    <CheckCircle size={16} color={tier.color} />
                    {f}
                  </div>
                ))}
              </div>
              <Link href={tier.href} className={tier.popular ? "btn-primary" : "btn-secondary"} style={{ width: "100%", display: "flex", justifyContent: "center" }}>
                {tier.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: "1px solid var(--color-border)", padding: "2rem 1.5rem", textAlign: "center" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", marginBottom: "1rem" }}>
          <Leaf size={16} color="var(--color-accent)" />
          <span style={{ fontWeight: 700 }}>PlantAI</span>
        </div>
        <div style={{ display: "flex", gap: "1.5rem", justifyContent: "center", flexWrap: "wrap", marginBottom: "1rem" }}>
          {["Privacy Policy", "Terms of Service", "Contact"].map(link => (
            <a key={link} href="#" style={{ fontSize: "0.8125rem", color: "var(--color-muted)", textDecoration: "none" }}>{link}</a>
          ))}
        </div>
        <div style={{ fontSize: "0.8125rem", color: "var(--color-muted)" }}>© {new Date().getFullYear()} PlantAI. All rights reserved.</div>
      </footer>
    </div>
  );
}
