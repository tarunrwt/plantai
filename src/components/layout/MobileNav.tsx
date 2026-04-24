"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Microscope, LayoutDashboard, History, User, Settings } from "lucide-react";

const navItems = [
  { href: "/app/analyze", icon: Microscope, label: "Analyze" },
  { href: "/app/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/app/history", icon: History, label: "History" },
  { href: "/app/profile", icon: User, label: "Profile" },
  { href: "/app/settings", icon: Settings, label: "Settings" },
];

export default function MobileNav() {
  const pathname = usePathname();

  return (
    <nav style={{
      position: "fixed", bottom: 0, left: 0, right: 0,
      background: "var(--color-surface)",
      borderTop: "1px solid var(--color-border)",
      display: "flex", zIndex: 50,
      paddingBottom: "env(safe-area-inset-bottom)",
    }}>
      {navItems.map(({ href, icon: Icon, label }) => {
        const active = pathname === href || pathname.startsWith(href + "/");
        return (
          <Link key={href} href={href} style={{
            flex: 1, display: "flex", flexDirection: "column", alignItems: "center",
            justifyContent: "center", gap: "0.25rem", padding: "0.625rem 0",
            textDecoration: "none", minHeight: 56,
            color: active ? "var(--color-accent)" : "var(--color-muted)",
            transition: "color 0.15s ease",
            position: "relative",
          }}>
            {active && (
              <div style={{
                position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)",
                width: 32, height: 2, background: "var(--color-accent)",
                borderRadius: "0 0 2px 2px",
              }} />
            )}
            <Icon size={20} />
            <span style={{ fontSize: "0.6875rem", fontWeight: active ? 600 : 400 }}>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
