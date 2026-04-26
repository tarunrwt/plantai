import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  // NEXT_PUBLIC_ vars are inlined at build time by Next.js
  // If these are still placeholder values, the build happened before env vars were set
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

  if (!url || !key || url === "undefined" || key === "undefined") {
    console.warn("[PlantAI] Supabase env vars missing. Auth will not work.");
    // Use a valid-looking but non-functional URL to prevent SDK from throwing
    return createBrowserClient(
      "https://placeholder.supabase.co",
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.placeholder"
    );
  }

  return createBrowserClient(url, key);
}
