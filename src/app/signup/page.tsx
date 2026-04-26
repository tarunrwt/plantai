"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Eye, EyeOff, Leaf, Mail, Lock, User } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function SignupPage() {
  const router = useRouter();
  const supabase = createClient();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { error: authError } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          data: { full_name: form.name },
          emailRedirectTo: `${window.location.origin}/auth/callback?next=/app/welcome`,
        },
      });

      if (authError) {
        setError(authError.message);
        setLoading(false);
        return;
      }

      router.push("/app/welcome");
    } catch (err) {
      setError("Unable to connect to auth service. Please try again.");
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback?next=/app/welcome` },
    });
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
          <h1 style={{ marginTop: "1.25rem", fontSize: "1.5rem", fontWeight: 700, color: "var(--color-text)" }}>Create your account</h1>
          <p style={{ marginTop: "0.375rem", color: "var(--color-muted)", fontSize: "0.875rem" }}>Start detecting plant diseases in seconds</p>
        </div>

        <div className="card" style={{ padding: "1.75rem" }}>
          {/* Google OAuth */}
          <button onClick={handleGoogle} className="btn-secondary" style={{ width: "100%", marginBottom: "1.25rem" }}>
            <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            Continue with Google
          </button>

          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.25rem" }}>
            <div className="divider" style={{ flex: 1 }} />
            <span style={{ fontSize: "0.75rem", color: "var(--color-muted)" }}>or</span>
            <div className="divider" style={{ flex: 1 }} />
          </div>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div>
              <label className="label">Full Name</label>
              <div style={{ position: "relative" }}>
                <User size={16} style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)", color: "var(--color-muted)" }} />
                <input id="signup-name" className="input" type="text" placeholder="John Farmer" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required style={{ paddingLeft: "2.25rem" }} />
              </div>
            </div>
            <div>
              <label className="label">Email</label>
              <div style={{ position: "relative" }}>
                <Mail size={16} style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)", color: "var(--color-muted)" }} />
                <input id="signup-email" className="input" type="email" placeholder="you@farm.com" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required style={{ paddingLeft: "2.25rem" }} />
              </div>
            </div>
            <div>
              <label className="label">Password</label>
              <div style={{ position: "relative" }}>
                <Lock size={16} style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)", color: "var(--color-muted)" }} />
                <input id="signup-password" className="input" type={showPassword ? "text" : "password"} placeholder="Min 8 characters" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} required minLength={8} style={{ paddingLeft: "2.25rem", paddingRight: "2.75rem" }} />
                <button type="button" onClick={() => setShowPassword(v => !v)} className="btn-ghost" style={{ position: "absolute", right: "0.25rem", top: "50%", transform: "translateY(-50%)", minHeight: "unset", padding: "0.375rem" }}>
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <div style={{ padding: "0.625rem 0.875rem", background: "rgba(230,57,70,0.1)", border: "1px solid rgba(230,57,70,0.25)", borderRadius: "var(--radius-sm)", color: "#e63946", fontSize: "0.8125rem" }}>
                {error}
              </div>
            )}

            <button id="signup-submit" type="submit" className="btn-primary" disabled={loading} style={{ width: "100%", marginTop: "0.25rem" }}>
              {loading ? <span className="spinner" style={{ width: 18, height: 18 }} /> : null}
              {loading ? "Creating account…" : "Create Account"}
            </button>
          </form>
        </div>

        <p style={{ textAlign: "center", marginTop: "1.25rem", color: "var(--color-muted)", fontSize: "0.875rem" }}>
          Already have an account?{" "}
          <Link href="/login" style={{ color: "var(--color-accent)", textDecoration: "none", fontWeight: 500 }}>Sign in</Link>
        </p>
      </motion.div>
    </div>
  );
}
