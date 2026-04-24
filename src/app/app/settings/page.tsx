"use client";

import { useState, useEffect } from "react";
import { CreditCard, Bell, Key, Trash2, Download } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { Profile } from "@/types";

export default function SettingsPage() {
  const supabase = createClient();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [emailNotif, setEmailNotif] = useState(true);
  const [pushNotif, setPushNotif] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await (supabase as any).from("profiles").select("*").eq("id", user.id).single();
      setProfile(data);
    })();
  }, [supabase]);

  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="card" style={{ marginBottom: "1rem" }}>
      <h3 style={{ fontWeight: 600, marginBottom: "1.25rem", fontSize: "1rem" }}>{title}</h3>
      {children}
    </div>
  );

  const Toggle = ({ value, onChange, label, desc }: { value: boolean; onChange: (v: boolean) => void; label: string; desc: string }) => (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.75rem 0", borderBottom: "1px solid var(--color-border)" }}>
      <div>
        <div style={{ fontWeight: 500, fontSize: "0.9375rem" }}>{label}</div>
        <div style={{ fontSize: "0.8125rem", color: "var(--color-muted)", marginTop: "0.125rem" }}>{desc}</div>
      </div>
      <button onClick={() => onChange(!value)} style={{
        width: 44, height: 24, borderRadius: 12, flexShrink: 0,
        background: value ? "var(--color-accent)" : "var(--color-border-light)",
        border: "none", cursor: "pointer", position: "relative", transition: "background 0.2s ease", marginLeft: "1rem",
      }}>
        <div style={{
          position: "absolute", top: 3, left: value ? "calc(100% - 18px)" : 3,
          width: 18, height: 18, background: "#fff", borderRadius: "50%",
          transition: "left 0.2s ease", boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
        }} />
      </button>
    </div>
  );

  return (
    <div style={{ maxWidth: 580 }}>
      <div style={{ marginBottom: "1.75rem" }}>
        <h1 style={{ fontSize: "1.625rem", fontWeight: 700 }}>Settings</h1>
        <p style={{ color: "var(--color-muted)", marginTop: "0.25rem" }}>Manage subscription, notifications, and account</p>
      </div>

      {/* Subscription */}
      <Section title="Subscription">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.875rem" }}>
          <div>
            <div style={{ fontWeight: 500, marginBottom: "0.25rem" }}>
              Current plan: <span style={{ color: "var(--color-accent)", textTransform: "capitalize" }}>{profile?.plan ?? "free"}</span>
            </div>
            <div style={{ fontSize: "0.8125rem", color: "var(--color-muted)" }}>
              {profile?.plan === "free" ? `${profile?.scans_this_month ?? 0} / 10 scans used this month` : "Unlimited scans"}
            </div>
          </div>
          {profile?.plan === "free" && (
            <button className="btn-primary" style={{ background: "linear-gradient(135deg, #2d6a4f, #40916c)" }}>
              <CreditCard size={16} /> Upgrade to Pro — $9/mo
            </button>
          )}
        </div>
      </Section>

      {/* Notifications */}
      <Section title="Notifications">
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem" }}>
          <Bell size={16} color="var(--color-accent)" />
          <span style={{ fontSize: "0.875rem", color: "var(--color-muted)" }}>Choose how you want to be notified</span>
        </div>
        <Toggle value={emailNotif} onChange={setEmailNotif} label="Email notifications" desc="Receive scan reports and tips via email" />
        <Toggle value={pushNotif} onChange={setPushNotif} label="Push notifications" desc="Browser alerts when your scan completes" />
      </Section>

      {/* API Key (Team only) */}
      {profile?.plan === "team" && (
        <Section title="API Access">
          <div style={{ marginBottom: "0.625rem", fontSize: "0.8125rem", color: "var(--color-muted)" }}>Your API key for programmatic access</div>
          <div style={{ display: "flex", gap: "0.625rem" }}>
            <code style={{ flex: 1, padding: "0.625rem 0.875rem", background: "var(--color-surface-2)", borderRadius: "var(--radius-sm)", fontFamily: "var(--font-mono)", fontSize: "0.8125rem", color: "var(--color-accent)", border: "1px solid var(--color-border)", wordBreak: "break-all" }}>
              pai_live_••••••••••••••••
            </code>
            <button className="btn-secondary"><Key size={16} /> Reveal</button>
          </div>
        </Section>
      )}

      {/* Danger zone */}
      <div className="card" style={{ border: "1px solid rgba(230,57,70,0.25)", background: "rgba(230,57,70,0.04)" }}>
        <h3 style={{ fontWeight: 600, marginBottom: "1rem", color: "var(--color-danger)" }}>Danger Zone</h3>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.875rem", marginBottom: "0.875rem", paddingBottom: "0.875rem", borderBottom: "1px solid rgba(230,57,70,0.15)" }}>
          <div>
            <div style={{ fontWeight: 500 }}>Export your data</div>
            <div style={{ fontSize: "0.8125rem", color: "var(--color-muted)" }}>Download all your scans as JSON (GDPR)</div>
          </div>
          <button className="btn-secondary"><Download size={16} /> Export Data</button>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.875rem" }}>
          <div>
            <div style={{ fontWeight: 500, color: "var(--color-danger)" }}>Delete account</div>
            <div style={{ fontSize: "0.8125rem", color: "var(--color-muted)" }}>Permanently remove your account and all data</div>
          </div>
          <button onClick={() => setShowDeleteConfirm(true)} style={{
            padding: "0.5rem 1rem", background: "rgba(230,57,70,0.1)", color: "var(--color-danger)",
            border: "1px solid rgba(230,57,70,0.3)", borderRadius: "var(--radius-sm)",
            cursor: "pointer", fontSize: "0.875rem", fontWeight: 500, display: "flex", alignItems: "center", gap: "0.5rem", minHeight: 44
          }}>
            <Trash2 size={16} /> Delete Account
          </button>
        </div>
      </div>

      {showDeleteConfirm && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
          <div className="card" style={{ maxWidth: 380, width: "100%", textAlign: "center", padding: "2rem" }}>
            <Trash2 size={32} color="var(--color-danger)" style={{ margin: "0 auto 1rem" }} />
            <h3 style={{ fontWeight: 700, marginBottom: "0.5rem" }}>Delete your account?</h3>
            <p style={{ color: "var(--color-muted)", fontSize: "0.875rem", marginBottom: "1.5rem" }}>All scans, history, and data will be permanently deleted. This cannot be undone.</p>
            <div style={{ display: "flex", gap: "0.75rem" }}>
              <button onClick={() => setShowDeleteConfirm(false)} className="btn-secondary" style={{ flex: 1 }}>Cancel</button>
              <button style={{ flex: 1, padding: "0.625rem 1rem", background: "var(--color-danger)", color: "#fff", border: "none", borderRadius: "var(--radius-sm)", cursor: "pointer", fontWeight: 600, minHeight: 44 }}>
                Delete Forever
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
