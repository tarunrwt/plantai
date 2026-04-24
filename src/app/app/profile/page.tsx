"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { User, Camera, Save, MapPin, Sprout } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { Profile } from "@/types";

const CROP_TYPES = ["Tomato", "Corn", "Wheat", "Rice", "Potato", "Pepper", "Grape", "Apple", "Cotton", "Soybean"];

export default function ProfilePage() {
  const supabase = createClient();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [name, setName] = useState("");
  const [region, setRegion] = useState("");
  const [crops, setCrops] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await (supabase as any).from("profiles").select("*").eq("id", user.id).single();
      if (data) {
        setProfile(data);
        setName(data.full_name ?? "");
        setRegion(data.region ?? "");
        setCrops(data.crop_types ?? []);
      }
    })();
  }, [supabase]);

  const toggleCrop = (crop: string) => setCrops(prev => prev.includes(crop) ? prev.filter(c => c !== crop) : [...prev, crop]);

  const handleSave = async () => {
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await (supabase as any).from("profiles").update({ full_name: name, region, crop_types: crops }).eq("id", user.id);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const planBadge: Record<string, { label: string; color: string; bg: string }> = {
    free: { label: "Free", color: "#7a9488", bg: "rgba(122,148,136,0.15)" },
    pro: { label: "Pro", color: "#52b788", bg: "rgba(82,183,136,0.15)" },
    team: { label: "Team", color: "#9b1dff", bg: "rgba(155,29,255,0.15)" },
  };
  const badge = planBadge[profile?.plan ?? "free"];

  return (
    <div style={{ maxWidth: 580 }}>
      <div style={{ marginBottom: "1.75rem" }}>
        <h1 style={{ fontSize: "1.625rem", fontWeight: 700 }}>Profile</h1>
        <p style={{ color: "var(--color-muted)", marginTop: "0.25rem" }}>Manage your account information</p>
      </div>

      {/* Avatar & plan */}
      <div className="card" style={{ marginBottom: "1rem", display: "flex", alignItems: "center", gap: "1.25rem", padding: "1.25rem 1.5rem" }}>
        <div style={{ width: 64, height: 64, background: "var(--color-primary)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", flexShrink: 0 }}>
          {profile?.avatar_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={profile.avatar_url} alt="Avatar" style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }} />
          ) : (
            <User size={28} color="#fff" />
          )}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 600, fontSize: "1.0625rem" }}>{name || "Your Name"}</div>
          <div style={{ marginTop: "0.375rem" }}>
            {badge && (
              <span style={{ fontSize: "0.75rem", fontWeight: 600, padding: "0.2rem 0.625rem", borderRadius: 999, background: badge.bg, color: badge.color, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                {badge.label} Plan
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Edit form */}
      <div className="card" style={{ marginBottom: "1rem" }}>
        <h3 style={{ fontWeight: 600, marginBottom: "1.25rem" }}>Personal Info</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div>
            <label className="label">Full Name</label>
            <div style={{ position: "relative" }}>
              <User size={16} style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)", color: "var(--color-muted)" }} />
              <input id="profile-name" className="input" value={name} onChange={e => setName(e.target.value)} placeholder="Your full name" style={{ paddingLeft: "2.25rem" }} />
            </div>
          </div>
          <div>
            <label className="label">Region</label>
            <div style={{ position: "relative" }}>
              <MapPin size={16} style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)", color: "var(--color-muted)" }} />
              <input id="profile-region" className="input" value={region} onChange={e => setRegion(e.target.value)} placeholder="e.g. Maharashtra, India" style={{ paddingLeft: "2.25rem" }} />
            </div>
          </div>
        </div>
      </div>

      {/* Crop types */}
      <div className="card" style={{ marginBottom: "1.5rem" }}>
        <h3 style={{ fontWeight: 600, marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <Sprout size={18} color="var(--color-accent)" /> Crops You Grow
        </h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
          {CROP_TYPES.map(crop => (
            <button key={crop} onClick={() => toggleCrop(crop)} style={{
              padding: "0.5rem 0.875rem", borderRadius: "var(--radius-sm)",
              background: crops.includes(crop) ? "rgba(82,183,136,0.15)" : "var(--color-surface-2)",
              border: `1px solid ${crops.includes(crop) ? "rgba(82,183,136,0.4)" : "var(--color-border)"}`,
              color: crops.includes(crop) ? "var(--color-accent)" : "var(--color-text)",
              cursor: "pointer", fontSize: "0.875rem", fontWeight: crops.includes(crop) ? 600 : 400,
              transition: "all 0.15s ease", textAlign: "left", minHeight: 44,
            }}>
              {crop}
            </button>
          ))}
        </div>
      </div>

      <button id="save-profile" onClick={handleSave} className="btn-primary" disabled={saving} style={{ minWidth: 160 }}>
        {saving ? <span className="spinner" style={{ width: 18, height: 18 }} /> : <Save size={17} />}
        {saving ? "Saving…" : saved ? "✓ Saved!" : "Save Changes"}
      </button>
    </div>
  );
}
