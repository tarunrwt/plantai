import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Severity } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatDateTime(dateString: string): string {
  return new Date(dateString).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function getSeverityClass(severity: Severity | null): string {
  switch (severity) {
    case "low": return "badge badge-low";
    case "medium": return "badge badge-medium";
    case "high": return "badge badge-high";
    case "critical": return "badge badge-critical";
    default: return "badge";
  }
}

export function getSeverityColor(severity: Severity | null): string {
  switch (severity) {
    case "low": return "#52b788";
    case "medium": return "#f4a261";
    case "high": return "#e63946";
    case "critical": return "#9b1dff";
    default: return "#7a9488";
  }
}

export function getConfidenceLabel(confidence: number): string {
  if (confidence >= 0.9) return "Very High";
  if (confidence >= 0.75) return "High";
  if (confidence >= 0.6) return "Moderate";
  return "Low";
}

export function formatConfidence(confidence: number): string {
  return `${Math.round(confidence * 100)}%`;
}

export function slugify(text: string): string {
  return text.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "");
}
