"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Leaf, Microscope, LayoutDashboard, History, User, Settings, LogOut, ChevronRight } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

const navItems = [
  { href: "/app/analyze", icon: Microscope, label: "Analyze" },
  { href: "/app/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/app/history", icon: History, label: "History" },
  { href: "/app/profile", icon: User, label: "Profile" },
  { href: "/app/settings", icon: Settings, label: "Settings" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <aside style={{
      position: "fixed", left: 0, top: 0, bottom: 0,
      width: 240, background: "var(--color-surface)",
      borderRight: "1px solid var(--color-border)",
      display: "flex", flexDirection: "column", zIndex: 50,
    }}>
      {/* Logo */}
      <div style={{ padding: "1.25rem 1.25rem 1rem", borderBottom: "1px solid var(--color-border)" }}>
        <Link href="/app/dashboard" style={{ display: "flex", alignItems: "center", gap: "0.625rem", textDecoration: "none" }}>
          <div style={{ width: 36, height: 36, background: "var(--color-primary)", borderRadius: "9px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Leaf size={20} color="#fff" />
          </div>
          <span style={{ fontWeight: 700, fontSize: "1.0625rem", color: "var(--color-text)" }}>PlantAI</span>
        </Link>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "0.75rem 0.75rem", display: "flex", flexDirection: "column", gap: "0.25rem" }}>
        {navItems.map(({ href, icon: Icon, label }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link key={href} href={href} style={{ textDecoration: "none", position: "relative" }}>
              {active && (
                <motion.div
                  layoutId="sidebar-active"
                  style={{ position: "absolute", inset: 0, background: "rgba(82,183,136,0.1)", borderRadius: "var(--radius-sm)", border: "1px solid rgba(82,183,136,0.2)" }}
                  transition={{ type: "spring", stiffness: 400, damping: 35 }}
                />
              )}
              <div style={{
                display: "flex", alignItems: "center", gap: "0.75rem",
                padding: "0.625rem 0.875rem", borderRadius: "var(--radius-sm)",
                color: active ? "var(--color-accent)" : "var(--color-muted)",
                fontSize: "0.875rem", fontWeight: active ? 600 : 400,
                transition: "color 0.15s ease",
                position: "relative", minHeight: 44,
              }}>
                <Icon size={18} />
                <span>{label}</span>
                {active && <ChevronRight size={14} style={{ marginLeft: "auto" }} />}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div style={{ padding: "0.75rem", borderTop: "1px solid var(--color-border)" }}>
        <button onClick={handleLogout} className="btn-ghost" style={{ width: "100%", justifyContent: "flex-start", gap: "0.75rem", color: "var(--color-muted)", fontSize: "0.875rem" }}>
          <LogOut size={18} />
          Sign out
        </button>
      </div>
    </aside>
  );
}
