"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, Download, Share2, Trash2, Eye, X, Calendar, ChevronDown, History as HistoryIcon } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { getSeverityClass, formatDateTime, formatConfidence } from "@/lib/utils";
import type { Scan, Severity } from "@/types";
import UpgradeModal from "@/components/shared/UpgradeModal";

export default function HistoryPage() {
  const supabase = createClient();
  const [scans, setScans] = useState<Scan[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [severityFilter, setSeverityFilter] = useState<string>("all");
  const [selected, setSelected] = useState<Scan | null>(null);
  const [upgradeFeature, setUpgradeFeature] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    fetchScans();
  }, []);

  const fetchScans = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data } = await (supabase as any).from("scans").select("*").eq("user_id", user.id).order("created_at", { ascending: false });
    setScans(data || []);
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    await (supabase as any).from("scans").delete().eq("id", id);
    setScans(prev => prev.filter(s => s.id !== id));
    if (selected?.id === id) setSelected(null);
    setDeleteId(null);
  };

  const handlePDF = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    const { data: profile } = await (supabase as any).from("profiles").select("plan").eq("id", user!.id).single();
    if (profile?.plan === "free") { setUpgradeFeature("PDF Export"); return; }
    alert("PDF export loading…");
  };

  const handleShare = async (scanId: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    const { data: profile } = await (supabase as any).from("profiles").select("plan").eq("id", user!.id).single();
    if (profile?.plan === "free") { setUpgradeFeature("Share Links"); return; }
    const { nanoid } = await import("nanoid");
    const token = nanoid(12);
    await (supabase as any).from("share_links").insert({ scan_id: scanId, token });
    navigator.clipboard.writeText(`${window.location.origin}/share/${token}`);
    alert("Share link copied to clipboard!");
  };

  const filtered = scans.filter(s => {
    const matchSearch = !search || s.disease_name?.toLowerCase().includes(search.toLowerCase());
    const matchSeverity = severityFilter === "all" || s.severity === severityFilter;
    return matchSearch && matchSeverity;
  });

  if (loading) {
    return (
      <div>
        <div style={{ marginBottom: "1.75rem" }}>
          <div className="skeleton" style={{ height: 28, width: 160 }} />
        </div>
        {[1,2,3,4].map(i => <div key={i} className="skeleton" style={{ height: 60, borderRadius: "var(--radius-sm)", marginBottom: 8 }} />)}
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: "1.75rem" }}>
        <h1 style={{ fontSize: "1.625rem", fontWeight: 700 }}>Scan History</h1>
        <p style={{ color: "var(--color-muted)", marginTop: "0.25rem" }}>{scans.length} scan{scans.length !== 1 ? "s" : ""} total</p>
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1.25rem", flexWrap: "wrap" }}>
        <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
          <Search size={16} style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)", color: "var(--color-muted)" }} />
          <input className="input" placeholder="Search diseases…" value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: "2.25rem" }} />
        </div>
        <select
          value={severityFilter}
          onChange={e => setSeverityFilter(e.target.value)}
          className="input"
          style={{ width: "auto", paddingRight: "2rem", cursor: "pointer", appearance: "none" }}
        >
          <option value="all">All Severity</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="critical">Critical</option>
        </select>
      </div>

      {/* Empty state */}
      {filtered.length === 0 && (
        <div className="card" style={{ textAlign: "center", padding: "3.5rem 2rem" }}>
          <HistoryIcon size={40} color="var(--color-muted)" style={{ margin: "0 auto 1rem" }} />
          <h3 style={{ fontWeight: 600, marginBottom: "0.5rem" }}>{scans.length === 0 ? "No scans yet" : "No results found"}</h3>
          <p style={{ color: "var(--color-muted)", marginBottom: "1.5rem", fontSize: "0.9rem" }}>
            {scans.length === 0 ? "Your scan history will appear here after you analyze your first plant." : "Try adjusting your search or filters."}
          </p>
          {scans.length === 0 && <Link href="/app/analyze" className="btn-primary">Analyze a Plant</Link>}
        </div>
      )}

      {/* Desktop table */}
      <div className="desktop-table" style={{ display: "none" }}>
        <style>{`@media (min-width: 640px) { .desktop-table { display: block !important; } .mobile-cards { display: none !important; } }`}</style>
        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--color-border)" }}>
                {["Date", "Disease", "Confidence", "Severity", "Status", "Actions"].map(h => (
                  <th key={h} style={{ padding: "0.75rem 1rem", textAlign: "left", fontSize: "0.75rem", fontWeight: 600, color: "var(--color-muted)", textTransform: "uppercase", letterSpacing: "0.04em" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((scan, i) => (
                <motion.tr key={scan.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
                  style={{ borderBottom: "1px solid var(--color-border)", cursor: "pointer", transition: "background 0.15s" }}
                  onMouseEnter={e => (e.currentTarget.style.background = "var(--color-surface-2)")}
                  onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                >
                  <td style={{ padding: "0.875rem 1rem", fontSize: "0.8125rem", color: "var(--color-muted)" }}>{formatDateTime(scan.created_at)}</td>
                  <td style={{ padding: "0.875rem 1rem", fontSize: "0.875rem", fontWeight: 500 }}>{scan.disease_name ?? "—"}</td>
                  <td style={{ padding: "0.875rem 1rem", fontSize: "0.875rem" }}>{scan.confidence ? formatConfidence(scan.confidence) : "—"}</td>
                  <td style={{ padding: "0.875rem 1rem" }}>
                    {scan.severity ? <span className={getSeverityClass(scan.severity as Severity)}>{scan.severity}</span> : "—"}
                  </td>
                  <td style={{ padding: "0.875rem 1rem" }}>
                    <span style={{ fontSize: "0.75rem", padding: "0.2rem 0.5rem", borderRadius: 4, background: scan.status === "complete" ? "rgba(82,183,136,0.15)" : "rgba(244,162,97,0.15)", color: scan.status === "complete" ? "#52b788" : "#f4a261" }}>
                      {scan.status}
                    </span>
                  </td>
                  <td style={{ padding: "0.875rem 1rem" }}>
                    <div style={{ display: "flex", gap: "0.375rem" }}>
                      <button onClick={() => setSelected(scan)} className="btn-ghost" style={{ minHeight: 32, minWidth: 32, padding: "0.375rem" }} title="View"><Eye size={15} /></button>
                      <button onClick={handlePDF} className="btn-ghost" style={{ minHeight: 32, minWidth: 32, padding: "0.375rem" }} title="PDF"><Download size={15} /></button>
                      <button onClick={() => handleShare(scan.id)} className="btn-ghost" style={{ minHeight: 32, minWidth: 32, padding: "0.375rem" }} title="Share"><Share2 size={15} /></button>
                      <button onClick={() => setDeleteId(scan.id)} className="btn-ghost" style={{ minHeight: 32, minWidth: 32, padding: "0.375rem", color: "var(--color-danger)" }} title="Delete"><Trash2 size={15} /></button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile card list */}
      <div className="mobile-cards" style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
        {filtered.map((scan, i) => (
          <motion.div key={scan.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="card" style={{ padding: "1rem", cursor: "pointer" }}
            onClick={() => setSelected(scan)}
          >
            <div style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: "0.9375rem", marginBottom: "0.25rem" }}>{scan.disease_name ?? "Unknown"}</div>
                <div style={{ fontSize: "0.8125rem", color: "var(--color-muted)" }}>{formatDateTime(scan.created_at)}</div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "0.375rem" }}>
                {scan.severity && <span className={getSeverityClass(scan.severity as Severity)}>{scan.severity}</span>}
                {scan.confidence && <span style={{ fontSize: "0.8125rem", color: "var(--color-muted)" }}>{formatConfidence(scan.confidence)}</span>}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Detail Drawer */}
      <AnimatePresence>
        {selected && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 100 }}
              onClick={() => setSelected(null)}
            />
            <motion.div
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 350, damping: 35 }}
              style={{
                position: "fixed", top: 0, right: 0, bottom: 0, width: "min(480px, 100vw)",
                background: "var(--color-surface)", borderLeft: "1px solid var(--color-border)",
                zIndex: 101, overflowY: "auto", padding: "1.5rem",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
                <h2 style={{ fontSize: "1.125rem", fontWeight: 700 }}>Scan Report</h2>
                <button onClick={() => setSelected(null)} className="btn-ghost" style={{ padding: "0.375rem" }}><X size={20} /></button>
              </div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={selected.image_url} alt="Scan" style={{ width: "100%", height: 200, objectFit: "cover", borderRadius: "var(--radius)", marginBottom: "1.25rem", border: "1px solid var(--color-border)" }} />
              <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1.25rem", flexWrap: "wrap" }}>
                {selected.severity && <span className={getSeverityClass(selected.severity as Severity)}>{selected.severity} severity</span>}
                <span style={{ fontSize: "0.8125rem", color: "var(--color-muted)" }}>{formatDateTime(selected.created_at)}</span>
              </div>
              <h3 style={{ fontSize: "1.125rem", fontWeight: 700, marginBottom: "0.625rem" }}>{selected.disease_name}</h3>
              <div style={{ marginBottom: "0.375rem", display: "flex", justifyContent: "space-between", fontSize: "0.8125rem", color: "var(--color-muted)" }}>
                <span>Confidence</span><span style={{ fontWeight: 600, color: "var(--color-text)" }}>{selected.confidence ? formatConfidence(selected.confidence) : "—"}</span>
              </div>
              <div style={{ height: 8, background: "var(--color-border)", borderRadius: 4, overflow: "hidden", marginBottom: "1.5rem" }}>
                <div style={{ height: "100%", width: `${(selected.confidence || 0) * 100}%`, background: "linear-gradient(90deg, var(--color-primary), var(--color-accent))", borderRadius: 4 }} />
              </div>
              <h4 style={{ fontWeight: 600, marginBottom: "0.875rem" }}>Treatment Steps</h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {(selected.treatment_steps || []).map((step, i) => (
                  <div key={i} style={{ display: "flex", gap: "0.75rem", padding: "0.75rem", background: "var(--color-surface-2)", borderRadius: "var(--radius-sm)", fontSize: "0.875rem" }}>
                    <span style={{ width: 22, height: 22, background: "var(--color-primary)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: "0.75rem", fontWeight: 700, color: "#fff" }}>{i + 1}</span>
                    {step}
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", gap: "0.625rem", marginTop: "1.5rem" }}>
                <button onClick={handlePDF} className="btn-secondary" style={{ flex: 1 }}><Download size={16} /> Export PDF</button>
                <button onClick={() => handleShare(selected.id)} className="btn-secondary" style={{ flex: 1 }}><Share2 size={16} /> Share</button>
                <button onClick={() => setDeleteId(selected.id)} className="btn-ghost" style={{ color: "var(--color-danger)" }}><Trash2 size={18} /></button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Delete confirmation */}
      <AnimatePresence>
        {deleteId && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}
          >
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              className="card" style={{ maxWidth: 360, width: "100%", textAlign: "center", padding: "1.75rem" }}
            >
              <Trash2 size={32} color="var(--color-danger)" style={{ margin: "0 auto 1rem" }} />
              <h3 style={{ fontWeight: 700, marginBottom: "0.5rem" }}>Delete this scan?</h3>
              <p style={{ color: "var(--color-muted)", fontSize: "0.875rem", marginBottom: "1.5rem" }}>This action cannot be undone.</p>
              <div style={{ display: "flex", gap: "0.75rem" }}>
                <button onClick={() => setDeleteId(null)} className="btn-secondary" style={{ flex: 1 }}>Cancel</button>
                <button onClick={() => handleDelete(deleteId)} style={{ flex: 1 }} className="btn-primary">
                  <span style={{ background: "var(--color-danger)" }}>Delete</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {upgradeFeature && <UpgradeModal feature={upgradeFeature} onClose={() => setUpgradeFeature("")} />}
    </div>
  );
}
