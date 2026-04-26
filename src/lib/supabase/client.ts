import { createBrowserClient } from "@supabase/ssr";

// Singleton to avoid re-creating on every render
let cachedClient: ReturnType<typeof createBrowserClient> | null = null;

export function createClient() {
  if (cachedClient) return cachedClient;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Validate both vars exist and URL looks correct
  const isValid = url
    && key
    && url.startsWith("https://")
    && url.includes(".supabase.co")
    && key.startsWith("eyJ");

  if (!isValid) {
    console.error(
      "[PlantAI] Supabase not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY."
    );
    // Return a no-op proxy that won't crash the app
    // All auth/db calls will return errors gracefully
    const noopHandler: ProxyHandler<any> = {
      get: (_target, prop) => {
        if (prop === "auth") {
          return new Proxy({}, {
            get: () => async () => ({ data: { user: null, session: null }, error: { message: "Supabase not configured" } }),
          });
        }
        if (prop === "from") {
          return () => ({
            select: () => ({ eq: () => ({ single: async () => ({ data: null, error: { message: "Supabase not configured" } }), data: null, error: null }), data: null, error: null }),
            insert: async () => ({ data: null, error: { message: "Supabase not configured" } }),
            delete: () => ({ eq: async () => ({ data: null, error: null }) }),
          });
        }
        if (prop === "storage") {
          return { from: () => ({ upload: async () => ({ data: null, error: { message: "Not configured" } }), getPublicUrl: () => ({ data: { publicUrl: "" } }) }) };
        }
        return () => {};
      },
    };
    cachedClient = new Proxy({} as any, noopHandler);
    return cachedClient;
  }

  try {
    cachedClient = createBrowserClient(url, key);
    return cachedClient;
  } catch (err) {
    console.error("[PlantAI] Failed to initialize Supabase:", err);
    // Fallback to proxy if SDK throws
    cachedClient = new Proxy({} as any, {
      get: () => () => async () => ({ data: null, error: { message: "Supabase init failed" } }),
    });
    return cachedClient;
  }
}
