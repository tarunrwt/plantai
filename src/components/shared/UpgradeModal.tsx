"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Crown, X, Zap } from "lucide-react";

interface UpgradeModalProps {
  feature: string;
  onClose: () => void;
}

export default function UpgradeModal({ feature, onClose }: UpgradeModalProps) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)",
          backdropFilter: "blur(4px)", zIndex: 200,
          display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem",
        }}
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
          onClick={e => e.stopPropagation()}
          style={{
            background: "var(--color-surface)", border: "1px solid var(--color-border)",
            borderRadius: "var(--radius-lg)", padding: "2rem", maxWidth: 420, width: "100%",
            textAlign: "center", position: "relative",
          }}
        >
          <button onClick={onClose} className="btn-ghost" style={{ position: "absolute", top: "1rem", right: "1rem", minHeight: 36, padding: "0.375rem" }}>
            <X size={18} />
          </button>

          <div style={{ width: 56, height: 56, background: "linear-gradient(135deg, #f4a261, #e63946)", borderRadius: "14px", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.25rem" }}>
            <Crown size={28} color="#fff" />
          </div>

          <h2 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "0.5rem" }}>Upgrade to Pro</h2>
          <p style={{ color: "var(--color-muted)", fontSize: "0.9rem", marginBottom: "1.5rem", lineHeight: 1.6 }}>
            <strong style={{ color: "var(--color-text)" }}>{feature}</strong> is a Pro feature.
            Upgrade to get unlimited scans, PDF exports, share links, and more.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {["Unlimited scans / month", "PDF export for all reports", "Share links for reports", "Priority support"].map(f => (
              <div key={f} style={{ display: "flex", alignItems: "center", gap: "0.625rem", fontSize: "0.875rem", color: "var(--color-text)" }}>
                <Zap size={14} color="var(--color-accent)" />
                {f}
              </div>
            ))}
          </div>

          <div style={{ display: "flex", gap: "0.75rem", marginTop: "1.75rem" }}>
            <button onClick={onClose} className="btn-secondary" style={{ flex: 1 }}>Not now</button>
            <button className="btn-primary" style={{ flex: 2, background: "linear-gradient(135deg, #2d6a4f, #40916c)" }}>
              Upgrade — $9/mo
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
