"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Microscope, Bug, TrendingUp, Calendar, Leaf } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { formatDate, getSeverityColor } from "@/lib/utils";
import type { Scan, Severity } from "@/types";

const SEVERITY_COLORS = { low: "#52b788", medium: "#f4a261", high: "#e63946", critical: "#9b1dff" };

export default function DashboardPage() {
  const supabase = createClient();
  const [scans, setScans] = useState<Scan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await (supabase as any)
        .from("scans")
        .select("*")
        .eq("user_id", user.id)
        .eq("status", "complete")
        .order("created_at", { ascending: false });
      setScans(data || []);
      setLoading(false);
    })();
  }, [supabase]);

  // Compute stats
  const total = scans.length;
  const uniqueDiseases = new Set(scans.map(s => s.disease_name)).size;
  const avgConf = total ? Math.round(scans.reduce((a, s) => a + (s.confidence || 0), 0) / total * 100) : 0;
  const thisMonth = scans.filter(s => new Date(s.created_at) >= new Date(new Date().setDate(1))).length;

  // Scans per day (last 14 days)
  const last14 = Array.from({ length: 14 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (13 - i));
    const label = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    const count = scans.filter(s => new Date(s.created_at).toDateString() === d.toDateString()).length;
    return { date: label, scans: count };
  });

  // Disease distribution
  const diseaseMap: Record<string, number> = {};
  scans.forEach(s => { if (s.disease_name) diseaseMap[s.disease_name] = (diseaseMap[s.disease_name] || 0) + 1; });
  const diseaseData = Object.entries(diseaseMap).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([name, value]) => ({ name: name.length > 20 ? name.slice(0, 20) + "…" : name, value }));

  // Severity breakdown
  const severityMap: Record<string, number> = { low: 0, medium: 0, high: 0, critical: 0 };
  scans.forEach(s => { if (s.severity) severityMap[s.severity]++; });
  const severityData = Object.entries(severityMap).map(([name, value]) => ({ name, value, fill: SEVERITY_COLORS[name as Severity] }));

  const statCards = [
    { label: "Total Scans", value: total, icon: Microscope, color: "#52b788" },
    { label: "Diseases Found", value: uniqueDiseases, icon: Bug, color: "#f4a261" },
    { label: "Avg Confidence", value: `${avgConf}%`, icon: TrendingUp, color: "#9b1dff" },
    { label: "This Month", value: thisMonth, icon: Calendar, color: "#52b788" },
  ];

  if (loading) {
    return (
      <div>
        <div style={{ marginBottom: "1.75rem" }}>
          <div className="skeleton" style={{ height: 28, width: 200, marginBottom: 8 }} />
          <div className="skeleton" style={{ height: 18, width: 300 }} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
          {[1,2,3,4].map(i => <div key={i} className="skeleton" style={{ height: 100, borderRadius: "var(--radius)" }} />)}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "1rem" }}>
          <div className="skeleton" style={{ height: 240, borderRadius: "var(--radius)" }} />
          <div className="skeleton" style={{ height: 240, borderRadius: "var(--radius)" }} />
        </div>
      </div>
    );
  }

  // Empty state
  if (total === 0) {
    return (
      <div>
        <div style={{ marginBottom: "1.75rem" }}>
          <h1 style={{ fontSize: "1.625rem", fontWeight: 700 }}>Dashboard</h1>
          <p style={{ color: "var(--color-muted)", marginTop: "0.25rem" }}>Your crop health overview</p>
        </div>
        <div className="card" style={{ textAlign: "center", padding: "4rem 2rem" }}>
          <div style={{ width: 72, height: 72, background: "rgba(82,183,136,0.1)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.25rem" }}>
            <Leaf size={36} color="var(--color-accent)" />
          </div>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 600, marginBottom: "0.625rem" }}>No scans yet</h2>
          <p style={{ color: "var(--color-muted)", marginBottom: "1.75rem", maxWidth: 360, margin: "0 auto 1.75rem" }}>
            Analyze your first plant to see disease trends, severity breakdowns, and confidence stats here.
          </p>
          <Link href="/app/analyze" className="btn-primary">Run Your First Scan 🌿</Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: "1.75rem" }}>
        <h1 style={{ fontSize: "1.625rem", fontWeight: 700 }}>Dashboard</h1>
        <p style={{ color: "var(--color-muted)", marginTop: "0.25rem" }}>Your crop health overview</p>
      </div>

      {/* Stat cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
        {statCards.map((card, i) => (
          <motion.div key={card.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="card" style={{ padding: "1.25rem" }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "0.875rem" }}>
              <div style={{ width: 36, height: 36, background: `${card.color}18`, borderRadius: "9px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <card.icon size={18} color={card.color} />
              </div>
            </div>
            <div style={{ fontSize: "1.75rem", fontWeight: 700, lineHeight: 1 }}>{card.value}</div>
            <div style={{ fontSize: "0.8125rem", color: "var(--color-muted)", marginTop: "0.375rem" }}>{card.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Charts row */}
      <div style={{ display: "grid", gridTemplateColumns: "minmax(0,2fr) minmax(0,1fr)", gap: "1rem", marginBottom: "1rem" }}>
        {/* Scans over time */}
        <div className="card">
          <h3 style={{ fontSize: "0.9375rem", fontWeight: 600, marginBottom: "1.25rem" }}>Scans (Last 14 Days)</h3>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={last14}>
              <XAxis dataKey="date" tick={{ fill: "#7a9488", fontSize: 11 }} tickLine={false} axisLine={false} interval={3} />
              <YAxis tick={{ fill: "#7a9488", fontSize: 11 }} tickLine={false} axisLine={false} allowDecimals={false} />
              <Tooltip contentStyle={{ background: "var(--color-surface-2)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-sm)", color: "var(--color-text)", fontSize: 13 }} />
              <Line type="monotone" dataKey="scans" stroke="#52b788" strokeWidth={2} dot={false} activeDot={{ r: 4, fill: "#52b788" }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Severity breakdown */}
        <div className="card">
          <h3 style={{ fontSize: "0.9375rem", fontWeight: 600, marginBottom: "1.25rem" }}>Severity</h3>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={severityData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                {severityData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
              </Pie>
              <Tooltip contentStyle={{ background: "var(--color-surface-2)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-sm)", color: "var(--color-text)", fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", justifyContent: "center" }}>
            {severityData.filter(d => d.value > 0).map(d => (
              <div key={d.name} style={{ display: "flex", alignItems: "center", gap: "0.3rem", fontSize: "0.75rem", color: "var(--color-muted)" }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: d.fill }} />
                {d.name}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top diseases bar chart */}
      {diseaseData.length > 0 && (
        <div className="card">
          <h3 style={{ fontSize: "0.9375rem", fontWeight: 600, marginBottom: "1.25rem" }}>Top Detected Diseases</h3>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={diseaseData} layout="vertical">
              <XAxis type="number" tick={{ fill: "#7a9488", fontSize: 11 }} tickLine={false} axisLine={false} allowDecimals={false} />
              <YAxis type="category" dataKey="name" tick={{ fill: "#eff5f1", fontSize: 12 }} tickLine={false} axisLine={false} width={160} />
              <Tooltip contentStyle={{ background: "var(--color-surface-2)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-sm)", color: "var(--color-text)", fontSize: 12 }} />
              <Bar dataKey="value" fill="#2d6a4f" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
