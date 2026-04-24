import type { Metadata, Viewport } from "next";
import "./globals.css";

// Force all pages to be dynamically rendered — prevents build-time Supabase URL errors
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: { default: "PlantAI — AI Plant Disease Detection", template: "%s | PlantAI" },
  description: "Instantly detect plant diseases with AI. Upload a leaf photo and get diagnosis, severity assessment, and treatment steps in seconds.",
  keywords: ["plant disease detection", "AI agriculture", "crop health", "plant diagnosis", "farming app"],
  openGraph: {
    title: "PlantAI — AI Plant Disease Detection",
    description: "Instantly detect plant diseases with AI. Built for farmers and agronomists.",
    type: "website",
    url: "https://plantai.app",
  },
  twitter: { card: "summary_large_image", title: "PlantAI", description: "AI-powered plant disease detection for farmers." },
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#080d0a",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
