import React from "react";
import { ArrowLeft, AlertTriangle, ChevronRight, HelpCircle } from "lucide-react";
import { COLORS, AayuRahiLogoMark, SPECIALTIES, translateSpecialty } from "./App";

/* ============================================================================
   SYMPTOM-TO-SPECIALTY GUIDE
   Helps a patient who doesn't know which kind of doctor they need pick a
   common complaint and get routed straight to that specialty in search.
   Purely navigational — not a diagnosis. One entry per specialty in
   SPECIALTIES (src/App.jsx), in the same order, so the icon and translated
   name always stay in sync automatically.
============================================================================ */
export const SYMPTOM_ITEMS = [
  { symptom: "Fever, cough or cold", symptomHi: "बुखार, खांसी या ज़ुकाम", specialty: "General Physician" },
  { symptom: "Chest pain or heart concern", symptomHi: "सीने में दर्द या दिल से जुड़ी समस्या", specialty: "Cardiologist" },
  { symptom: "Skin rash, itching or allergy", symptomHi: "त्वचा पर चकत्ते, खुजली या एलर्जी", specialty: "Dermatologist" },
  { symptom: "Child's health issue", symptomHi: "बच्चे से जुड़ी स्वास्थ्य समस्या", specialty: "Pediatrician" },
  { symptom: "Joint, bone or back pain", symptomHi: "जोड़ों, हड्डी या कमर में दर्द", specialty: "Orthopedic" },
  { symptom: "Pregnancy or women's health", symptomHi: "गर्भावस्था या महिला स्वास्थ्य", specialty: "Gynecologist" },
  { symptom: "Ear, nose or throat problem", symptomHi: "कान, नाक या गले की समस्या", specialty: "ENT Specialist" },
  { symptom: "Frequent headache or dizziness", symptomHi: "बार-बार सिरदर्द या चक्कर आना", specialty: "Neurologist" },
  { symptom: "Tooth or gum pain", symptomHi: "दांत या मसूड़ों में दर्द", specialty: "Dentist" },
  { symptom: "Stress, anxiety or sleep issues", symptomHi: "तनाव, चिंता या नींद न आना", specialty: "Psychiatrist" },
  { symptom: "Eye problem or vision issue", symptomHi: "आंख की समस्या या धुंधला दिखना", specialty: "Ophthalmologist" },
  { symptom: "Urination or kidney issue", symptomHi: "पेशाब या किडनी से जुड़ी समस्या", specialty: "Urologist" },
  { symptom: "Stomach pain, acidity or digestion", symptomHi: "पेट दर्द, गैस या पाचन की समस्या", specialty: "Gastroenterologist" },
  { symptom: "Diabetes or thyroid concern", symptomHi: "डायबिटीज़ या थायरॉइड से जुड़ी समस्या", specialty: "Endocrinologist" },
  { symptom: "Breathing issue or persistent cough", symptomHi: "सांस लेने में तकलीफ़ या पुरानी खांसी", specialty: "Pulmonologist" },
];

export default function SymptomGuideModal({ onSelect, onClose, language = "en" }) {
  return (
    <div
      className="mq-fade-in"
      style={{
        position: "fixed", top: 0, left: "50%", transform: "translateX(-50%)",
        width: "100%", maxWidth: 520, height: "100vh", background: COLORS.bg,
        zIndex: 1500, overflowY: "auto", boxShadow: "0 0 40px rgba(15,27,45,0.15)",
      }}
    >
      <div style={{ position: "sticky", top: 0, background: "#fff", borderBottom: `1px solid ${COLORS.border}`, padding: "16px 20px", display: "flex", alignItems: "center", gap: 12, zIndex: 2 }}>
        <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: COLORS.muted, display: "flex", alignItems: "center", padding: 0 }}>
          <ArrowLeft size={20} />
        </button>
        <AayuRahiLogoMark size={26} />
        <div style={{ fontWeight: 800, fontSize: 16 }}>{language === "hi" ? "किस डॉक्टर से मिलें?" : "Not Sure Who to See?"}</div>
      </div>

      <div style={{ padding: "18px 20px 60px" }}>
        <div style={{ background: COLORS.secondarySoft, border: `1.5px solid ${COLORS.secondary}`, borderRadius: 14, padding: 14, marginBottom: 18, display: "flex", gap: 10 }}>
          <HelpCircle size={18} color={COLORS.secondary} style={{ flexShrink: 0, marginTop: 1 }} />
          <div style={{ fontSize: 12.5, lineHeight: 1.55, color: COLORS.text }}>
            {language === "hi"
              ? "यह सिर्फ आपको सही डॉक्टर खोजने में मदद करता है — यह कोई जांच या सलाह नहीं है। सही निदान के लिए हमेशा डॉक्टर से मिलें।"
              : "This just helps you find the right kind of doctor to search for — it's not a diagnosis. Always see a doctor for an actual assessment."}
          </div>
        </div>

        {SYMPTOM_ITEMS.map((item) => {
          const spec = SPECIALTIES.find((s) => s.name === item.specialty);
          const Icon = spec?.icon || HelpCircle;
          return (
            <button
              key={item.specialty}
              className="mq-btn"
              onClick={() => onSelect(item.specialty)}
              style={{
                width: "100%", display: "flex", alignItems: "center", gap: 12, background: "#fff",
                border: `1.5px solid ${COLORS.border}`, borderRadius: 14, padding: "12px 14px",
                marginBottom: 10, textAlign: "left",
              }}
            >
              <div style={{ width: 38, height: 38, borderRadius: 11, background: COLORS.primarySoft, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Icon size={17} color={COLORS.primary} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: 13.5, color: COLORS.text }}>{language === "hi" ? item.symptomHi : item.symptom}</div>
                <div style={{ fontSize: 11.5, color: COLORS.muted, marginTop: 1 }}>{translateSpecialty(item.specialty, language)}</div>
              </div>
              <ChevronRight size={17} color={COLORS.muted} />
            </button>
          );
        })}
      </div>
    </div>
  );
}
