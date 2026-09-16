import React, { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import jsQR from "jsqr";
import { ArrowLeft, ScanLine, X, Loader2, UserCheck } from "lucide-react";
import { COLORS, AayuRahiLogoMark } from "./App";

/* ============================================================================
   DIGITAL HEALTH CARD & QR CHECK-IN
   - PatientHealthCard: a patient's own QR (encodes just their ID, so it works
     for any doctor/clinic, not one specific appointment) plus basic details,
     shown in Profile & Settings and from a today's-appointment detail screen.
   - QRScannerModal: opens the device camera and decodes a QR code using
     jsQR, entirely client-side — no external service involved.
============================================================================ */

export const AAYURAHI_QR_PREFIX = "AAYURAHI_PATIENT:";

export function PatientHealthCard({ patient, onBack }){
  const canvasRef = useRef(null);
  useEffect(()=>{
    if (canvasRef.current){
      QRCode.toCanvas(canvasRef.current, `${AAYURAHI_QR_PREFIX}${patient.id}`, { width: 200, margin: 1, color: { dark: COLORS.text, light: "#ffffff" } });
    }
  }, [patient.id]);

  return (
    <div className="mq-fade-in" style={{ position: "fixed", top: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 520, height: "100vh", background: COLORS.bg, zIndex: 1500, overflowY: "auto" }}>
      <div style={{ position: "sticky", top: 0, background: "#fff", borderBottom: `1px solid ${COLORS.border}`, padding: "16px 20px", display: "flex", alignItems: "center", gap: 12, zIndex: 2 }}>
        <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", color: COLORS.muted, display: "flex", alignItems: "center", padding: 0 }}>
          <ArrowLeft size={20} />
        </button>
        <AayuRahiLogoMark size={26} />
        <div style={{ fontWeight: 800, fontSize: 16 }}>My Health Card</div>
      </div>
      <div style={{ padding: "24px 20px 60px", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ width: "100%", maxWidth: 340, background: "#fff", borderRadius: 20, border: `1.5px solid ${COLORS.border}`, padding: 22, boxShadow: "0 8px 24px rgba(15,27,45,0.06)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
            <AayuRahiLogoMark size={24} />
            <div style={{ fontWeight: 800, fontSize: 13, color: COLORS.primary }}>AayuRahi Health Card</div>
          </div>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
            <canvas ref={canvasRef} style={{ borderRadius: 12 }} />
          </div>
          <div style={{ textAlign: "center", fontWeight: 800, fontSize: 15 }}>{patient.name}</div>
          {patient.phone && <div style={{ textAlign: "center", fontSize: 12.5, color: COLORS.muted, marginTop: 2 }}>{patient.phone}</div>}
          <div style={{ textAlign: "center", fontSize: 10.5, color: COLORS.muted, marginTop: 10 }}>ID: {patient.id.slice(0,8).toUpperCase()}</div>
        </div>
        <div style={{ fontSize: 12, color: COLORS.muted, textAlign: "center", marginTop: 20, lineHeight: 1.6, maxWidth: 320 }}>
          Show this QR code at the clinic's front desk to check in quickly for your appointment —
          no need to spell out your name or phone number.
        </div>
      </div>
    </div>
  );
}

export function QRScannerModal({ onDetect, onClose }){
  const videoRef = useRef(null);
  const canvasRef = useRef(document.createElement("canvas"));
  const [error, setError] = useState("");
  const [starting, setStarting] = useState(true);
  const streamRef = useRef(null);
  const rafRef = useRef(null);
  const doneRef = useRef(false);

  useEffect(()=>{
    let cancelled = false;
    (async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
        if (cancelled) { stream.getTracks().forEach(t=>t.stop()); return; }
        streamRef.current = stream;
        if (videoRef.current){
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
        setStarting(false);
        tick();
      } catch (e) {
        setError("Could not access the camera. Check camera permission for this site.");
        setStarting(false);
      }
    })();

    function tick(){
      if (doneRef.current) return;
      const video = videoRef.current;
      if (video && video.readyState === video.HAVE_ENOUGH_DATA){
        const canvas = canvasRef.current;
        canvas.width = video.videoWidth; canvas.height = video.videoHeight;
        const ctx2d = canvas.getContext("2d");
        ctx2d.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = ctx2d.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height);
        if (code && code.data) {
          doneRef.current = true;
          onDetect(code.data);
          return;
        }
      }
      rafRef.current = requestAnimationFrame(tick);
    }

    return () => {
      cancelled = true;
      doneRef.current = true;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (streamRef.current) streamRef.current.getTracks().forEach(t=>t.stop());
    };
  }, []);

  return (
    <div style={{ position: "fixed", inset: 0, background: "#000", zIndex: 2000, display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px" }}>
        <div style={{ color: "#fff", fontWeight: 700, fontSize: 14, display: "flex", alignItems: "center", gap: 8 }}><ScanLine size={18}/> Scan Health Card</div>
        <button onClick={onClose} style={{ background: "rgba(255,255,255,0.15)", border: "none", borderRadius: 10, width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
          <X size={18} color="#fff" />
        </button>
      </div>
      <div style={{ flex: 1, position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
        {starting && <Loader2 size={28} color="#fff" style={{ animation: "spin 1s linear infinite" }} />}
        {error && <div style={{ color: "#fff", fontSize: 13, textAlign: "center", padding: 24 }}>{error}</div>}
        <video ref={videoRef} playsInline muted style={{ width: "100%", height: "100%", objectFit: "cover", display: starting || error ? "none" : "block" }} />
        {!starting && !error && (
          <div style={{ position: "absolute", width: 220, height: 220, border: "3px solid #fff", borderRadius: 20, boxShadow: "0 0 0 2000px rgba(0,0,0,0.4)" }} />
        )}
      </div>
      <div style={{ color: "rgba(255,255,255,0.75)", fontSize: 12, textAlign: "center", padding: "14px 20px 24px" }}>
        Point the camera at the patient's health card QR code
      </div>
    </div>
  );
}
