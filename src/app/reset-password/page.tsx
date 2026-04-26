"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Leaf, Lock, Eye, EyeOff, CheckCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function ResetPasswordPage() {
  const router = useRouter();
  const supabase = createClient();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [sessionReady, setSessionReady] = useState(false);

  // Supabase injects the recovery token via URL hash — listen for it
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event: string) => {
        if (event === "PASSWORD_RECOVERY") {
          setSessionReady(true);
        }
      }
    );
    // Also check if already in recovery session
    supabase.auth.getSession().then(({ data }: any) => {
      if (data?.session) setSessionReady(true);
    });
    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setLoading(true);
    setError("");

    const { error: updateError } = await supabase.auth.updateUser({
      password,
    });

    if (updateError) {
      setError(updateError.message);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
    setTimeout(() => router.push("/app/dashboard"), 2000);
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem", background: "var(--color-bg)" }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={{ width: "100%", maxWidth: "420px" }}
      >
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", textDecoration: "none" }}>
            <div style={{ width: 40, height: 40, background: "var(--color-primary)", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Leaf size={22} color="#fff" />
            </div>
            <span style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--color-text)" }}>PlantAI</span>
          </Link>
          <h1 style={{ marginTop: "1.25rem", fontSize: "1.5rem", fontWeight: 700, color: "var(--color-text)" }}>
            {success ? "Password updated!" : "Set new password"}
          </h1>
          <p style={{ marginTop: "0.375rem", color: "var(--color-muted)", fontSize: "0.875rem" }}>
            {success ? "Redirecting you to dashboard…" : "Enter your new password below"}
          </p>
        </div>

        <div className="card" style={{ padding: "1.75rem" }}>
          {success ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{ textAlign: "center", padding: "1rem 0" }}
            >
              <CheckCircle size={48} style={{ color: "var(--color-primary)", marginBottom: "1rem" }} />
              <p style={{ color: "var(--color-text)", fontWeight: 600 }}>Password updated successfully</p>
              <p style={{ color: "var(--color-muted)", fontSize: "0.8125rem", marginTop: "0.5rem" }}>
                Redirecting to dashboard...
              </p>
            </motion.div>
          ) : !sessionReady ? (
            <div style={{ textAlign: "center", padding: "1.5rem 0" }}>
              <span className="spinner" style={{ width: 24, height: 24, margin: "0 auto 1rem" }} />
              <p style={{ color: "var(--color-muted)", fontSize: "0.875rem" }}>Verifying reset link…</p>
              <p style={{ color: "var(--color-muted)", fontSize: "0.75rem", marginTop: "0.75rem" }}>
                If this takes too long, your link may have expired.{" "}
                <Link href="/forgot-password" style={{ color: "var(--color-accent)", textDecoration: "none" }}>Request a new one</Link>
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <label className="label">New Password</label>
                <div style={{ position: "relative" }}>
                  <Lock size={16} style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)", color: "var(--color-muted)" }} />
                  <input
                    className="input"
                    type={showPassword ? "text" : "password"}
                    placeholder="Min 8 characters"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    minLength={8}
                    autoFocus
                    style={{ paddingLeft: "2.25rem", paddingRight: "2.75rem" }}
                  />
                  <button type="button" onClick={() => setShowPassword(v => !v)} className="btn-ghost" style={{ position: "absolute", right: "0.25rem", top: "50%", transform: "translateY(-50%)", minHeight: "unset", padding: "0.375rem" }}>
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="label">Confirm Password</label>
                <div style={{ position: "relative" }}>
                  <Lock size={16} style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)", color: "var(--color-muted)" }} />
                  <input
                    className="input"
                    type={showPassword ? "text" : "password"}
                    placeholder="Repeat password"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    required
                    minLength={8}
                    style={{ paddingLeft: "2.25rem" }}
                  />
                </div>
              </div>

              {error && (
                <div style={{ padding: "0.625rem 0.875rem", background: "rgba(230,57,70,0.1)", border: "1px solid rgba(230,57,70,0.25)", borderRadius: "var(--radius-sm)", color: "#e63946", fontSize: "0.8125rem" }}>
                  {error}
                </div>
              )}

              <button type="submit" className="btn-primary" disabled={loading} style={{ width: "100%" }}>
                {loading ? <span className="spinner" style={{ width: 18, height: 18 }} /> : null}
                {loading ? "Updating…" : "Update Password"}
              </button>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
}
