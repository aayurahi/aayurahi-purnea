import React from "react";
import { ArrowLeft, Phone, AlertTriangle, MapPin } from "lucide-react";
import { COLORS, AayuRahiLogoMark } from "./App";

/* ============================================================================
   EMERGENCY & HOSPITALS DIRECTORY
   National emergency numbers are standard, official, pan-India numbers — safe
   to rely on as-is. The LOCAL_HOSPITALS list below is a starting point only,
   sourced from a public PM-JAY hospital directory — it has NOT been verified
   against the actual hospitals and could be outdated or wrong. Since this is
   an emergency page people may genuinely rely on, please:
     1. Call each number once yourself to confirm it's correct and current.
     2. Add any hospitals/blood banks/pharmacies you personally trust.
     3. Remove any entry you can't personally vouch for.
   Just edit the LOCAL_HOSPITALS array below — no other file needs to change.
============================================================================ */

export const NATIONAL_EMERGENCY_NUMBERS = [
  { label: "All-in-one Emergency", sub: "Police, Fire, Ambulance, Disaster", number: "112" },
  { label: "Ambulance", sub: "Free emergency ambulance service", number: "108" },
  { label: "Pregnant Women & Child Ambulance", sub: "Mamta Vahan / free pickup service", number: "102" },
  { label: "Police", number: "100" },
  { label: "Fire", number: "101" },
  { label: "Women's Helpline", number: "1091" },
  { label: "Child Helpline", number: "1098" },
  { label: "Mental Health Helpline", sub: "Tele-MANAS, govt. of India", number: "14416" },
];

// ⚠️ UNVERIFIED — sourced from a public hospital directory, not confirmed by
// calling. Please verify before relying on this list. Edit freely below.
export const LOCAL_HOSPITALS = [
  { name: "Government Medical College & Hospital (GMCH), Purnea", number: "9304198796", note: "Government, PM-JAY empanelled" },
  { name: "Anand Hospital, Purnea", number: "9006511111", note: "Private, PM-JAY empanelled" },
  { name: "Al Shafa Hospital, Line Bazar, Purnea", number: "8969121786", note: "Private, PM-JAY empanelled" },
  { name: "Eye Care Hospital, Purnea", number: "9472001855", note: "Private, eye care, PM-JAY empanelled" },
];

function CallRow({ label, sub, number, note }) {
  return (
    <a
      href={`tel:${number}`}
      style={{
        display: "flex", alignItems: "center", gap: 12, background: "#fff",
        border: `1.5px solid ${COLORS.border}`, borderRadius: 14, padding: "12px 14px",
        marginBottom: 10, textDecoration: "none",
      }}
    >
      <div style={{ width: 40, height: 40, borderRadius: 12, background: COLORS.dangerSoft, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <Phone size={18} color={COLORS.danger} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 700, fontSize: 13.5, color: COLORS.text }}>{label}</div>
        {sub && <div style={{ fontSize: 11.5, color: COLORS.muted, marginTop: 1 }}>{sub}</div>}
        {note && <div style={{ fontSize: 11, color: COLORS.warning, marginTop: 1, fontWeight: 600 }}>{note}</div>}
      </div>
      <div style={{ fontWeight: 800, fontSize: 15, color: COLORS.primary }}>{number}</div>
    </a>
  );
}

export default function EmergencyInfoPage({ onBack, standalone = false }) {
  return (
    <div className="mq-fade-in" style={{ minHeight: "100%", background: COLORS.bg, overflowY: "auto" }}>
      <div style={{ position: "sticky", top: 0, background: "#fff", borderBottom: `1px solid ${COLORS.border}`, padding: "16px 20px", display: "flex", alignItems: "center", gap: 12, zIndex: 2 }}>
        {onBack && (
          <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", color: COLORS.muted, display: "flex", alignItems: "center", padding: 0 }}>
            <ArrowLeft size={20} />
          </button>
        )}
        <AayuRahiLogoMark size={26} />
        <div style={{ fontWeight: 800, fontSize: 16 }}>Emergency & Hospitals</div>
      </div>

      <div style={{ padding: "18px 20px 60px" }}>
        <div style={{ background: COLORS.dangerSoft, border: `1.5px solid ${COLORS.danger}`, borderRadius: 14, padding: 14, marginBottom: 20, display: "flex", gap: 10 }}>
          <AlertTriangle size={18} color={COLORS.danger} style={{ flexShrink: 0, marginTop: 1 }} />
          <div style={{ fontSize: 13, lineHeight: 1.55, color: COLORS.text, fontWeight: 600 }}>
            If this is a life-threatening emergency, call <b>108</b> or <b>112</b> right now, or go straight
            to the nearest hospital. Tap any number below to call it directly.
          </div>
        </div>

        <div style={{ fontWeight: 800, fontSize: 14, marginBottom: 10 }}>National Emergency Numbers</div>
        {NATIONAL_EMERGENCY_NUMBERS.map((n) => (
          <CallRow key={n.number} label={n.label} sub={n.sub} number={n.number} />
        ))}

        <div style={{ fontWeight: 800, fontSize: 14, margin: "22px 0 6px", display: "flex", alignItems: "center", gap: 6 }}>
          <MapPin size={15} color={COLORS.primary} /> Hospitals in Purnea
        </div>
        <div style={{ fontSize: 11.5, color: COLORS.muted, marginBottom: 10, lineHeight: 1.5 }}>
          Please confirm these are correct before relying on them — tap "Get in Touch" in Settings if
          you'd like to suggest a correction.
        </div>
        {LOCAL_HOSPITALS.map((h) => (
          <CallRow key={h.number} label={h.name} sub={h.note} number={h.number} />
        ))}

        {standalone && (
          <div style={{ marginTop: 30, textAlign: "center" }}>
            <a href="/" style={{ color: COLORS.primary, fontWeight: 700, fontSize: 13, textDecoration: "none" }}>← Open AayuRahi</a>
          </div>
        )}
      </div>
    </div>
  );
}
