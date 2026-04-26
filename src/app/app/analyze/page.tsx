"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Camera, FileImage, X, AlertCircle, Share2, Download, BookmarkPlus, CheckCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { getSeverityClass, formatConfidence, getConfidenceLabel } from "@/lib/utils";
import type { PredictResponse, Severity } from "@/types";
import UpgradeModal from "@/components/shared/UpgradeModal";
import { nanoid } from "nanoid";

type State = "empty" | "validating" | "uploading" | "predicting" | "result" | "error";

interface ScanResult extends PredictResponse {
  imageUrl: string;
  scanId?: string;
}

export default function AnalyzePage() {
  const supabase = createClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [state, setState] = useState<State>("empty");
  const [preview, setPreview] = useState<string>("");
  const [result, setResult] = useState<ScanResult | null>(null);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [upgradeFeature, setUpgradeFeature] = useState<string>("");
  const [warmingUp, setWarmingUp] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [expandedStep, setExpandedStep] = useState<number | null>(0);
  const warmingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const validateFile = (file: File): string | null => {
    const allowed = ["image/jpeg", "image/png", "image/webp"];
    if (!allowed.includes(file.type)) return "Please upload a JPG, PNG, or WebP image.";
    if (file.size > 10 * 1024 * 1024) return "Image must be under 10MB.";
    return null;
  };

  const processFile = useCallback(async (file: File) => {
    setState("validating");
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      setState("error");
      return;
    }

    // Check min dimensions
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);
    img.src = objectUrl;
    await new Promise<void>(resolve => { img.onload = () => resolve(); });
    URL.revokeObjectURL(objectUrl);
    if (img.width < 224 || img.height < 224) {
      setError("Image must be at least 224×224 pixels for accurate analysis.");
      setState("error");
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setPreview(previewUrl);
    setState("predicting");

    // Start warming-up timer (Render free tier cold start)
    warmingTimer.current = setTimeout(() => setWarmingUp(true), 10000);

    try {
      // Send image directly to FastAPI for AI prediction
      const formData = new FormData();
      formData.append("image", file);

      // Call our own API route (same domain = no CORS)
      const resp = await fetch("/api/predict", {
        method: "POST",
        body: formData,
      });
      if (warmingTimer.current) clearTimeout(warmingTimer.current);
      setWarmingUp(false);

      if (!resp.ok) {
        const errData = await resp.json().catch(() => ({}));
        throw new Error(errData.error || `Prediction failed: ${resp.status}`);
      }
      const prediction: PredictResponse = await resp.json();

      // Try to upload to Supabase Storage for history (non-blocking)
      let imageUrl = previewUrl;
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const fileName = `${user.id}/${nanoid()}.${file.name.split(".").pop()}`;
          const { data: uploadData } = await supabase.storage
            .from("scans")
            .upload(fileName, file, { cacheControl: "3600", upsert: false });
          if (uploadData) {
            const { data: { publicUrl } } = supabase.storage.from("scans").getPublicUrl(uploadData.path);
            imageUrl = publicUrl;
          }
        }
      } catch {
        // Storage upload failed — non-critical, use local preview
      }

      setResult({ ...prediction, imageUrl });
      setState("result");
    } catch (err: any) {
      if (warmingTimer.current) clearTimeout(warmingTimer.current);
      setWarmingUp(false);
      const msg = err?.message || "Unknown error";
      setError(`Failed to analyze: ${msg}. Check if the AI service is running.`);
      setState("error");
    }
  }, [supabase]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  const handleSave = async () => {
    if (!result) return;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await (supabase as any).from("scans").insert({
      user_id: user.id,
      image_url: result.imageUrl,
      disease_name: result.disease,
      confidence: result.confidence,
      severity: result.severity as Severity,
      treatment_steps: result.treatment_steps,
      status: "complete",
    }).select().single();

    if (data) {
      setResult(r => r ? { ...r, scanId: data.id } : r);
      setSaved(true);
    }
  };

  const handlePDF = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    const { data: profile } = await (supabase as any).from("profiles").select("plan").eq("id", user!.id).single();
    if (profile?.plan === "free") { setUpgradeFeature("PDF Export"); return; }
    // PDF generation handled by react-pdf component
    alert("PDF export coming in next build step — module loaded separately.");
  };

  const handleShare = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    const { data: profile } = await (supabase as any).from("profiles").select("plan").eq("id", user!.id).single();
    if (profile?.plan === "free") { setUpgradeFeature("Share Links"); return; }
    if (!result?.scanId) { alert("Save the scan first to share it."); return; }
    const token = nanoid(12);
    await (supabase as any).from("share_links").insert({ scan_id: result.scanId, token });
    const link = `${window.location.origin}/share/${token}`;
    navigator.clipboard.writeText(link);
    alert(`Share link copied!\n${link}`);
  };

  const reset = () => {
    setState("empty");
    setPreview("");
    setResult(null);
    setError("");
    setSaved(false);
    setWarmingUp(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div style={{ maxWidth: 720, margin: "0 auto" }}>
      <div style={{ marginBottom: "1.75rem" }}>
        <h1 style={{ fontSize: "1.625rem", fontWeight: 700 }}>Analyze Plant</h1>
        <p style={{ color: "var(--color-muted)", marginTop: "0.25rem", fontSize: "0.9375rem" }}>Upload a clear photo of a leaf to get an instant AI diagnosis</p>
      </div>

      <AnimatePresence mode="wait">
        {/* EMPTY STATE */}
        {state === "empty" && (
          <motion.div key="empty" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <div
              onDragOver={e => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              style={{
                border: `2px dashed ${dragOver ? "var(--color-accent)" : "var(--color-border-light)"}`,
                borderRadius: "var(--radius-lg)", padding: "3rem 2rem",
                textAlign: "center", cursor: "pointer",
                background: dragOver ? "rgba(82,183,136,0.05)" : "var(--color-surface)",
                transition: "all 0.2s ease",
              }}
              onClick={() => fileInputRef.current?.click()}
            >
              <div style={{ width: 64, height: 64, background: "rgba(82,183,136,0.1)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.25rem" }}>
                <Upload size={28} color="var(--color-accent)" />
              </div>
              <h3 style={{ fontSize: "1.0625rem", fontWeight: 600, marginBottom: "0.5rem" }}>Drop your leaf photo here</h3>
              <p style={{ color: "var(--color-muted)", fontSize: "0.875rem", marginBottom: "1.5rem" }}>
                JPG, PNG or WebP · Max 10MB · Min 224×224px
              </p>
              <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap" }}>
                <button id="choose-file-btn" className="btn-primary" onClick={e => { e.stopPropagation(); fileInputRef.current?.click(); }}>
                  <FileImage size={18} /> Choose File
                </button>
                <button id="take-photo-btn" className="btn-secondary" onClick={e => {
                  e.stopPropagation();
                  if (fileInputRef.current) { fileInputRef.current.accept = "image/*"; fileInputRef.current.capture = "environment"; fileInputRef.current.click(); }
                }}>
                  <Camera size={18} /> Take Photo
                </button>
              </div>
            </div>
            <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" style={{ display: "none" }} onChange={handleFileChange} />
          </motion.div>
        )}

        {/* ERROR STATE */}
        {state === "error" && (
          <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="card" style={{ textAlign: "center", padding: "2.5rem" }}>
              <AlertCircle size={40} color="var(--color-danger)" style={{ margin: "0 auto 1rem" }} />
              <h3 style={{ fontWeight: 600, marginBottom: "0.5rem" }}>Something went wrong</h3>
              <p style={{ color: "var(--color-muted)", marginBottom: "1.5rem", fontSize: "0.9rem" }}>{error}</p>
              <button onClick={reset} className="btn-primary">Try Again</button>
            </div>
          </motion.div>
        )}

        {/* LOADING STATES */}
        {(state === "uploading" || state === "predicting" || state === "validating") && (
          <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="card" style={{ textAlign: "center", padding: "3rem 2rem" }}>
              {preview && (
                <div style={{ marginBottom: "1.5rem" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={preview} alt="Uploaded leaf" style={{ width: 120, height: 120, objectFit: "cover", borderRadius: "var(--radius)", border: "1px solid var(--color-border)", margin: "0 auto" }} />
                </div>
              )}
              <div className="spinner" style={{ margin: "0 auto 1.25rem" }} />
              <h3 style={{ fontWeight: 600, marginBottom: "0.375rem" }}>
                {state === "validating" && "Validating image…"}
                {state === "uploading" && "Uploading image…"}
                {state === "predicting" && (warmingUp ? "Model warming up, please wait…" : "Analyzing your plant…")}
              </h3>
              <p style={{ color: "var(--color-muted)", fontSize: "0.875rem" }}>
                {state === "predicting" ? "Our AI is examining the leaf for diseases" : ""}
              </p>
            </div>
          </motion.div>
        )}

        {/* RESULT STATE */}
        {state === "result" && result && (
          <motion.div key="result" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            {/* Image + Disease header */}
            <div className="card" style={{ padding: 0, overflow: "hidden", marginBottom: "1rem" }}>
              <div style={{ display: "flex", gap: 0, flexWrap: "wrap" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={preview} alt="Analyzed leaf" style={{ width: 200, height: 200, objectFit: "cover", flexShrink: 0 }} />
                <div style={{ flex: 1, padding: "1.5rem", minWidth: 220 }}>
                  <div className={getSeverityClass(result.severity as Severity)} style={{ marginBottom: "0.875rem", display: "inline-flex" }}>
                    {result.severity} severity
                  </div>
                  <h2 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "0.75rem", lineHeight: 1.3 }}>{result.disease}</h2>

                  {/* Confidence bar */}
                  <div style={{ marginBottom: "0.25rem", display: "flex", justifyContent: "space-between", fontSize: "0.8125rem", color: "var(--color-muted)" }}>
                    <span>Confidence</span>
                    <span style={{ fontWeight: 600, color: "var(--color-text)" }}>
                      {formatConfidence(result.confidence)} · {getConfidenceLabel(result.confidence)}
                    </span>
                  </div>
                  <div style={{ height: 8, background: "var(--color-border)", borderRadius: 4, overflow: "hidden" }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${result.confidence * 100}%` }}
                      transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                      style={{ height: "100%", background: "linear-gradient(90deg, var(--color-primary), var(--color-accent))", borderRadius: 4 }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Treatment steps */}
            <div className="card" style={{ marginBottom: "1rem" }}>
              <h3 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: "1rem" }}>Treatment Steps</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {result.treatment_steps.map((step, i) => (
                  <div key={i}
                    onClick={() => setExpandedStep(expandedStep === i ? null : i)}
                    style={{
                      padding: "0.75rem 1rem", background: "var(--color-surface-2)",
                      borderRadius: "var(--radius-sm)", cursor: "pointer",
                      border: "1px solid var(--color-border)",
                      transition: "border-color 0.15s ease",
                    }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                      <div style={{ width: 24, height: 24, background: "var(--color-primary)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: "0.75rem", fontWeight: 700, color: "#fff" }}>
                        {i + 1}
                      </div>
                      <span style={{ fontSize: "0.9rem", flex: 1 }}>{step}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action buttons */}
            <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
              <button id="save-to-history" onClick={handleSave} disabled={saved} className={saved ? "btn-secondary" : "btn-primary"} style={{ flex: 1, minWidth: 140 }}>
                {saved ? <><CheckCircle size={16} /> Saved!</> : <><BookmarkPlus size={16} /> Save to History</>}
              </button>
              <button id="export-pdf" onClick={handlePDF} className="btn-secondary" style={{ minWidth: 44 }}>
                <Download size={18} />
              </button>
              <button id="share-link" onClick={handleShare} className="btn-secondary" style={{ minWidth: 44 }}>
                <Share2 size={18} />
              </button>
              <button onClick={reset} className="btn-ghost" style={{ minWidth: 44 }}>
                <X size={18} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {upgradeFeature && <UpgradeModal feature={upgradeFeature} onClose={() => setUpgradeFeature("")} />}
    </div>
  );
}
