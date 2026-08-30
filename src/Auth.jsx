import React, { useState } from "react";
import { User, Stethoscope, ShieldCheck, Mail, Phone, ChevronRight, ArrowLeft, Loader2, CheckCircle2, Upload } from "lucide-react";
import { supabase } from "./supabaseClient";
import { COLORS, AayuRahiLogoMark, useAppBackButton, t } from "./App";

/* ============================================================================
   REAL AUTH — email/password + phone OTP, backed by Supabase Auth.
   Roles are never chosen by the user — every signup starts as "patient".
   Becoming a doctor requires applying, then admin approval (verified=true).
============================================================================ */

function Shell({ title, onBack, children }) {
  return (
    <div className="mq-fade-in" style={{ minHeight: "100vh", padding: 20, background: COLORS.bg }}>
      {onBack && (
        <button onClick={onBack} style={{ background: "none", border: "none", display: "flex", alignItems: "center", gap: 6, color: COLORS.muted, fontWeight: 700, fontSize: 13, marginBottom: 18, cursor: "pointer" }}>
          <ArrowLeft size={16} /> Back
        </button>
      )}
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <div style={{ width: 56, height: 56, borderRadius: 16, background: COLORS.primary, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
          <AayuRahiLogoMark size={28} />
        </div>
        <div style={{ fontSize: 20, fontWeight: 800 }}>{title}</div>
      </div>
      {children}
    </div>
  );
}

function TextField({ label, ...props }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ fontSize: 12.5, fontWeight: 700, color: COLORS.muted, marginBottom: 6 }}>{label}</div>
      <input {...props} style={{ width: "100%", boxSizing: "border-box", padding: "12px 14px", borderRadius: 12, border: `1.5px solid ${COLORS.border}`, fontSize: 14, outline: "none" }} />
    </div>
  );
}

function PrimaryButton({ children, disabled, ...props }) {
  return (
    <button {...props} disabled={disabled} style={{ width: "100%", padding: "13px 16px", borderRadius: 14, border: "none", background: disabled ? COLORS.border : COLORS.primary, color: "#fff", fontWeight: 800, fontSize: 14.5, cursor: disabled ? "default" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
      {children}
    </button>
  );
}

function ErrorMsg({ msg }) {
  if (!msg) return null;
  return <div style={{ color: COLORS.danger, fontSize: 13, fontWeight: 600, marginBottom: 12 }}>{msg}</div>;
}

/* --------------------------- Landing choice --------------------------- */
export default function Auth({ onAuthed }) {
  const [screen, setScreen] = useState("landing"); // landing | email | phone | doctorApply | pendingDoctor
  const [pendingProfile, setPendingProfile] = useState(null);
  const [lang, setLang] = useState(() => localStorage.getItem("mq_lang") || "en");
  useAppBackButton(screen, "landing", () => setScreen("landing"));

  const toggleLang = () => {
    const next = lang === "en" ? "hi" : "en";
    setLang(next);
    localStorage.setItem("mq_lang", next);
  };

  if (screen === "email") return <EmailAuth onBack={() => setScreen("landing")} onAuthed={onAuthed} onNeedsDoctorApply={(p) => { setPendingProfile(p); setScreen("doctorApply"); }} />;
  if (screen === "phone") return <PhoneAuth onBack={() => setScreen("landing")} onAuthed={onAuthed} onNeedsDoctorApply={(p) => { setPendingProfile(p); setScreen("doctorApply"); }} />;
  if (screen === "doctorApply") return <DoctorApply profile={pendingProfile} onDone={() => setScreen("pendingDoctor")} onSkip={() => onAuthed(pendingProfile)} />;
  if (screen === "pendingDoctor") return <PendingDoctorScreen onContinueAsPatient={() => onAuthed(pendingProfile)} />;

  return (
    <Shell title={t("welcomeTitle", lang)}>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <ChoiceCard icon={Mail} title={t("continueWithEmail", lang)} subtitle="Sign up or log in with email + password" onClick={() => setScreen("email")} />
        <ChoiceCard icon={Phone} title={t("continueWithPhone", lang)} subtitle="Log in instantly with an OTP code" onClick={() => setScreen("phone")} />
      </div>
      <div style={{ textAlign: "center", fontSize: 12, color: COLORS.muted, marginTop: 22 }}>
        {t("newAccountsNote", lang)}
      </div>
      <div style={{ textAlign: "center", marginTop: 18 }}>
        <button onClick={toggleLang} style={{ background: "none", border: "none", color: COLORS.primary, fontWeight: 700, fontSize: 13, textDecoration: "underline", cursor: "pointer" }}>
          {lang === "en" ? "हिंदी" : "English"}
        </button>
      </div>
    </Shell>
  );
}

function ChoiceCard({ icon: Icon, title, subtitle, onClick }) {
  return (
    <button onClick={onClick} style={{ textAlign: "left", background: "#fff", border: `1.5px solid ${COLORS.border}`, borderRadius: 18, padding: 16, display: "flex", alignItems: "center", gap: 14, cursor: "pointer" }}>
      <div style={{ width: 46, height: 46, borderRadius: 13, background: COLORS.primarySoft, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <Icon size={22} color={COLORS.primary} />
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 800, fontSize: 15 }}>{title}</div>
        <div style={{ fontSize: 12.5, color: COLORS.muted, marginTop: 2 }}>{subtitle}</div>
      </div>
      <ChevronRight size={18} color={COLORS.muted} />
    </button>
  );
}

/* --------------------------- Helper: after successful login/signup --------------------------- */
async function resolveProfileAndRoute(userId, { onAuthed, onNeedsDoctorApply }) {
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", userId).single();
  if (!profile) return; // trigger may take a moment; caller can retry
  if (profile.role === "patient") {
    // Freshly a patient — offer the doctor-application choice once, then proceed.
    onNeedsDoctorApply({ role: profile.role, id: profile.id, full_name: profile.full_name });
    return;
  }
  if (profile.role === "doctor") {
    const { data: doc } = await supabase.from("doctors").select("verified").eq("profile_id", userId).maybeSingle();
    onAuthed({ role: "doctor", id: profile.id, verified: !!doc?.verified, full_name: profile.full_name });
    return;
  }
  onAuthed({ role: profile.role, id: profile.id, full_name: profile.full_name });
}

/* --------------------------- Email + Password --------------------------- */
function EmailAuth({ onBack, onAuthed, onNeedsDoctorApply }) {
  const [mode, setMode] = useState("login"); // login | signup
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async () => {
    setError(""); setLoading(true);
    try {
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email, password, options: { data: { full_name: name } }
        });
        if (error) throw error;
        if (data.session) {
          await resolveProfileAndRoute(data.user.id, { onAuthed, onNeedsDoctorApply });
        } else {
          setError("Check your email to confirm your account, then log in.");
          setMode("login");
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        await resolveProfileAndRoute(data.user.id, { onAuthed, onNeedsDoctorApply });
      }
    } catch (e) {
      setError(e.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Shell title={mode === "login" ? "Log In" : "Create Account"} onBack={onBack}>
      {mode === "signup" && <TextField label="Full Name" value={name} onChange={e => setName(e.target.value)} placeholder="Your name" />}
      <TextField label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" />
      <TextField label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="At least 6 characters" />
      <ErrorMsg msg={error} />
      <PrimaryButton onClick={submit} disabled={loading || !email || !password}>
        {loading ? <Loader2 size={16} style={{animation:"spin 1s linear infinite"}} /> : (mode === "login" ? "Log In" : "Sign Up")}
      </PrimaryButton>
      <div style={{ textAlign: "center", marginTop: 16, fontSize: 13, color: COLORS.muted }}>
        {mode === "login" ? (
          <>New here? <a onClick={() => setMode("signup")} style={{ color: COLORS.primary, fontWeight: 700, cursor: "pointer" }}>Create an account</a></>
        ) : (
          <>Already have an account? <a onClick={() => setMode("login")} style={{ color: COLORS.primary, fontWeight: 700, cursor: "pointer" }}>Log in</a></>
        )}
      </div>
    </Shell>
  );
}

/* --------------------------- Phone + OTP --------------------------- */
function PhoneAuth({ onBack, onAuthed, onNeedsDoctorApply }) {
  const [step, setStep] = useState("phone"); // phone | otp
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const sendOtp = async () => {
    setError(""); setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({ phone: phone.startsWith("+") ? phone : `+91${phone}` });
      if (error) throw error;
      setStep("otp");
    } catch (e) {
      setError(e.message || "Could not send OTP. Check the number and try again.");
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    setError(""); setLoading(true);
    try {
      const fullPhone = phone.startsWith("+") ? phone : `+91${phone}`;
      const { data, error } = await supabase.auth.verifyOtp({ phone: fullPhone, token: otp, type: "sms" });
      if (error) throw error;
      await resolveProfileAndRoute(data.user.id, { onAuthed, onNeedsDoctorApply });
    } catch (e) {
      setError(e.message || "Invalid code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (step === "otp") {
    return (
      <Shell title="Enter the OTP" onBack={() => setStep("phone")}>
        <div style={{ fontSize: 13, color: COLORS.muted, marginBottom: 14 }}>Code sent to {phone}</div>
        <TextField label="6-digit code" value={otp} onChange={e => setOtp(e.target.value)} placeholder="123456" maxLength={6} />
        <ErrorMsg msg={error} />
        <PrimaryButton onClick={verifyOtp} disabled={loading || otp.length < 4}>
          {loading ? <Loader2 size={16} style={{animation:"spin 1s linear infinite"}} /> : "Verify & Continue"}
        </PrimaryButton>
      </Shell>
    );
  }

  return (
    <Shell title="Log in with Phone" onBack={onBack}>
      <TextField label="Phone Number" value={phone} onChange={e => setPhone(e.target.value)} placeholder="10-digit mobile number" />
      <ErrorMsg msg={error} />
      <PrimaryButton onClick={sendOtp} disabled={loading || phone.length < 8}>
        {loading ? <Loader2 size={16} style={{animation:"spin 1s linear infinite"}} /> : "Send OTP"}
      </PrimaryButton>
      <div style={{ fontSize: 11.5, color: COLORS.muted, marginTop: 12, textAlign: "center" }}>
        Note: SMS OTP requires a phone provider (e.g. Twilio) to be connected in your Supabase project settings before this works live.
      </div>
    </Shell>
  );
}

/* --------------------------- Doctor Application --------------------------- */
function DoctorApply({ profile, onDone, onSkip }) {
  const [specialty, setSpecialty] = useState("");
  const [clinicName, setClinicName] = useState("");
  const [clinicAddress, setClinicAddress] = useState("");
  const [fee, setFee] = useState("");
  const [docs, setDocs] = useState({ medical_registration: null, id_proof: null, degree_certificate: null, clinic_registration: null });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const setDoc = (key, file) => setDocs(prev => ({ ...prev, [key]: file }));

  const apply = async () => {
    setError("");
    if (!docs.medical_registration || !docs.id_proof || !docs.degree_certificate) {
      setError("Please upload the 3 required documents before submitting.");
      return;
    }
    setLoading(true);
    try {
      const uploadedPaths = {};
      for (const key of ["medical_registration","id_proof","degree_certificate","clinic_registration"]) {
        const file = docs[key];
        if (!file) continue;
        const ext = file.name.split(".").pop();
        const path = `${profile.id}/${key}.${ext}`;
        const { error: eUp } = await supabase.storage.from("doctor-documents").upload(path, file, { upsert: true });
        if (eUp) throw eUp;
        uploadedPaths[key] = path;
      }
      const { error: e1 } = await supabase.from("doctors").insert({
        profile_id: profile.id, specialty, clinic_name: clinicName, clinic_address: clinicAddress,
        fee: Number(fee) || 0, verified: false,
        doc_medical_registration: uploadedPaths.medical_registration,
        doc_id_proof: uploadedPaths.id_proof,
        doc_degree_certificate: uploadedPaths.degree_certificate,
        doc_clinic_registration: uploadedPaths.clinic_registration || null,
      });
      if (e1) throw e1;
      const { error: e2 } = await supabase.from("profiles").update({ role: "doctor" }).eq("id", profile.id);
      if (e2) throw e2;
      onDone();
    } catch (e) {
      setError(e.message || "Could not submit application.");
    } finally {
      setLoading(false);
    }
  };

  const DocUpload = ({ docKey, label, required }) => (
    <div style={{ marginBottom: 14 }}>
      <div style={{ fontSize: 12.5, fontWeight: 700, color: COLORS.muted, marginBottom: 6 }}>
        {label} {required ? <span style={{color:COLORS.danger}}>*</span> : <span style={{fontWeight:400}}>(optional)</span>}
      </div>
      <label style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 14px", borderRadius: 12, border: `1.5px dashed ${COLORS.border}`, cursor: "pointer", fontSize: 13, color: docs[docKey] ? COLORS.text : COLORS.muted }}>
        <Upload size={17} color={COLORS.primary} />
        {docs[docKey] ? docs[docKey].name : "Tap to upload a photo or PDF"}
        <input type="file" accept="image/*,.pdf" style={{ display: "none" }} onChange={e => setDoc(docKey, e.target.files?.[0] || null)} />
      </label>
    </div>
  );

  return (
    <Shell title="Welcome!" onBack={onSkip}>
      <div style={{ background: "#fff", border: `1.5px solid ${COLORS.border}`, borderRadius: 16, padding: 16, marginBottom: 18 }}>
        <div style={{ fontWeight: 800, marginBottom: 6 }}>Are you a doctor?</div>
        <div style={{ fontSize: 13, color: COLORS.muted }}>Apply below and an admin will review and verify your listing before it goes live. Or skip to continue as a patient.</div>
      </div>
      <TextField label="Specialty" value={specialty} onChange={e => setSpecialty(e.target.value)} placeholder="e.g. Cardiologist" />
      <TextField label="Clinic Name" value={clinicName} onChange={e => setClinicName(e.target.value)} placeholder="Your clinic's name" />
      <TextField label="Clinic Address" value={clinicAddress} onChange={e => setClinicAddress(e.target.value)} placeholder="Purnea, Bihar" />
      <TextField label="Consultation Fee (₹)" type="number" value={fee} onChange={e => setFee(e.target.value)} placeholder="500" />
      <DocUpload docKey="medical_registration" label="Medical Registration Certificate" required />
      <DocUpload docKey="id_proof" label="Government ID Proof" required />
      <DocUpload docKey="degree_certificate" label="Degree Certificate" required />
      <DocUpload docKey="clinic_registration" label="Clinic Registration" required={false} />
      <ErrorMsg msg={error} />
      <PrimaryButton onClick={apply} disabled={loading || !specialty || !clinicName}>
        {loading ? <Loader2 size={16} style={{animation:"spin 1s linear infinite"}} /> : "Submit Application"}
      </PrimaryButton>
      <button onClick={onSkip} style={{ width: "100%", marginTop: 10, background: "none", border: "none", color: COLORS.muted, fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
        Skip, continue as Patient
      </button>
    </Shell>
  );
}

function PendingDoctorScreen({ onContinueAsPatient }) {
  return (
    <Shell title="Application Submitted">
      <div style={{ textAlign: "center", padding: "20px 10px" }}>
        <CheckCircle2 size={48} color={COLORS.success} style={{ margin: "0 auto 14px" }} />
        <div style={{ fontWeight: 700, marginBottom: 8 }}>Thanks! Your doctor application is pending review.</div>
        <div style={{ fontSize: 13, color: COLORS.muted, marginBottom: 20 }}>An admin needs to verify your details before your profile appears publicly and your doctor dashboard unlocks.</div>
        <PrimaryButton onClick={onContinueAsPatient}>Continue as Patient for now</PrimaryButton>
      </div>
    </Shell>
  );
}
