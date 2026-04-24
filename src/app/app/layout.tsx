import Sidebar from "@/components/layout/Sidebar";
import MobileNav from "@/components/layout/MobileNav";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

  // If Supabase is configured, do server-side auth check
  if (supabaseUrl && supabaseUrl.startsWith("http")) {
    const { createClient } = await import("@/lib/supabase/server");
    const { redirect } = await import("next/navigation");
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect("/login");

    const { data: profile } = await (supabase as any)
      .from("profiles")
      .select("onboarding_complete")
      .eq("id", user.id)
      .single();
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* Desktop Sidebar — hidden on mobile */}
      <div style={{ display: "none" }} className="desktop-sidebar">
        <Sidebar />
      </div>
      <style>{`
        @media (min-width: 768px) { .desktop-sidebar { display: block !important; } }
        @media (max-width: 767px) { .mobile-nav-wrapper { display: block !important; } }
      `}</style>

      {/* Main content */}
      <main className="content-area" style={{ flex: 1, padding: "1.5rem" }}>
        {children}
      </main>

      {/* Mobile Nav — hidden on desktop */}
      <div style={{ display: "none" }} className="mobile-nav-wrapper">
        <MobileNav />
      </div>
    </div>
  );
}
