import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Return a mock-safe client if Supabase is not configured
  if (!url || !key || !url.startsWith("http")) {
    // Create with a dummy URL so the app doesn't crash in dev
    // All auth/db calls will fail gracefully
    return createBrowserClient(
      "https://placeholder.supabase.co",
      "placeholder-key"
    );
  }

  return createBrowserClient(url, key);
}
