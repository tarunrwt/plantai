"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Leaf, ChevronRight, Sprout, MapPin, Bell } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const CROP_TYPES = ["Tomato", "Corn", "Wheat", "Rice", "Potato", "Pepper", "Grape", "Apple", "Cotton", "Soybean"];

const steps = [
  { id: 1, title: "What's your role?", subtitle: "We'll personalize your experience" },
  { id: 2, title: "What crops do you grow?", subtitle: "Select all that apply" },
  { id: 3, title: "Almost done!", subtitle: "Set your notification preferences" },
];

export default function WelcomePage() {
  const router = useRouter();
  const supabase = createClient();
  const [step, setStep] = useState(1);
  const [role, setRole] = useState("");
  const [crops, setCrops] = useState<string[]>([]);
  const [region, setRegion] = useState("");
  const [notifyEmail, setNotifyEmail] = useState(true);
  const [notifyPush, setNotifyPush] = useState(false);
  const [loading, setLoading] = useState(false);

  const toggleCrop = (crop: string) => {
    setCrops(prev => prev.includes(crop) ? prev.filter(c => c !== crop) : [...prev, crop]);
  };

  const handleFinish = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await (supabase as any).from("profiles").upsert({
        id: user.id,
        crop_types: crops,
        region,
        onboarding_complete: true,
      });
    }
    router.push("/app/analyze");
  };

  const handleSkip = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await (supabase as any).from("profiles").upsert({ id: user.id, onboarding_complete: true });
    }
    router.push("/app/analyze");
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "1.5rem", background: "var(--color-bg)" }}>
      <div style={{ width: "100%", maxWidth: 500 }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div style={{ width: 56, height: 56, background: "var(--color-primary)", borderRadius: "14px", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem" }}>
            <Leaf size={28} color="#fff" />
          </div>
          <h1 style={{ fontSize: "1.625rem", fontWeight: 700 }}>Welcome to PlantAI</h1>
          <p style={{ color: "var(--color-muted)", marginTop: "0.375rem", fontSize: "0.9375rem" }}>Let's personalize your experience in 3 quick steps</p>
        </div>

        {/* Step indicator */}
        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.75rem", justifyContent: "center" }}>
          {steps.map(s => (
            <div key={s.id} style={{
              height: 4, width: 48, borderRadius: 2,
              background: step >= s.id ? "var(--color-accent)" : "var(--color-border)",
              transition: "background 0.3s ease",
            }} />
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
          >
            <div className="card" style={{ padding: "1.75rem" }}>
              <h2 style={{ fontSize: "1.125rem", fontWeight: 600, marginBottom: "0.375rem" }}>{steps[step - 1].title}</h2>
              <p style={{ color: "var(--color-muted)", fontSize: "0.875rem", marginBottom: "1.5rem" }}>{steps[step - 1].subtitle}</p>

              {step === 1 && (
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  {[
                    { id: "farmer", label: "🌾 Farmer", desc: "I grow crops and need disease help" },
                    { id: "agronomist", label: "🔬 Agronomist", desc: "I advise farmers on crop health" },
                    { id: "researcher", label: "📊 Researcher", desc: "I study plant diseases" },
                    { id: "other", label: "👤 Other", desc: "Other use case" },
                  ].map(r => (
                    <button key={r.id} onClick={() => setRole(r.id)} style={{
                      display: "flex", alignItems: "center", gap: "1rem",
                      padding: "0.875rem 1rem", borderRadius: "var(--radius-sm)",
                      background: role === r.id ? "rgba(82,183,136,0.1)" : "var(--color-surface-2)",
                      border: `1px solid ${role === r.id ? "rgba(82,183,136,0.4)" : "var(--color-border)"}`,
                      cursor: "pointer", textAlign: "left", transition: "all 0.15s ease",
                    }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 500, fontSize: "0.9375rem", color: "var(--color-text)" }}>{r.label}</div>
                        <div style={{ fontSize: "0.8125rem", color: "var(--color-muted)", marginTop: "0.125rem" }}>{r.desc}</div>
                      </div>
                      {role === r.id && <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--color-accent)" }} />}
                    </button>
                  ))}
                </div>
              )}

              {step === 2 && (
                <div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.625rem", marginBottom: "1.25rem" }}>
                    {CROP_TYPES.map(crop => (
                      <button key={crop} onClick={() => toggleCrop(crop)} style={{
                        padding: "0.625rem 0.875rem", borderRadius: "var(--radius-sm)",
                        background: crops.includes(crop) ? "rgba(82,183,136,0.15)" : "var(--color-surface-2)",
                        border: `1px solid ${crops.includes(crop) ? "rgba(82,183,136,0.4)" : "var(--color-border)"}`,
                        color: crops.includes(crop) ? "var(--color-accent)" : "var(--color-text)",
                        cursor: "pointer", fontSize: "0.875rem", fontWeight: crops.includes(crop) ? 600 : 400,
                        display: "flex", alignItems: "center", gap: "0.5rem", transition: "all 0.15s ease",
                        minHeight: 44,
                      }}>
                        {crops.includes(crop) && <Sprout size={14} />}
                        {crop}
                      </button>
                    ))}
                  </div>
                  <div>
                    <label className="label">Your region (optional)</label>
                    <div style={{ position: "relative" }}>
                      <MapPin size={16} style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)", color: "var(--color-muted)" }} />
                      <input className="input" placeholder="e.g. Maharashtra, India" value={region} onChange={e => setRegion(e.target.value)} style={{ paddingLeft: "2.25rem" }} />
                    </div>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  {[
                    { id: "email", label: "📧 Email notifications", desc: "Receive scan summaries and tips via email", value: notifyEmail, set: setNotifyEmail },
                    { id: "push", label: "🔔 Push notifications", desc: "Get instant alerts when a scan completes", value: notifyPush, set: setNotifyPush },
                  ].map(n => (
                    <div key={n.id} style={{
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      padding: "1rem", borderRadius: "var(--radius-sm)",
                      background: "var(--color-surface-2)", border: "1px solid var(--color-border)",
                    }}>
                      <div>
                        <div style={{ fontWeight: 500, fontSize: "0.9375rem" }}>{n.label}</div>
                        <div style={{ fontSize: "0.8125rem", color: "var(--color-muted)", marginTop: "0.125rem" }}>{n.desc}</div>
                      </div>
                      <button onClick={() => n.set(!n.value)} style={{
                        width: 44, height: 24, borderRadius: 12,
                        background: n.value ? "var(--color-accent)" : "var(--color-border-light)",
                        border: "none", cursor: "pointer", position: "relative", transition: "background 0.2s ease", flexShrink: 0,
                      }}>
                        <div style={{
                          position: "absolute", top: 3, left: n.value ? "calc(100% - 18px)" : 3,
                          width: 18, height: 18, background: "#fff", borderRadius: "50%",
                          transition: "left 0.2s ease", boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
                        }} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Actions */}
        <div style={{ display: "flex", gap: "0.75rem", marginTop: "1.25rem" }}>
          <button onClick={handleSkip} className="btn-secondary" style={{ flex: 1 }}>Skip for now</button>
          {step < 3 ? (
            <button onClick={() => setStep(s => s + 1)} className="btn-primary" style={{ flex: 2 }} disabled={step === 1 && !role}>
              Continue <ChevronRight size={16} />
            </button>
          ) : (
            <button onClick={handleFinish} className="btn-primary" style={{ flex: 2 }} disabled={loading}>
              {loading ? <span className="spinner" style={{ width: 18, height: 18 }} /> : null}
              {loading ? "Saving…" : "Start Analyzing 🌿"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
