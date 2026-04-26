"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Leaf, Mail, ArrowLeft, CheckCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function ForgotPasswordPage() {
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (resetError) {
      setError(resetError.message);
      setLoading(false);
      return;
    }

    setSent(true);
    setLoading(false);
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem", background: "var(--color-bg)" }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={{ width: "100%", maxWidth: "420px" }}
      >
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", textDecoration: "none" }}>
            <div style={{ width: 40, height: 40, background: "var(--color-primary)", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Leaf size={22} color="#fff" />
            </div>
            <span style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--color-text)" }}>PlantAI</span>
          </Link>
          <h1 style={{ marginTop: "1.25rem", fontSize: "1.5rem", fontWeight: 700, color: "var(--color-text)" }}>Reset your password</h1>
          <p style={{ marginTop: "0.375rem", color: "var(--color-muted)", fontSize: "0.875rem" }}>
            {sent ? "Check your inbox for the reset link" : "Enter your email to receive a reset link"}
          </p>
        </div>

        <div className="card" style={{ padding: "1.75rem" }}>
          {sent ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{ textAlign: "center", padding: "1rem 0" }}
            >
              <CheckCircle size={48} style={{ color: "var(--color-primary)", marginBottom: "1rem" }} />
              <p style={{ color: "var(--color-text)", fontWeight: 600, fontSize: "1rem", marginBottom: "0.5rem" }}>
                Email sent!
              </p>
              <p style={{ color: "var(--color-muted)", fontSize: "0.8125rem", lineHeight: 1.5 }}>
                We sent a password reset link to <strong style={{ color: "var(--color-text)" }}>{email}</strong>.
                Check your inbox and spam folder.
              </p>
              <button
                onClick={() => { setSent(false); setEmail(""); }}
                className="btn-secondary"
                style={{ marginTop: "1.25rem", width: "100%" }}
              >
                Send another link
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <label className="label">Email address</label>
                <div style={{ position: "relative" }}>
                  <Mail size={16} style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)", color: "var(--color-muted)" }} />
                  <input
                    id="forgot-email"
                    className="input"
                    type="email"
                    placeholder="you@farm.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    autoFocus
                    style={{ paddingLeft: "2.25rem" }}
                  />
                </div>
              </div>

              {error && (
                <div style={{ padding: "0.625rem 0.875rem", background: "rgba(230,57,70,0.1)", border: "1px solid rgba(230,57,70,0.25)", borderRadius: "var(--radius-sm)", color: "#e63946", fontSize: "0.8125rem" }}>
                  {error}
                </div>
              )}

              <button id="forgot-submit" type="submit" className="btn-primary" disabled={loading} style={{ width: "100%" }}>
                {loading ? <span className="spinner" style={{ width: 18, height: 18 }} /> : null}
                {loading ? "Sending…" : "Send Reset Link"}
              </button>
            </form>
          )}
        </div>

        <p style={{ textAlign: "center", marginTop: "1.25rem" }}>
          <Link href="/login" style={{ color: "var(--color-muted)", textDecoration: "none", fontSize: "0.875rem", display: "inline-flex", alignItems: "center", gap: "0.375rem" }}>
            <ArrowLeft size={14} /> Back to sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
