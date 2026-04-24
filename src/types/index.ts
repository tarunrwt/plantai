export type Plan = "free" | "pro" | "team";
export type Severity = "low" | "medium" | "high" | "critical";
export type ScanStatus = "pending" | "complete" | "failed";

export interface Profile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  plan: Plan;
  scans_this_month: number;
  onboarding_complete: boolean;
  crop_types: string[] | null;
  region: string | null;
  push_subscription: PushSubscriptionJSON | null;
  created_at: string;
}

export interface Scan {
  id: string;
  user_id: string;
  image_url: string;
  disease_name: string | null;
  confidence: number | null;
  severity: Severity | null;
  treatment_steps: string[] | null;
  status: ScanStatus;
  created_at: string;
}

export interface ShareLink {
  id: string;
  scan_id: string;
  token: string;
  expires_at: string | null;
  created_at: string;
}

export interface Subscription {
  id: string;
  user_id: string;
  stripe_subscription_id: string | null;
  plan: Plan;
  status: string;
  current_period_end: string | null;
}

export interface PredictResponse {
  disease: string;
  confidence: number;
  severity: Severity;
  treatment_steps: string[];
}

export interface Database {
  public: {
    Tables: {
      profiles: { Row: Profile; Insert: Partial<Profile>; Update: Partial<Profile> };
      scans: { Row: Scan; Insert: Partial<Scan>; Update: Partial<Scan> };
      share_links: { Row: ShareLink; Insert: Partial<ShareLink>; Update: Partial<ShareLink> };
      subscriptions: { Row: Subscription; Insert: Partial<Subscription>; Update: Partial<Subscription> };
    };
  };
}
