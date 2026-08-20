import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import {
  Search, MapPin, Star, Clock, Calendar, User, Bell, Home as HomeIcon, Users,
  Stethoscope, CheckCircle2, XCircle, ChevronRight, ChevronLeft, Filter, Heart,
  LogOut, Settings, Plus, Minus, Pencil, Trash2, ArrowLeft, Phone, Mail, Award,
  Briefcase, IndianRupee, TrendingUp, AlertCircle, ShieldCheck, Ban, PlayCircle,
  RefreshCw, FileText, MoreHorizontal, X, Check, ChevronDown, Video, Building2,
  LayoutGrid, ClipboardList, ListChecks, UserCog, Tags, Hospital, MessageSquare,
  BarChart3, CalendarClock, CalendarX2, CalendarCheck2, ShieldAlert, Loader2,
  Upload, ThumbsUp, BellRing, ChevronUp, Sparkles
} from "lucide-react";

/* ============================================================================
   CONSTANTS & TOKENS
============================================================================ */
const SPECIALTIES = [
  { name: "General Physician", icon: Stethoscope },
  { name: "Cardiologist", icon: Heart },
  { name: "Dermatologist", icon: Sparkles },
  { name: "Pediatrician", icon: Users },
  { name: "Orthopedic", icon: Briefcase },
  { name: "Gynecologist", icon: User },
  { name: "ENT Specialist", icon: Award },
  { name: "Neurologist", icon: BarChart3 },
  { name: "Dentist", icon: ShieldCheck },
  { name: "Psychiatrist", icon: MessageSquare },
  { name: "Ophthalmologist", icon: Eye_ },
  { name: "Urologist", icon: ClipboardList },
  { name: "Gastroenterologist", icon: ListChecks },
  { name: "Endocrinologist", icon: TrendingUp },
  { name: "Pulmonologist", icon: FileText },
];
function Eye_(props){ return <Award {...props} />; }

const AREAS = ["Purnea Court Area","Line Bazar","Bhatta Bazar","Kasba","Malahi Pakri","Harinagar","Raniganj","Madhepura Road","Sadar Hospital Area","Mansa Chowk","Naugharia","Dhamdaha Road","Baisi Road","Kosi Road","Jalalgarh Road"];
const CITY = "Purnea";

const FIRST_NAMES = ["Rahul","Amit","Rajan","Vikash","Sanjay","Deepak","Manoj","Suresh","Anil","Rajesh","Arvind","Santosh","Mukesh","Dinesh","Ramesh","Naresh","Umesh","Binod","Pramod","Ashok","Rohit","Vivek","Abhishek","Nitish","Ajay","Vijay","Rakesh","Sunil","Arun","Shyam","Priya","Neha","Pooja","Kavita","Sunita","Rekha","Manju","Sushma","Anita","Reeta","Nisha","Ritu","Seema","Geeta","Meena","Babita","Pushpa","Sarita","Usha","Laxmi","Poonam","Jyoti"];
const LAST_NAMES = ["Singh","Kumar","Sharma","Gupta","Yadav","Mishra","Thakur","Pandey","Jha","Tiwari","Sinha","Verma","Shah","Agarwal","Prasad","Chaudhary","Mandal","Das","Roy","Khan","Ansari","Hussain","Srivastava","Dubey","Chauhan","Patel","Giri","Rai","Mahto","Paswan"];
const CLINIC_TYPES = ["Nursing Home","Clinic","Hospital","Polyclinic","Health Centre","Medical Hall","Multispeciality Clinic","Child Care Centre","Eye Care Centre","Maternity Home"];
const QUALS = {
  "General Physician":"MBBS, MD (General Medicine)","Cardiologist":"MBBS, MD, DM (Cardiology)","Dermatologist":"MBBS, MD (Dermatology)",
  "Pediatrician":"MBBS, MD (Pediatrics)","Orthopedic":"MBBS, MS (Orthopedics)","Gynecologist":"MBBS, MS (Obs & Gynae)",
  "ENT Specialist":"MBBS, MS (ENT)","Neurologist":"MBBS, MD, DM (Neurology)","Dentist":"BDS, MDS",
  "Psychiatrist":"MBBS, MD (Psychiatry)","Ophthalmologist":"MBBS, MS (Ophthalmology)","Urologist":"MBBS, MS, MCh (Urology)",
  "Gastroenterologist":"MBBS, MD, DM (Gastroenterology)","Endocrinologist":"MBBS, MD, DM (Endocrinology)","Pulmonologist":"MBBS, MD (Pulmonology)"
};

const COLORS = {
  bg: "#F6F9FB", surface: "#FFFFFF", primary: "#0D9C88", primaryDark: "#0A7A6A", primarySoft: "#E4F7F3",
  secondary: "#1A6FC4", secondarySoft: "#EAF1FF", text: "#0F1B2D", muted: "#67788F", border: "#E5EBF2",
  success: "#1AA152", warning: "#D68A0C", danger: "#DC3B3B", dangerSoft: "#FDECEC", warnSoft: "#FDF3E0", successSoft: "#E7F7EE"
};

/* ============================================================================
   UTILITIES
============================================================================ */
let __id = 1;
const uid = (p="id") => `${p}_${Date.now().toString(36)}_${(__id++).toString(36)}`;
const rnd = (a,b) => Math.floor(Math.random()*(b-a+1))+a;
const pick = (arr) => arr[rnd(0,arr.length-1)];
const round1 = (n) => Math.round(n*10)/10;
const pad2 = (n) => String(n).padStart(2,"0");

function fmtDate(d){ // yyyy-mm-dd
  return `${d.getFullYear()}-${pad2(d.getMonth()+1)}-${pad2(d.getDate())}`;
}
function fmtDateLabel(dateStr){
  const d = new Date(dateStr+"T00:00:00");
  const today = new Date(); today.setHours(0,0,0,0);
  const tmr = new Date(today); tmr.setDate(tmr.getDate()+1);
  if (fmtDate(d)===fmtDate(today)) return "Today";
  if (fmtDate(d)===fmtDate(tmr)) return "Tomorrow";
  return d.toLocaleDateString("en-IN",{ weekday:"short", day:"numeric", month:"short" });
}
function fmtTime12(t){
  const [h,m] = t.split(":").map(Number);
  const ampm = h>=12?"PM":"AM";
  const hh = h%12===0?12:h%12;
  return `${hh}:${pad2(m)} ${ampm}`;
}
function minutesToTime(mins){
  const h = Math.floor(mins/60), m = mins%60;
  return `${pad2(h)}:${pad2(m)}`;
}
function timeToMinutes(t){
  const [h,m] = t.split(":").map(Number);
  return h*60+m;
}
function next14Days(){
  const out = [];
  const d = new Date();
  for(let i=0;i<14;i++){
    const dd = new Date(d); dd.setDate(d.getDate()+i);
    out.push(fmtDate(dd));
  }
  return out;
}
function dayOfWeek(dateStr){
  return new Date(dateStr+"T00:00:00").getDay(); // 0 Sun ... 6 Sat
}
const DAY_NAMES = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

function timeAgo(iso){
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff/60000);
  if (m<1) return "just now";
  if (m<60) return `${m}m ago`;
  const h = Math.floor(m/60);
  if (h<24) return `${h}h ago`;
  const d = Math.floor(h/24);
  return `${d}d ago`;
}

/* ============================================================================
   SEED DATA GENERATION
============================================================================ */
function generateDoctors(count){
  const docs = [];
  const usedNames = new Set();
  for(let i=0;i<count;i++){
    let name;
    do { name = `Dr. ${pick(FIRST_NAMES)} ${pick(LAST_NAMES)}`; } while(usedNames.has(name));
    usedNames.add(name);
    const spec = SPECIALTIES[i % SPECIALTIES.length].name;
    const area = pick(AREAS);
    const exp = rnd(2,32);
    const fee = rnd(6,30)*50;
    const rating = round1(3.4 + Math.random()*1.6);
    const reviewCount = rnd(6,340);
    const shift = pick([["09:00","17:00"],["10:00","18:00"],["11:00","19:00"],["09:30","16:30"],["12:00","20:00"]]);
    const slotDuration = pick([15,20,30]);
    const workingDaysOpt = pick([[1,2,3,4,5,6],[1,2,3,4,5],[0,1,2,3,4,5],[1,3,5,6],[1,2,3,4,5,6]]);
    const statusRoll = Math.random();
    const status = statusRoll < 0.08 ? "pending" : statusRoll < 0.11 ? "rejected" : "approved";
    const consultTypes = Math.random()<0.65 ? ["In-Clinic","Video Consult"] : ["In-Clinic"];
    docs.push({
      id: uid("doc"),
      name, specialization: spec, qualification: QUALS[spec],
      experience: exp, regNo: `DMC-${rnd(10000,99999)}`,
      photo: `https://i.pravatar.cc/300?img=${(i%70)+1}`,
      clinicName: `${area} ${pick(CLINIC_TYPES)}`,
      address: `${rnd(1,400)}, ${area}, ${CITY}`,
      area, city: CITY,
      fee, rating, reviewCount,
      about: `${name} is a dedicated ${spec.toLowerCase()} with ${exp} years of experience, focused on patient-first, evidence-based care at ${area}.`,
      startTime: shift[0], endTime: shift[1],
      breakStart: "13:00", breakEnd: "13:45",
      slotDuration, workingDays: workingDaysOpt,
      blockedDates: [],
      status,
      consultTypes,
      currentTokenByDate: {},
      createdAt: new Date(Date.now()-rnd(1,300)*86400000).toISOString(),
      verificationDocs: status==="pending" ? ["medical_license.pdf","id_proof.pdf"] : ["medical_license.pdf","id_proof.pdf","clinic_registration.pdf"],
    });
  }
  return docs;
}

function generateReviews(doctors, patients, appointments){
  const reviews = [];
  const completed = appointments.filter(a=>a.status==="completed");
  completed.forEach(a=>{
    if (Math.random()<0.7){
      const comments = [
        "Very attentive and explained everything clearly.",
        "Short waiting time, professional staff.",
        "Great experience, highly recommend this doctor.",
        "Doctor was patient and answered all my questions.",
        "Clinic was clean and well organized.",
        "Diagnosis was accurate, felt much better after treatment.",
        "Could improve on punctuality but overall good care.",
        "Excellent bedside manner, would visit again."
      ];
      reviews.push({
        id: uid("rev"), doctorId: a.doctorId, patientId: a.patientId, appointmentId: a.id,
        rating: rnd(3,5), comment: pick(comments), date: a.date
      });
    }
  });
  return reviews;
}

function generateSamplePatients(n){
  const pats = [];
  for(let i=0;i<n;i++){
    const name = `${pick(FIRST_NAMES)} ${pick(LAST_NAMES)}`;
    pats.push({
      id: uid("pat"), name, phone: `9${rnd(100000000,999999999)}`,
      email: `${name.split(" ")[0].toLowerCase()}${rnd(10,99)}@mail.com`,
      dob: `${rnd(1965,2018)}-${pad2(rnd(1,12))}-${pad2(rnd(1,28))}`,
      gender: pick(["Male","Female"]), favorites: [], createdAt: new Date().toISOString()
    });
  }
  return pats;
}

function generateSampleAppointments(doctors, patients){
  const appts = [];
  const approvedDocs = doctors.filter(d=>d.status==="approved");
  const today = new Date();
  // past history (completed/cancelled)
  for(let i=0;i<140;i++){
    const doc = pick(approvedDocs);
    const pat = pick(patients);
    const past = new Date(today); past.setDate(today.getDate()-rnd(1,60));
    const date = fmtDate(past);
    const slot = minutesToTime(timeToMinutes(doc.startTime)+rnd(0,6)*doc.slotDuration);
    const statusRoll = Math.random();
    const status = statusRoll<0.82?"completed":statusRoll<0.94?"cancelled":"rejected";
    appts.push({
      id: uid("apt"), doctorId: doc.id, patientId: pat.id, date, time: slot,
      type: pick(doc.consultTypes), status, tokenNumber: rnd(1,20),
      fee: doc.fee, reason: pick(["Fever & cold","Routine checkup","Follow-up visit","Skin rash","Back pain","General consultation","Child vaccination","Headache"]),
      patientName: pat.name, patientPhone: pat.phone, patientAge: rnd(2,75), patientGender: pat.gender,
      createdAt: new Date(past.getTime()-86400000).toISOString(), rescheduled:false
    });
  }
  // today & upcoming (mixed statuses) - concentrate some on first 10 approved doctors for a lively demo
  const busyDocs = approvedDocs.slice(0,14);
  busyDocs.forEach(doc=>{
    const todayStr = fmtDate(today);
    let tokenCounter = 1;
    const numToday = rnd(4,9);
    for(let i=0;i<numToday;i++){
      const pat = pick(patients);
      const slot = minutesToTime(timeToMinutes(doc.startTime)+i*doc.slotDuration);
      const roll = Math.random();
      const status = roll<0.35?"completed":roll<0.55?"arrived":roll<0.85?"confirmed":"pending";
      appts.push({
        id: uid("apt"), doctorId: doc.id, patientId: pat.id, date: todayStr, time: slot,
        type: pick(doc.consultTypes), status, tokenNumber: tokenCounter++,
        fee: doc.fee, reason: pick(["Fever & cold","Routine checkup","Follow-up visit","Skin rash","Back pain","General consultation"]),
        patientName: pat.name, patientPhone: pat.phone, patientAge: rnd(2,75), patientGender: pat.gender,
        createdAt: new Date(Date.now()-rnd(1,5)*3600000).toISOString(), rescheduled:false
      });
    }
    doc.currentTokenByDate[todayStr] = Math.max(1, Math.floor(numToday*0.4));
  });
  // some upcoming days
  for(let i=0;i<60;i++){
    const doc = pick(approvedDocs);
    const pat = pick(patients);
    const future = new Date(today); future.setDate(today.getDate()+rnd(1,10));
    const date = fmtDate(future);
    const slot = minutesToTime(timeToMinutes(doc.startTime)+rnd(0,6)*doc.slotDuration);
    appts.push({
      id: uid("apt"), doctorId: doc.id, patientId: pat.id, date, time: slot,
      type: pick(doc.consultTypes), status: pick(["pending","confirmed"]), tokenNumber: rnd(1,10),
      fee: doc.fee, reason: pick(["Routine checkup","Follow-up visit","General consultation","Skin rash"]),
      patientName: pat.name, patientPhone: pat.phone, patientAge: rnd(2,75), patientGender: pat.gender,
      createdAt: new Date().toISOString(), rescheduled:false
    });
  }
  return appts;
}

/* ============================================================================
   STORAGE LAYER (simulated backend using persistent key-value storage)
============================================================================ */
const K = {
  doctors: "aayurahi_purnea_doctors_v1", patients: "aayurahi_purnea_patients_v1", appointments: "aayurahi_purnea_appointments_v1",
  reviews: "aayurahi_purnea_reviews_v1", notifications: "aayurahi_purnea_notifications_v1", specialties: "aayurahi_purnea_specialties_v1",
  seeded: "aayurahi_purnea_seeded_v1"
};
/* Real-browser storage layer (uses localStorage — works on any website).
   NOTE: localStorage is per-browser only. To share data live across every
   patient/doctor/admin device, swap this layer for a real backend like
   Supabase — see the "Go Live With a Real Database" section in README.md. */
async function storageGet(key, shared){
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch(e){ return null; }
}
async function storageSet(key, value, shared){
  try { window.localStorage.setItem(key, JSON.stringify(value)); } catch(e){ /* noop */ }
}

/* ============================================================================
   SMALL UI PRIMITIVES
============================================================================ */
function GlobalStyle(){
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@500;700;800&family=Inter:wght@400;500;600;700&display=swap');
      .mq-root { font-family:'Inter',system-ui,sans-serif; background:${COLORS.bg}; color:${COLORS.text}; min-height:100vh; }
      .mq-root * { box-sizing:border-box; }
      .mq-display { font-family:'Manrope',system-ui,sans-serif; }
      .mq-scroll::-webkit-scrollbar{ display:none; }
      .mq-scroll{ -ms-overflow-style:none; scrollbar-width:none; }
      .mq-btn { border:none; cursor:pointer; font-family:inherit; transition:all .15s ease; }
      .mq-btn:active{ transform:scale(0.97); }
      .mq-fade-in { animation: mqFadeIn .28s ease; }
      @keyframes mqFadeIn { from{opacity:0; transform:translateY(6px);} to{opacity:1; transform:translateY(0);} }
      @keyframes mqPulse { 0%{box-shadow:0 0 0 0 rgba(36,97,232,0.35);} 70%{box-shadow:0 0 0 10px rgba(36,97,232,0);} 100%{box-shadow:0 0 0 0 rgba(36,97,232,0);} }
      .mq-pulse{ animation: mqPulse 2s infinite; }
      .mq-input:focus, .mq-btn:focus-visible { outline:2px solid ${COLORS.primary}; outline-offset:1px; }
      .mq-card-hover:hover{ box-shadow:0 6px 20px rgba(15,27,45,0.08); transform:translateY(-1px); }
      @media (prefers-reduced-motion: reduce){ .mq-pulse, .mq-fade-in{ animation:none; } }
    `}</style>
  );
}

function Avatar({ src, name, size=44 }){
  const [err,setErr] = useState(false);
  if (!src || err){
    const initials = (name||"D").split(" ").filter(w=>w.length&&w[0]!=='.').slice(0,2).map(w=>w[0]).join("").toUpperCase();
    return <div style={{width:size,height:size,borderRadius:"50%",background:COLORS.primarySoft,color:COLORS.primary,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:size*0.36,flexShrink:0}}>{initials}</div>;
  }
  return <img src={src} onError={()=>setErr(true)} alt={name} style={{width:size,height:size,borderRadius:"50%",objectFit:"cover",flexShrink:0,border:`2px solid ${COLORS.surface}`}} />;
}

function Badge({ children, tone="default" }){
  const tones = {
    default:{bg:"#F1F5F9",fg:COLORS.muted}, primary:{bg:COLORS.primarySoft,fg:COLORS.primary},
    success:{bg:COLORS.successSoft,fg:COLORS.success}, warning:{bg:COLORS.warnSoft,fg:COLORS.warning},
    danger:{bg:COLORS.dangerSoft,fg:COLORS.danger}, secondary:{bg:COLORS.secondarySoft,fg:COLORS.secondary}
  };
  const t = tones[tone]||tones.default;
  return <span style={{background:t.bg,color:t.fg,fontSize:12,fontWeight:700,padding:"4px 10px",borderRadius:20,display:"inline-flex",alignItems:"center",gap:4,whiteSpace:"nowrap"}}>{children}</span>;
}

function STATUS_TONE(s){
  return { pending:"warning", confirmed:"primary", arrived:"secondary", completed:"success", cancelled:"danger", rejected:"danger", rescheduled:"warning" }[s] || "default";
}

function Btn({ children, onClick, variant="primary", size="md", full=false, icon:Icon, disabled=false, style={} }){
  const sizes = { sm:{ padding:"8px 12px", fontSize:13 }, md:{ padding:"11px 16px", fontSize:14.5 }, lg:{ padding:"14px 20px", fontSize:15.5 } };
  const variants = {
    primary:{ background: disabled? "#B9C7E8": COLORS.primary, color:"#fff" },
    secondary:{ background: disabled? "#BFE3DB": COLORS.secondary, color:"#fff" },
    outline:{ background:"transparent", color:COLORS.primary, border:`1.5px solid ${COLORS.primary}` },
    ghost:{ background:"transparent", color:COLORS.text },
    danger:{ background: disabled? "#F3C6C6": COLORS.danger, color:"#fff" },
    dangerOutline:{ background:"transparent", color:COLORS.danger, border:`1.5px solid ${COLORS.danger}` },
    subtle:{ background:"#F1F5F9", color:COLORS.text }
  };
  return (
    <button className="mq-btn" disabled={disabled} onClick={onClick} style={{
      ...sizes[size], ...variants[variant], borderRadius:12, fontWeight:700, width: full?"100%":"auto",
      display:"inline-flex", alignItems:"center", justifyContent:"center", gap:7, cursor: disabled?"not-allowed":"pointer", ...style
    }}>
      {Icon && <Icon size={size==="sm"?15:17} />}{children}
    </button>
  );
}

function Card({ children, style={}, onClick, hover=false }){
  return (
    <div onClick={onClick} className={hover?"mq-card-hover":""} style={{
      background:COLORS.surface, borderRadius:18, border:`1px solid ${COLORS.border}`,
      padding:16, transition:"all .15s ease", cursor:onClick?"pointer":"default", ...style
    }}>{children}</div>
  );
}

function Field({ label, children, hint }){
  return (
    <div style={{marginBottom:14}}>
      {label && <div style={{fontSize:13,fontWeight:700,marginBottom:6,color:COLORS.text}}>{label}</div>}
      {children}
      {hint && <div style={{fontSize:12,color:COLORS.muted,marginTop:4}}>{hint}</div>}
    </div>
  );
}
const inputStyle = { width:"100%", padding:"11px 13px", borderRadius:12, border:`1.5px solid ${COLORS.border}`, fontSize:14.5, fontFamily:"inherit", background:"#fff", color:COLORS.text };
function TextInput(props){ return <input className="mq-input" {...props} style={{...inputStyle, ...(props.style||{})}} />; }
function Select({ children, ...props }){ return <select className="mq-input" {...props} style={{...inputStyle, ...(props.style||{})}}>{children}</select>; }
function TextArea(props){ return <textarea className="mq-input" {...props} style={{...inputStyle, resize:"vertical", minHeight:80, ...(props.style||{})}} />; }

function EmptyState({ icon:Icon=FileText, title, subtitle, action }){
  return (
    <div className="mq-fade-in" style={{textAlign:"center", padding:"48px 20px", color:COLORS.muted}}>
      <div style={{width:60,height:60,borderRadius:"50%",background:COLORS.primarySoft,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 14px"}}>
        <Icon size={26} color={COLORS.primary} />
      </div>
      <div style={{fontWeight:700, color:COLORS.text, fontSize:15.5, marginBottom:4}}>{title}</div>
      {subtitle && <div style={{fontSize:13.5, maxWidth:280, margin:"0 auto"}}>{subtitle}</div>}
      {action && <div style={{marginTop:16}}>{action}</div>}
    </div>
  );
}
function LoadingState({ label="Loading" }){
  return (
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"60px 20px",color:COLORS.muted,gap:10}}>
      <Loader2 className="mq-pulse" size={28} color={COLORS.primary} style={{animation:"spin 1s linear infinite"}} />
      <style>{`@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}`}</style>
      <div style={{fontSize:13.5,fontWeight:600}}>{label}...</div>
    </div>
  );
}

function Modal({ open, onClose, title, children, footer }){
  if (!open) return null;
  return (
    <div onClick={onClose} style={{position:"fixed",inset:0,background:"rgba(15,27,45,0.45)",zIndex:200,display:"flex",alignItems:"flex-end",justifyContent:"center"}}>
      <div onClick={e=>e.stopPropagation()} className="mq-fade-in" style={{background:"#fff",borderRadius:"20px 20px 0 0",width:"100%",maxWidth:480,maxHeight:"88vh",overflowY:"auto",padding:20}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
          <div className="mq-display" style={{fontWeight:800,fontSize:17}}>{title}</div>
          <button className="mq-btn" onClick={onClose} style={{background:"#F1F5F9",borderRadius:"50%",width:32,height:32,display:"flex",alignItems:"center",justifyContent:"center"}}><X size={17} /></button>
        </div>
        {children}
        {footer && <div style={{marginTop:16}}>{footer}</div>}
      </div>
    </div>
  );
}

function Toast({ toast }){
  if (!toast) return null;
  const tone = toast.tone||"success";
  const colors = { success:COLORS.success, danger:COLORS.danger, primary:COLORS.primary };
  return (
    <div className="mq-fade-in" style={{position:"fixed",top:16,left:"50%",transform:"translateX(-50%)",zIndex:400,
      background:colors[tone]||COLORS.text,color:"#fff",padding:"11px 18px",borderRadius:12,fontSize:13.5,fontWeight:700,
      boxShadow:"0 8px 24px rgba(0,0,0,0.18)", display:"flex",alignItems:"center",gap:8, maxWidth:"88%"}}>
      <CheckCircle2 size={16} /> {toast.msg}
    </div>
  );
}

function StatCard({ icon:Icon, label, value, tone="primary" }){
  const t = { primary:{bg:COLORS.primarySoft,fg:COLORS.primary}, secondary:{bg:COLORS.secondarySoft,fg:COLORS.secondary}, warning:{bg:COLORS.warnSoft,fg:COLORS.warning}, success:{bg:COLORS.successSoft,fg:COLORS.success}, danger:{bg:COLORS.dangerSoft,fg:COLORS.danger} }[tone];
  return (
    <Card style={{display:"flex",flexDirection:"column",gap:8, minWidth:0}}>
      <div style={{width:36,height:36,borderRadius:10,background:t.bg,display:"flex",alignItems:"center",justifyContent:"center"}}><Icon size={18} color={t.fg} /></div>
      <div className="mq-display" style={{fontSize:22,fontWeight:800}}>{value}</div>
      <div style={{fontSize:12.5,color:COLORS.muted,fontWeight:600}}>{label}</div>
    </Card>
  );
}

function StarRow({ rating, size=13 }){
  return (
    <span style={{display:"inline-flex",alignItems:"center",gap:3}}>
      <Star size={size} fill={COLORS.warning} color={COLORS.warning} />
      <span style={{fontWeight:700,fontSize:size+1}}>{rating}</span>
    </span>
  );
}

/* ============================================================================
   ROOT APP
============================================================================ */
export default function App(){
  const [booted, setBooted] = useState(false);
  const [session, setSession] = useState(null); // {role:'patient'|'doctor'|'admin', id}
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [specialties, setSpecialties] = useState([]);
  const [toast, setToast] = useState(null);

  const showToast = useCallback((msg, tone="success") => {
    setToast({ msg, tone });
    setTimeout(()=>setToast(null), 2600);
  }, []);

  // Boot: load or seed data
  useEffect(() => {
    (async () => {
      let doctorsData = await storageGet(K.doctors, true);
      let patientsData = await storageGet(K.patients, true);
      let apptsData = await storageGet(K.appointments, true);
      let reviewsData = await storageGet(K.reviews, true);
      let notifsData = await storageGet(K.notifications, true);
      let specsData = await storageGet(K.specialties, true);

      if (!doctorsData || doctorsData.length < 50) {
        doctorsData = generateDoctors(112);
        patientsData = generateSamplePatients(70);
        apptsData = generateSampleAppointments(doctorsData, patientsData);
        reviewsData = generateReviews(doctorsData, patientsData, apptsData);
        notifsData = [];
        specsData = SPECIALTIES.map(s=>s.name);
        await storageSet(K.doctors, doctorsData, true);
        await storageSet(K.patients, patientsData, true);
        await storageSet(K.appointments, apptsData, true);
        await storageSet(K.reviews, reviewsData, true);
        await storageSet(K.notifications, notifsData, true);
        await storageSet(K.specialties, specsData, true);
      }
      setDoctors(doctorsData||[]);
      setPatients(patientsData||[]);
      setAppointments(apptsData||[]);
      setReviews(reviewsData||[]);
      setNotifications(notifsData||[]);
      setSpecialties(specsData||SPECIALTIES.map(s=>s.name));

      const sess = await storageGet("aayurahi_purnea_session_v1", false);
      if (sess) setSession(sess);
      setBooted(true);
    })();
  }, []);

  // persistence helpers
  const persist = useCallback(async (key, setter, updater) => {
    setter(prev => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      storageSet(key, next, true);
      return next;
    });
  }, []);

  const updateDoctors = (updater) => persist(K.doctors, setDoctors, updater);
  const updatePatients = (updater) => persist(K.patients, setPatients, updater);
  const updateAppointments = (updater) => persist(K.appointments, setAppointments, updater);
  const updateReviews = (updater) => persist(K.reviews, setReviews, updater);
  const updateNotifications = (updater) => persist(K.notifications, setNotifications, updater);
  const updateSpecialties = (updater) => persist(K.specialties, setSpecialties, updater);

  const login = async (sess) => {
    setSession(sess);
    await storageSet("aayurahi_purnea_session_v1", sess, false);
  };
  const logout = async () => {
    setSession(null);
    await storageSet("aayurahi_purnea_session_v1", null, false);
  };

  const ctx = {
    doctors, patients, appointments, reviews, notifications, specialties,
    updateDoctors, updatePatients, updateAppointments, updateReviews, updateNotifications, updateSpecialties,
    showToast, session, login, logout
  };

  if (!booted) {
    return <div className="mq-root"><GlobalStyle /><LoadingState label="Setting up AayuRahi" /></div>;
  }

  return (
    <div className="mq-root" style={{maxWidth:520, margin:"0 auto", position:"relative", minHeight:"100vh", boxShadow:"0 0 40px rgba(15,27,45,0.06)"}}>
      <GlobalStyle />
      <Toast toast={toast} />
      {!session && <RoleSelect ctx={ctx} />}
      {session?.role === "patient" && <PatientApp ctx={ctx} />}
      {session?.role === "doctor" && <DoctorApp ctx={ctx} />}
      {session?.role === "admin" && <AdminApp ctx={ctx} />}
    </div>
  );
}

/* ============================================================================
   ROLE SELECT / AUTH
============================================================================ */
function RoleSelect({ ctx }){
  const [mode, setMode] = useState(null); // 'patient' | 'doctor' | 'admin'
  const [step, setStep] = useState("pick");

  if (mode === "patient") return <PatientLogin ctx={ctx} onBack={()=>setMode(null)} />;
  if (mode === "doctor") return <DoctorLogin ctx={ctx} onBack={()=>setMode(null)} />;
  if (mode === "admin") return <AdminLogin ctx={ctx} onBack={()=>setMode(null)} />;

  return (
    <div className="mq-fade-in" style={{minHeight:"100vh",display:"flex",flexDirection:"column",justifyContent:"center",padding:28,background:`linear-gradient(180deg, ${COLORS.primarySoft} 0%, ${COLORS.bg} 55%)`}}>
      <div style={{textAlign:"center",marginBottom:36}}>
        <div style={{width:64,height:64,borderRadius:18,background:COLORS.primary,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 14px",boxShadow:`0 10px 24px ${COLORS.primarySoft}`}}>
          <Stethoscope size={30} color="#fff" />
        </div>
        <div className="mq-display" style={{fontSize:26,fontWeight:800}}>AayuRahi</div>
        <div style={{color:COLORS.muted,fontSize:14,marginTop:4}}>Aapka swasth jeevan, hamare saath — Purnea</div>
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:12}}>
        <RoleCard icon={User} title="I'm a Patient" subtitle="Search doctors, book appointments & track your queue" onClick={()=>setMode("patient")} />
        <RoleCard icon={Stethoscope} title="I'm a Doctor" subtitle="Manage appointments, queue & your clinic profile" onClick={()=>setMode("doctor")} />
        <RoleCard icon={ShieldCheck} title="Admin" subtitle="Platform administration & oversight" onClick={()=>setMode("admin")} />
      </div>
    </div>
  );
}
function RoleCard({ icon:Icon, title, subtitle, onClick }){
  return (
    <button onClick={onClick} className="mq-btn mq-card-hover" style={{textAlign:"left",background:"#fff",border:`1.5px solid ${COLORS.border}`,borderRadius:18,padding:16,display:"flex",alignItems:"center",gap:14}}>
      <div style={{width:46,height:46,borderRadius:13,background:COLORS.primarySoft,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
        <Icon size={22} color={COLORS.primary} />
      </div>
      <div style={{flex:1}}>
        <div style={{fontWeight:800,fontSize:15}}>{title}</div>
        <div style={{fontSize:12.5,color:COLORS.muted,marginTop:2}}>{subtitle}</div>
      </div>
      <ChevronRight size={18} color={COLORS.muted} />
    </button>
  );
}
function AuthShell({ title, onBack, children }){
  return (
    <div className="mq-fade-in" style={{minHeight:"100vh",padding:20}}>
      <button className="mq-btn" onClick={onBack} style={{background:"none",display:"flex",alignItems:"center",gap:6,color:COLORS.muted,fontWeight:700,fontSize:13,marginBottom:18}}>
        <ArrowLeft size={16}/> Back
      </button>
      <div className="mq-display" style={{fontSize:22,fontWeight:800,marginBottom:18}}>{title}</div>
      {children}
    </div>
  );
}

function PatientLogin({ ctx, onBack }){
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const submit = () => {
    if (!name.trim() || phone.trim().length<10) { ctx.showToast("Enter your name and a valid 10-digit phone", "danger"); return; }
    let existing = ctx.patients.find(p=>p.phone === phone.trim());
    if (!existing){
      existing = { id: uid("pat"), name: name.trim(), phone: phone.trim(), email:"", dob:"", gender:"", favorites:[], createdAt:new Date().toISOString() };
      ctx.updatePatients(prev => [...prev, existing]);
    }
    ctx.login({ role:"patient", id: existing.id });
    ctx.showToast(`Welcome, ${existing.name.split(" ")[0]}!`);
  };
  return (
    <AuthShell title="Patient Login" onBack={onBack}>
      <Field label="Full name"><TextInput value={name} onChange={e=>setName(e.target.value)} placeholder="e.g. Aditi Sharma" /></Field>
      <Field label="Phone number" hint="We'll create your account if this is your first visit"><TextInput value={phone} onChange={e=>setPhone(e.target.value.replace(/\D/g,"").slice(0,10))} placeholder="10-digit mobile number" /></Field>
      <Btn full size="lg" onClick={submit}>Continue</Btn>
    </AuthShell>
  );
}

function DoctorLogin({ ctx, onBack }){
  const [tab, setTab] = useState("login");
  const [q, setQ] = useState("");
  const results = useMemo(()=> ctx.doctors.filter(d => d.name.toLowerCase().includes(q.toLowerCase())).slice(0,25), [q, ctx.doctors]);

  if (tab === "register") return <DoctorRegister ctx={ctx} onBack={()=>setTab("login")} onDone={()=>setTab("login")} />;

  return (
    <AuthShell title="Doctor Login" onBack={onBack}>
      <div style={{color:COLORS.muted,fontSize:13,marginBottom:14}}>Demo login — search your name from our directory to open your dashboard.</div>
      <div style={{position:"relative",marginBottom:14}}>
        <Search size={17} style={{position:"absolute",left:13,top:13,color:COLORS.muted}} />
        <TextInput value={q} onChange={e=>setQ(e.target.value)} placeholder="Search your name..." style={{paddingLeft:38}} />
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:8,maxHeight:360,overflowY:"auto"}} className="mq-scroll">
        {q && results.map(d => (
          <button key={d.id} className="mq-btn" onClick={()=>{ ctx.login({role:"doctor", id:d.id}); ctx.showToast(`Welcome back, ${d.name}`); }}
            style={{background:"#fff",border:`1px solid ${COLORS.border}`,borderRadius:14,padding:10,display:"flex",alignItems:"center",gap:10,textAlign:"left"}}>
            <Avatar src={d.photo} name={d.name} size={38} />
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontWeight:700,fontSize:13.5}}>{d.name}</div>
              <div style={{fontSize:11.5,color:COLORS.muted}}>{d.specialization}</div>
            </div>
            {d.status==="pending" && <Badge tone="warning">Pending</Badge>}
            {d.status==="rejected" && <Badge tone="danger">Rejected</Badge>}
          </button>
        ))}
        {q && results.length===0 && <div style={{color:COLORS.muted,fontSize:13,textAlign:"center",padding:20}}>No doctor found with that name.</div>}
      </div>
      <div style={{marginTop:18,textAlign:"center",fontSize:13,color:COLORS.muted}}>
        New doctor? <button className="mq-btn" onClick={()=>setTab("register")} style={{background:"none",color:COLORS.primary,fontWeight:800,textDecoration:"underline"}}>Register your clinic</button>
      </div>
    </AuthShell>
  );
}

function DoctorRegister({ ctx, onBack, onDone }){
  const [form, setForm] = useState({
    name:"", specialization: SPECIALTIES[0].name, qualification:"", experience:"", regNo:"",
    clinicName:"", address:"", area: AREAS[0], fee:"", startTime:"09:00", endTime:"17:00", photo:""
  });
  const set = (k,v) => setForm(f=>({...f,[k]:v}));
  const submit = () => {
    if (!form.name.trim() || !form.regNo.trim() || !form.clinicName.trim() || !form.fee){
      ctx.showToast("Please fill all required fields", "danger"); return;
    }
    const doc = {
      id: uid("doc"), name: form.name.startsWith("Dr.")?form.name:`Dr. ${form.name}`, specialization: form.specialization,
      qualification: form.qualification || QUALS[form.specialization], experience: Number(form.experience)||0,
      regNo: form.regNo, photo: `https://i.pravatar.cc/300?img=${rnd(1,70)}`, clinicName: form.clinicName,
      address: form.address, area: form.area, city: CITY, fee: Number(form.fee)||500, rating:0, reviewCount:0,
      about:`${form.name} recently joined AayuRahi and is awaiting verification.`, startTime: form.startTime, endTime: form.endTime,
      breakStart:"13:00", breakEnd:"13:45", slotDuration:20, workingDays:[1,2,3,4,5,6], blockedDates:[],
      status:"pending", consultTypes:["In-Clinic"], currentTokenByDate:{}, createdAt:new Date().toISOString(),
      verificationDocs:["medical_license.pdf","id_proof.pdf"]
    };
    ctx.updateDoctors(prev => [...prev, doc]);
    ctx.showToast("Registration submitted! Awaiting admin verification.");
    onDone();
  };
  return (
    <AuthShell title="Doctor Registration" onBack={onBack}>
      <Field label="Full name *"><TextInput value={form.name} onChange={e=>set("name",e.target.value)} placeholder="Your full name" /></Field>
      <Field label="Specialization *">
        <Select value={form.specialization} onChange={e=>set("specialization",e.target.value)}>
          {SPECIALTIES.map(s=><option key={s.name} value={s.name}>{s.name}</option>)}
        </Select>
      </Field>
      <Field label="Qualification"><TextInput value={form.qualification} onChange={e=>set("qualification",e.target.value)} placeholder={QUALS[form.specialization]} /></Field>
      <Field label="Years of experience"><TextInput type="number" value={form.experience} onChange={e=>set("experience",e.target.value)} placeholder="e.g. 8" /></Field>
      <Field label="Medical registration number *"><TextInput value={form.regNo} onChange={e=>set("regNo",e.target.value)} placeholder="e.g. DMC-12345" /></Field>
      <Field label="Clinic / hospital name *"><TextInput value={form.clinicName} onChange={e=>set("clinicName",e.target.value)} placeholder="e.g. Sunrise Health Centre" /></Field>
      <Field label="Address"><TextInput value={form.address} onChange={e=>set("address",e.target.value)} placeholder="Street, landmark" /></Field>
      <Field label="Area">
        <Select value={form.area} onChange={e=>set("area",e.target.value)}>{AREAS.map(a=><option key={a}>{a}</option>)}</Select>
      </Field>
      <Field label="Consultation fee (₹) *"><TextInput type="number" value={form.fee} onChange={e=>set("fee",e.target.value)} placeholder="e.g. 600" /></Field>
      <div style={{display:"flex",gap:10}}>
        <Field label="Start time" style={{flex:1}}><TextInput type="time" value={form.startTime} onChange={e=>set("startTime",e.target.value)} /></Field>
        <Field label="End time" style={{flex:1}}><TextInput type="time" value={form.endTime} onChange={e=>set("endTime",e.target.value)} /></Field>
      </div>
      <Field label="Verification documents">
        <div style={{border:`1.5px dashed ${COLORS.border}`,borderRadius:12,padding:16,textAlign:"center",color:COLORS.muted}}>
          <Upload size={20} style={{marginBottom:6}} /><div style={{fontSize:13}}>Medical license & ID proof (demo — no upload needed)</div>
        </div>
      </Field>
      <Btn full size="lg" onClick={submit}>Submit for Verification</Btn>
    </AuthShell>
  );
}

function AdminLogin({ ctx, onBack }){
  const [pw, setPw] = useState("");
  const submit = () => {
    if (pw !== "admin123"){ ctx.showToast("Incorrect password (hint: admin123)", "danger"); return; }
    ctx.login({ role:"admin", id:"admin" });
    ctx.showToast("Welcome, Admin");
  };
  return (
    <AuthShell title="Admin Login" onBack={onBack}>
      <Field label="Admin password" hint="Demo password: admin123">
        <TextInput type="password" value={pw} onChange={e=>setPw(e.target.value)} placeholder="Enter password" onKeyDown={e=>e.key==="Enter"&&submit()} />
      </Field>
      <Btn full size="lg" onClick={submit}>Login</Btn>
    </AuthShell>
  );
}

/* ============================================================================
   SHARED: BOTTOM NAV
============================================================================ */
function BottomNav({ items, active, onChange }){
  return (
    <div style={{position:"sticky",bottom:0,left:0,right:0,background:"#fff",borderTop:`1px solid ${COLORS.border}`,display:"flex",padding:"8px 4px calc(8px + env(safe-area-inset-bottom))",zIndex:50}}>
      {items.map(it => {
        const isActive = active===it.key;
        return (
          <button key={it.key} className="mq-btn" onClick={()=>onChange(it.key)} style={{flex:1,background:"none",display:"flex",flexDirection:"column",alignItems:"center",gap:3,padding:"6px 2px",position:"relative"}}>
            <it.icon size={21} color={isActive?COLORS.primary:COLORS.muted} strokeWidth={isActive?2.4:2} />
            <span style={{fontSize:10.5,fontWeight:isActive?800:600,color:isActive?COLORS.primary:COLORS.muted}}>{it.label}</span>
            {it.badge>0 && <span style={{position:"absolute",top:2,right:"28%",background:COLORS.danger,color:"#fff",fontSize:9,fontWeight:800,borderRadius:8,minWidth:14,height:14,display:"flex",alignItems:"center",justifyContent:"center",padding:"0 3px"}}>{it.badge}</span>}
          </button>
        );
      })}
    </div>
  );
}
function TopBar({ title, onBack, right }){
  return (
    <div style={{position:"sticky",top:0,zIndex:40,background:"#fff",borderBottom:`1px solid ${COLORS.border}`,padding:"14px 16px",display:"flex",alignItems:"center",gap:10}}>
      {onBack && <button className="mq-btn" onClick={onBack} style={{background:"#F1F5F9",borderRadius:"50%",width:32,height:32,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><ArrowLeft size={16} /></button>}
      <div className="mq-display" style={{fontWeight:800,fontSize:16.5,flex:1}}>{title}</div>
      {right}
    </div>
  );
}

/* ============================================================================
   PATIENT APP
============================================================================ */
function PatientApp({ ctx }){
  const patient = ctx.patients.find(p=>p.id===ctx.session.id);
  const [tab, setTab] = useState("home");
  const [view, setView] = useState({ name:"home" }); // stack-lite navigation
  const [search, setSearch] = useState("");

  const myAppts = ctx.appointments.filter(a=>a.patientId===patient?.id);
  const myNotifs = ctx.notifications.filter(n=>n.userId===patient?.id);
  const unread = myNotifs.filter(n=>!n.read).length;

  const goTab = (t) => { setTab(t); setView({name:t}); };

  const navItems = [
    { key:"home", label:"Home", icon:HomeIcon },
    { key:"search", label:"Search", icon:Search },
    { key:"appointments", label:"Appointments", icon:CalendarClock },
    { key:"notifications", label:"Alerts", icon:Bell, badge: unread },
    { key:"profile", label:"Profile", icon:User },
  ];

  if (!patient) return <LoadingState />;

  let content;
  if (view.name === "doctorProfile") content = <DoctorProfileView ctx={ctx} doctor={ctx.doctors.find(d=>d.id===view.doctorId)} patient={patient} onBack={()=>setView({name:tab})} onBook={(doc)=>setView({name:"booking", doctorId:doc.id})} />;
  else if (view.name === "booking") content = <BookingFlow ctx={ctx} doctor={ctx.doctors.find(d=>d.id===view.doctorId)} patient={patient} onDone={()=>{ setTab("appointments"); setView({name:"appointments"}); }} onBack={()=>setView({name:"doctorProfile", doctorId:view.doctorId})} />;
  else if (view.name === "appointmentDetail") content = <AppointmentDetail ctx={ctx} appt={ctx.appointments.find(a=>a.id===view.apptId)} patient={patient} onBack={()=>setView({name:"appointments"})} />;
  else if (tab === "home") content = <PatientHome ctx={ctx} patient={patient} onOpenDoctor={(d)=>setView({name:"doctorProfile", doctorId:d.id})} goSearch={(q)=>{ setSearch(q||""); goTab("search"); }} />;
  else if (tab === "search") content = <PatientSearch ctx={ctx} initialQuery={search} onOpenDoctor={(d)=>setView({name:"doctorProfile", doctorId:d.id})} />;
  else if (tab === "appointments") content = <PatientAppointments ctx={ctx} patient={patient} onOpen={(a)=>setView({name:"appointmentDetail", apptId:a.id})} onBookAgain={(doc)=>setView({name:"doctorProfile", doctorId:doc.id})} />;
  else if (tab === "notifications") content = <PatientNotifications ctx={ctx} patient={patient} />;
  else if (tab === "profile") content = <PatientProfile ctx={ctx} patient={patient} onOpenDoctor={(d)=>setView({name:"doctorProfile", doctorId:d.id})} />;

  return (
    <div style={{display:"flex",flexDirection:"column",minHeight:"100vh"}}>
      <div style={{flex:1}}>{content}</div>
      <BottomNav items={navItems} active={tab} onChange={goTab} />
    </div>
  );
}

function PatientHome({ ctx, patient, onOpenDoctor, goSearch }){
  const [q, setQ] = useState("");
  const approved = ctx.doctors.filter(d=>d.status==="approved");
  const featured = useMemo(()=> [...approved].sort((a,b)=>b.rating-a.rating).slice(0,10), [approved]);
  const submit = () => goSearch(q);
  return (
    <div className="mq-fade-in">
      <div style={{padding:"20px 16px 16px",background:`linear-gradient(180deg, ${COLORS.primarySoft}, ${COLORS.bg})`}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
          <div>
            <div style={{fontSize:12.5,color:COLORS.muted,fontWeight:600}}>Hello,</div>
            <div className="mq-display" style={{fontSize:19,fontWeight:800}}>{patient.name.split(" ")[0]} 👋</div>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:6,color:COLORS.muted,fontSize:12.5,fontWeight:600}}><MapPin size={14}/> {CITY}</div>
        </div>
        <div style={{position:"relative"}}>
          <Search size={18} style={{position:"absolute",left:14,top:14,color:COLORS.muted}} />
          <input className="mq-input" value={q} onChange={e=>setQ(e.target.value)} onKeyDown={e=>e.key==="Enter"&&submit()} placeholder="Search doctors, specialties, clinics..."
            style={{...inputStyle, paddingLeft:42, borderRadius:16, boxShadow:"0 4px 14px rgba(15,27,45,0.06)"}} />
        </div>
      </div>

      <div style={{padding:"18px 16px"}}>
        <SectionHeader title="Browse by Specialty" />
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:22}}>
          {SPECIALTIES.slice(0,8).map(s => (
            <button key={s.name} className="mq-btn" onClick={()=>goSearch(s.name)} style={{background:"#fff",border:`1px solid ${COLORS.border}`,borderRadius:16,padding:"12px 4px",display:"flex",flexDirection:"column",alignItems:"center",gap:6}}>
              <div style={{width:36,height:36,borderRadius:10,background:COLORS.primarySoft,display:"flex",alignItems:"center",justifyContent:"center"}}><s.icon size={17} color={COLORS.primary} /></div>
              <span style={{fontSize:10.5,fontWeight:700,textAlign:"center",lineHeight:1.2}}>{s.name.replace(" Specialist","")}</span>
            </button>
          ))}
        </div>

        <SectionHeader title="Top Rated Doctors" subtitle={`${approved.length} verified doctors nearby`} />
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          {featured.map(d => <DoctorCard key={d.id} doctor={d} onClick={()=>onOpenDoctor(d)} />)}
        </div>
      </div>
    </div>
  );
}
function SectionHeader({ title, subtitle, action }){
  return (
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:12}}>
      <div>
        <div className="mq-display" style={{fontWeight:800,fontSize:15.5}}>{title}</div>
        {subtitle && <div style={{fontSize:12,color:COLORS.muted,marginTop:2}}>{subtitle}</div>}
      </div>
      {action}
    </div>
  );
}

function DoctorCard({ doctor, onClick, onFav, isFav }){
  const nextSlotInfo = getNextAvailableLabel(doctor);
  return (
    <Card hover onClick={onClick} style={{display:"flex",gap:12}}>
      <Avatar src={doctor.photo} name={doctor.name} size={64} />
      <div style={{flex:1,minWidth:0}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:6}}>
          <div style={{minWidth:0}}>
            <div style={{fontWeight:800,fontSize:14.5,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{doctor.name}</div>
            <div style={{fontSize:12.5,color:COLORS.primary,fontWeight:700}}>{doctor.specialization}</div>
          </div>
          {onFav && (
            <button className="mq-btn" onClick={(e)=>{e.stopPropagation(); onFav();}} style={{background:"none",flexShrink:0}}>
              <Heart size={19} color={isFav?COLORS.danger:COLORS.muted} fill={isFav?COLORS.danger:"none"} />
            </button>
          )}
        </div>
        <div style={{fontSize:12,color:COLORS.muted,marginTop:4,display:"flex",gap:10,flexWrap:"wrap"}}>
          <span style={{display:"flex",alignItems:"center",gap:3}}><Briefcase size={11}/> {doctor.experience} yrs</span>
          <span style={{display:"flex",alignItems:"center",gap:3}}><MapPin size={11}/> {doctor.area}</span>
        </div>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:9}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <StarRow rating={doctor.rating} />
            <span style={{fontSize:11.5,color:COLORS.muted}}>({doctor.reviewCount})</span>
          </div>
          <div style={{fontWeight:800,fontSize:13.5,display:"flex",alignItems:"center"}}><IndianRupee size={12}/>{doctor.fee}</div>
        </div>
        <div style={{marginTop:8}}><Badge tone={nextSlotInfo.tone}><Clock size={11}/> {nextSlotInfo.label}</Badge></div>
      </div>
    </Card>
  );
}

function getNextAvailableLabel(doctor){
  if (doctor.blockedDates?.includes(fmtDate(new Date())) === false && doctor.workingDays.includes(dayOfWeek(fmtDate(new Date())))){
    return { label: "Available Today", tone: "success" };
  }
  for (let i=1;i<7;i++){
    const d = new Date(); d.setDate(d.getDate()+i);
    const ds = fmtDate(d);
    if (doctor.workingDays.includes(dayOfWeek(ds)) && !doctor.blockedDates?.includes(ds)){
      return { label: `Available ${fmtDateLabel(ds)}`, tone:"primary" };
    }
  }
  return { label:"Limited availability", tone:"warning" };
}

/* ---------- Patient Search ---------- */
function PatientSearch({ ctx, initialQuery="", onOpenDoctor }){
  const [q, setQ] = useState(initialQuery);
  const [showFilters, setShowFilters] = useState(false);
  const [spec, setSpec] = useState("All");
  const [area, setArea] = useState("All");
  const [maxFee, setMaxFee] = useState(3000);
  const [minExp, setMinExp] = useState(0);
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState("rating");
  useEffect(()=>setQ(initialQuery), [initialQuery]);

  const results = useMemo(() => {
    let list = ctx.doctors.filter(d=>d.status==="approved");
    if (q.trim()){
      const ql = q.toLowerCase();
      list = list.filter(d => d.name.toLowerCase().includes(ql) || d.specialization.toLowerCase().includes(ql) || d.area.toLowerCase().includes(ql) || d.clinicName.toLowerCase().includes(ql));
    }
    if (spec!=="All") list = list.filter(d=>d.specialization===spec);
    if (area!=="All") list = list.filter(d=>d.area===area);
    list = list.filter(d=>d.fee<=maxFee && d.experience>=minExp && d.rating>=minRating);
    if (sortBy==="rating") list = [...list].sort((a,b)=>b.rating-a.rating);
    if (sortBy==="fee_low") list = [...list].sort((a,b)=>a.fee-b.fee);
    if (sortBy==="fee_high") list = [...list].sort((a,b)=>b.fee-a.fee);
    if (sortBy==="experience") list = [...list].sort((a,b)=>b.experience-a.experience);
    return list;
  }, [ctx.doctors, q, spec, area, maxFee, minExp, minRating, sortBy]);

  return (
    <div className="mq-fade-in">
      <div style={{padding:"16px 16px 10px",position:"sticky",top:0,background:"#fff",zIndex:30,borderBottom:`1px solid ${COLORS.border}`}}>
        <div style={{display:"flex",gap:8}}>
          <div style={{position:"relative",flex:1}}>
            <Search size={17} style={{position:"absolute",left:13,top:12,color:COLORS.muted}} />
            <TextInput value={q} onChange={e=>setQ(e.target.value)} placeholder="Search doctors, specialty, area..." style={{paddingLeft:38}} />
          </div>
          <button className="mq-btn" onClick={()=>setShowFilters(true)} style={{background:COLORS.primarySoft,borderRadius:12,width:44,display:"flex",alignItems:"center",justifyContent:"center"}}>
            <Filter size={18} color={COLORS.primary} />
          </button>
        </div>
        <div className="mq-scroll" style={{display:"flex",gap:7,overflowX:"auto",marginTop:10,paddingBottom:2}}>
          {["All",...SPECIALTIES.map(s=>s.name)].map(s => (
            <button key={s} className="mq-btn" onClick={()=>setSpec(s)} style={{whiteSpace:"nowrap",background:spec===s?COLORS.primary:"#F1F5F9",color:spec===s?"#fff":COLORS.text,borderRadius:20,padding:"7px 13px",fontSize:12.5,fontWeight:700}}>{s}</button>
          ))}
        </div>
      </div>
      <div style={{padding:16}}>
        <div style={{fontSize:12.5,color:COLORS.muted,fontWeight:700,marginBottom:10}}>{results.length} doctors found</div>
        {results.length===0 ? (
          <EmptyState icon={Search} title="No doctors found" subtitle="Try adjusting your filters or search terms" action={<Btn variant="outline" onClick={()=>{setSpec("All");setArea("All");setMaxFee(3000);setMinExp(0);setMinRating(0);setQ("");}}>Clear filters</Btn>} />
        ) : (
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            {results.map(d => <DoctorCard key={d.id} doctor={d} onClick={()=>onOpenDoctor(d)} />)}
          </div>
        )}
      </div>

      <Modal open={showFilters} onClose={()=>setShowFilters(false)} title="Filter Doctors" footer={
        <div style={{display:"flex",gap:10}}>
          <Btn variant="outline" full onClick={()=>{setSpec("All");setArea("All");setMaxFee(3000);setMinExp(0);setMinRating(0);}}>Reset</Btn>
          <Btn full onClick={()=>setShowFilters(false)}>Apply</Btn>
        </div>
      }>
        <Field label="Location">
          <Select value={area} onChange={e=>setArea(e.target.value)}><option>All</option>{AREAS.map(a=><option key={a}>{a}</option>)}</Select>
        </Field>
        <Field label={`Max fee: ₹${maxFee}`}>
          <input type="range" min={200} max={3000} step={50} value={maxFee} onChange={e=>setMaxFee(Number(e.target.value))} style={{width:"100%"}} />
        </Field>
        <Field label={`Min experience: ${minExp} yrs`}>
          <input type="range" min={0} max={30} value={minExp} onChange={e=>setMinExp(Number(e.target.value))} style={{width:"100%"}} />
        </Field>
        <Field label={`Min rating: ${minRating}+`}>
          <input type="range" min={0} max={5} step={0.5} value={minRating} onChange={e=>setMinRating(Number(e.target.value))} style={{width:"100%"}} />
        </Field>
        <Field label="Sort by">
          <Select value={sortBy} onChange={e=>setSortBy(e.target.value)}>
            <option value="rating">Highest rated</option>
            <option value="fee_low">Fee: Low to High</option>
            <option value="fee_high">Fee: High to Low</option>
            <option value="experience">Most experienced</option>
          </Select>
        </Field>
      </Modal>
    </div>
  );
}

/* ---------- Doctor Profile ---------- */
function DoctorProfileView({ ctx, doctor, patient, onBack, onBook }){
  if (!doctor) return <LoadingState />;
  const docReviews = ctx.reviews.filter(r=>r.doctorId===doctor.id).slice().reverse();
  const isFav = patient.favorites?.includes(doctor.id);
  const toggleFav = () => {
    ctx.updatePatients(prev => prev.map(p => p.id===patient.id ? { ...p, favorites: isFav ? p.favorites.filter(id=>id!==doctor.id) : [...(p.favorites||[]), doctor.id] } : p));
    ctx.showToast(isFav?"Removed from favourites":"Added to favourites");
  };
  const nextInfo = getNextAvailableLabel(doctor);

  return (
    <div className="mq-fade-in">
      <TopBar title="Doctor Profile" onBack={onBack} right={
        <button className="mq-btn" onClick={toggleFav} style={{background:"#F1F5F9",borderRadius:"50%",width:32,height:32,display:"flex",alignItems:"center",justifyContent:"center"}}>
          <Heart size={16} color={isFav?COLORS.danger:COLORS.muted} fill={isFav?COLORS.danger:"none"} />
        </button>
      } />
      <div style={{padding:16}}>
        <Card style={{display:"flex",gap:14,marginBottom:14}}>
          <Avatar src={doctor.photo} name={doctor.name} size={78} />
          <div style={{flex:1}}>
            <div style={{fontWeight:800,fontSize:17}}>{doctor.name}</div>
            <div style={{color:COLORS.primary,fontWeight:700,fontSize:13}}>{doctor.specialization}</div>
            <div style={{fontSize:12.5,color:COLORS.muted,marginTop:3}}>{doctor.qualification}</div>
            <div style={{display:"flex",gap:10,marginTop:7,alignItems:"center"}}>
              <StarRow rating={doctor.rating} />
              <span style={{fontSize:11.5,color:COLORS.muted}}>({doctor.reviewCount} reviews)</span>
            </div>
          </div>
        </Card>

        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:14}}>
          <MiniStat icon={Briefcase} label="Experience" value={`${doctor.experience} yrs`} />
          <MiniStat icon={IndianRupee} label="Fee" value={`₹${doctor.fee}`} />
          <MiniStat icon={Clock} label="Slot" value={`${doctor.slotDuration} min`} />
        </div>

        <Card style={{marginBottom:14}}>
          <SectionHeader title="About" />
          <div style={{fontSize:13.5,color:COLORS.muted,lineHeight:1.6}}>{doctor.about}</div>
        </Card>

        <Card style={{marginBottom:14}}>
          <SectionHeader title="Clinic & Timings" />
          <div style={{display:"flex",gap:10,marginBottom:8}}>
            <Building2 size={16} color={COLORS.muted} style={{marginTop:1,flexShrink:0}} />
            <div>
              <div style={{fontWeight:700,fontSize:13.5}}>{doctor.clinicName}</div>
              <div style={{fontSize:12.5,color:COLORS.muted}}>{doctor.address}</div>
            </div>
          </div>
          <div style={{display:"flex",gap:10,marginBottom:8}}>
            <Clock size={16} color={COLORS.muted} style={{marginTop:1,flexShrink:0}} />
            <div style={{fontSize:12.5,color:COLORS.muted}}>
              {fmtTime12(doctor.startTime)} – {fmtTime12(doctor.endTime)} <br/>
              Working days: {doctor.workingDays.map(d=>DAY_NAMES[d]).join(", ")}
            </div>
          </div>
          <div style={{display:"flex",gap:10,marginBottom:4}}>
            <MapPin size={16} color={COLORS.muted} style={{marginTop:1,flexShrink:0}} />
            <div style={{fontSize:12.5,color:COLORS.muted}}>{doctor.area}, {doctor.city} — map preview unavailable in demo</div>
          </div>
          <div style={{borderRadius:12,height:110,background:`linear-gradient(135deg,${COLORS.primarySoft},${COLORS.secondarySoft})`,marginTop:8,display:"flex",alignItems:"center",justifyContent:"center",color:COLORS.primary,gap:6}}>
            <MapPin size={18}/> <span style={{fontWeight:700,fontSize:12.5}}>{doctor.area} map view</span>
          </div>
        </Card>

        <Card style={{marginBottom:14}}>
          <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
            {doctor.consultTypes.map(t => <Badge key={t} tone="secondary">{t==="Video Consult"?<Video size={11}/>:<Building2 size={11}/>} {t}</Badge>)}
          </div>
        </Card>

        <Card style={{marginBottom:90}}>
          <SectionHeader title="Patient Reviews" subtitle={`${docReviews.length} reviews`} />
          {docReviews.length===0 ? <div style={{fontSize:13,color:COLORS.muted}}>No reviews yet.</div> : (
            <div style={{display:"flex",flexDirection:"column",gap:12}}>
              {docReviews.slice(0,6).map(r => (
                <div key={r.id} style={{borderBottom:`1px solid ${COLORS.border}`,paddingBottom:10}}>
                  <div style={{display:"flex",justifyContent:"space-between"}}>
                    <StarRow rating={r.rating} size={12} />
                    <span style={{fontSize:11,color:COLORS.muted}}>{r.date}</span>
                  </div>
                  <div style={{fontSize:13,marginTop:5,color:COLORS.text}}>{r.comment}</div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      <div style={{position:"sticky",bottom:0,background:"#fff",borderTop:`1px solid ${COLORS.border}`,padding:14,display:"flex",gap:10,alignItems:"center"}}>
        <div style={{flex:1}}>
          <div style={{fontSize:11,color:COLORS.muted,fontWeight:600}}>{nextInfo.label}</div>
          <div style={{fontWeight:800,fontSize:16,display:"flex",alignItems:"center"}}><IndianRupee size={14}/>{doctor.fee}</div>
        </div>
        <Btn size="lg" icon={Calendar} onClick={()=>onBook(doctor)}>Book Appointment</Btn>
      </div>
    </div>
  );
}
function MiniStat({ icon:Icon, label, value }){
  return (
    <Card style={{textAlign:"center",padding:12}}>
      <Icon size={16} color={COLORS.primary} style={{marginBottom:5}} />
      <div style={{fontWeight:800,fontSize:13.5}}>{value}</div>
      <div style={{fontSize:10.5,color:COLORS.muted,fontWeight:600}}>{label}</div>
    </Card>
  );
}

/* ---------- Booking Flow ---------- */
function getSlotsForDate(doctor, date, appointments){
  if (!doctor.workingDays.includes(dayOfWeek(date))) return [];
  if (doctor.blockedDates?.includes(date)) return [];
  const startMin = timeToMinutes(doctor.startTime);
  const endMin = timeToMinutes(doctor.endTime);
  const breakStart = timeToMinutes(doctor.breakStart);
  const breakEnd = timeToMinutes(doctor.breakEnd);
  const dur = doctor.slotDuration;
  const taken = new Set(appointments.filter(a=>a.doctorId===doctor.id && a.date===date && !["cancelled","rejected"].includes(a.status)).map(a=>a.time));
  const now = new Date();
  const isToday = date === fmtDate(now);
  const nowMin = now.getHours()*60+now.getMinutes();
  const slots = [];
  for (let t=startMin; t+dur<=endMin; t+=dur){
    if (t>=breakStart && t<breakEnd) continue;
    if (isToday && t <= nowMin) continue;
    const time = minutesToTime(t);
    slots.push({ time, taken: taken.has(time) });
  }
  return slots;
}

function BookingFlow({ ctx, doctor, patient, onDone, onBack }){
  const [step, setStep] = useState(1);
  const [type, setType] = useState(doctor?.consultTypes?.[0] || "In-Clinic");
  const [date, setDate] = useState(null);
  const [time, setTime] = useState(null);
  const [form, setForm] = useState({ name: patient.name, phone: patient.phone, age:"", gender: patient.gender||"", reason:"" });
  const [confirmed, setConfirmed] = useState(null);

  if (!doctor) return <LoadingState />;
  const dates = next14Days().filter(d => doctor.workingDays.includes(dayOfWeek(d)) && !doctor.blockedDates?.includes(d));
  const slots = date ? getSlotsForDate(doctor, date, ctx.appointments) : [];

  const set = (k,v)=>setForm(f=>({...f,[k]:v}));

  const confirmBooking = () => {
    if (!form.name.trim() || form.phone.trim().length<10 || !form.age){
      ctx.showToast("Please complete all required fields","danger"); return;
    }
    const existingForDate = ctx.appointments.filter(a=>a.doctorId===doctor.id && a.date===date && !["cancelled","rejected"].includes(a.status));
    const tokenNumber = existingForDate.length + 1;
    const appt = {
      id: uid("apt"), doctorId: doctor.id, patientId: patient.id, date, time, type,
      status:"pending", tokenNumber, fee: doctor.fee, reason: form.reason || "General consultation",
      patientName: form.name, patientPhone: form.phone, patientAge: form.age, patientGender: form.gender,
      createdAt: new Date().toISOString(), rescheduled:false
    };
    ctx.updateAppointments(prev => [...prev, appt]);
    ctx.updateNotifications(prev => [...prev, {
      id: uid("notif"), userId: patient.id, role:"patient", type:"booking",
      message: `Appointment requested with ${doctor.name} on ${fmtDateLabel(date)} at ${fmtTime12(time)}. Token #${tokenNumber}.`,
      date: new Date().toISOString(), read:false
    }]);
    setConfirmed(appt);
    setStep(5);
  };

  if (step===5 && confirmed){
    return (
      <div className="mq-fade-in" style={{minHeight:"100vh",display:"flex",flexDirection:"column"}}>
        <TopBar title="Booking Confirmed" onBack={onDone} />
        <div style={{flex:1,padding:24,textAlign:"center",display:"flex",flexDirection:"column",alignItems:"center"}}>
          <div className="mq-pulse" style={{width:74,height:74,borderRadius:"50%",background:COLORS.successSoft,display:"flex",alignItems:"center",justifyContent:"center",marginTop:20,marginBottom:16}}>
            <CheckCircle2 size={38} color={COLORS.success} />
          </div>
          <div className="mq-display" style={{fontWeight:800,fontSize:19,marginBottom:4}}>Appointment Requested!</div>
          <div style={{color:COLORS.muted,fontSize:13.5,marginBottom:22}}>You'll be notified once {doctor.name} confirms your slot.</div>
          <Card style={{width:"100%",textAlign:"left"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
              <span style={{fontSize:12.5,color:COLORS.muted,fontWeight:700}}>Your Token Number</span>
              <Badge tone="primary">Pending confirmation</Badge>
            </div>
            <div className="mq-display" style={{fontSize:38,fontWeight:800,color:COLORS.primary,textAlign:"center",padding:"10px 0"}}>#{confirmed.tokenNumber}</div>
            <div style={{borderTop:`1px solid ${COLORS.border}`,paddingTop:12,display:"flex",flexDirection:"column",gap:8,fontSize:13}}>
              <Row icon={Stethoscope} label="Doctor" value={doctor.name} />
              <Row icon={Calendar} label="Date" value={fmtDateLabel(confirmed.date)} />
              <Row icon={Clock} label="Time" value={fmtTime12(confirmed.time)} />
              <Row icon={type==="Video Consult"?Video:Building2} label="Type" value={confirmed.type} />
              <Row icon={IndianRupee} label="Fee" value={`₹${confirmed.fee}`} />
            </div>
          </Card>
          <div style={{marginTop:20,width:"100%"}}><Btn full size="lg" onClick={onDone}>View My Appointments</Btn></div>
        </div>
      </div>
    );
  }

  const steps = ["Type","Date","Time","Details"];
  return (
    <div className="mq-fade-in" style={{minHeight:"100vh",display:"flex",flexDirection:"column"}}>
      <TopBar title="Book Appointment" onBack={step===1?onBack:()=>setStep(step-1)} />
      <div style={{padding:"12px 16px 0",display:"flex",gap:6}}>
        {steps.map((s,i)=>(
          <div key={s} style={{flex:1,height:4,borderRadius:4,background: i+1<=step?COLORS.primary:COLORS.border}} />
        ))}
      </div>
      <div style={{flex:1,padding:16}}>
        <Card style={{display:"flex",gap:10,marginBottom:18,alignItems:"center"}}>
          <Avatar src={doctor.photo} name={doctor.name} size={44} />
          <div><div style={{fontWeight:800,fontSize:13.5}}>{doctor.name}</div><div style={{fontSize:11.5,color:COLORS.muted}}>{doctor.specialization} · {doctor.clinicName}</div></div>
        </Card>

        {step===1 && (
          <div>
            <SectionHeader title="Select consultation type" />
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              {doctor.consultTypes.map(t => (
                <button key={t} className="mq-btn" onClick={()=>setType(t)} style={{textAlign:"left",background:type===t?COLORS.primarySoft:"#fff",border:`1.5px solid ${type===t?COLORS.primary:COLORS.border}`,borderRadius:14,padding:14,display:"flex",alignItems:"center",gap:12}}>
                  {t==="Video Consult"?<Video size={20} color={COLORS.primary}/>:<Building2 size={20} color={COLORS.primary}/>}
                  <div style={{flex:1}}>
                    <div style={{fontWeight:700,fontSize:14}}>{t}</div>
                    <div style={{fontSize:11.5,color:COLORS.muted}}>{t==="Video Consult"?"Consult from home via video call":"Visit the clinic in person"}</div>
                  </div>
                  {type===t && <CheckCircle2 size={18} color={COLORS.primary}/>}
                </button>
              ))}
            </div>
            <div style={{marginTop:24}}><Btn full size="lg" onClick={()=>setStep(2)}>Continue</Btn></div>
          </div>
        )}

        {step===2 && (
          <div>
            <SectionHeader title="Select date" />
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10}}>
              {dates.map(d => (
                <button key={d} className="mq-btn" onClick={()=>{setDate(d);setTime(null);}} style={{background:date===d?COLORS.primary:"#fff",color:date===d?"#fff":COLORS.text,border:`1.5px solid ${date===d?COLORS.primary:COLORS.border}`,borderRadius:14,padding:"12px 4px",textAlign:"center"}}>
                  <div style={{fontSize:11,fontWeight:600,opacity:0.85}}>{new Date(d+"T00:00:00").toLocaleDateString("en-IN",{weekday:"short"})}</div>
                  <div style={{fontWeight:800,fontSize:15}}>{new Date(d+"T00:00:00").getDate()}</div>
                  <div style={{fontSize:10,opacity:0.85}}>{new Date(d+"T00:00:00").toLocaleDateString("en-IN",{month:"short"})}</div>
                </button>
              ))}
            </div>
            <div style={{marginTop:24}}><Btn full size="lg" disabled={!date} onClick={()=>setStep(3)}>Continue</Btn></div>
          </div>
        )}

        {step===3 && (
          <div>
            <SectionHeader title={`Available slots — ${fmtDateLabel(date)}`} />
            {slots.length===0 ? <EmptyState icon={Clock} title="No slots available" subtitle="Please choose a different date" /> : (
              <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10}}>
                {slots.map(s => (
                  <button key={s.time} disabled={s.taken} className="mq-btn" onClick={()=>setTime(s.time)}
                    style={{background: s.taken?"#F1F5F9":time===s.time?COLORS.primary:"#fff",color: s.taken?COLORS.muted:time===s.time?"#fff":COLORS.text,
                      border:`1.5px solid ${s.taken?COLORS.border:time===s.time?COLORS.primary:COLORS.border}`,borderRadius:12,padding:"10px 4px",fontSize:12.5,fontWeight:700,
                      textDecoration:s.taken?"line-through":"none", cursor:s.taken?"not-allowed":"pointer"}}>
                    {fmtTime12(s.time)}
                  </button>
                ))}
              </div>
            )}
            <div style={{marginTop:24}}><Btn full size="lg" disabled={!time} onClick={()=>setStep(4)}>Continue</Btn></div>
          </div>
        )}

        {step===4 && (
          <div>
            <SectionHeader title="Patient details" />
            <Field label="Full name *"><TextInput value={form.name} onChange={e=>set("name",e.target.value)} /></Field>
            <Field label="Phone number *"><TextInput value={form.phone} onChange={e=>set("phone",e.target.value.replace(/\D/g,"").slice(0,10))} /></Field>
            <div style={{display:"flex",gap:10}}>
              <Field label="Age *" style={{flex:1}}><TextInput type="number" value={form.age} onChange={e=>set("age",e.target.value)} placeholder="Age" /></Field>
              <Field label="Gender" style={{flex:1}}>
                <Select value={form.gender} onChange={e=>set("gender",e.target.value)}><option value="">Select</option><option>Male</option><option>Female</option><option>Other</option></Select>
              </Field>
            </div>
            <Field label="Reason for visit"><TextArea value={form.reason} onChange={e=>set("reason",e.target.value)} placeholder="Briefly describe your symptoms or reason for consultation" /></Field>

            <Card style={{marginTop:6, marginBottom:18}}>
              <div style={{fontWeight:800,fontSize:13,marginBottom:8}}>Booking Summary</div>
              <Row icon={Calendar} label="Date" value={fmtDateLabel(date)} />
              <Row icon={Clock} label="Time" value={fmtTime12(time)} />
              <Row icon={type==="Video Consult"?Video:Building2} label="Type" value={type} />
              <Row icon={IndianRupee} label="Consultation fee" value={`₹${doctor.fee}`} />
            </Card>
            <Btn full size="lg" icon={CheckCircle2} onClick={confirmBooking}>Confirm Booking</Btn>
          </div>
        )}
      </div>
    </div>
  );
}
function Row({ icon:Icon, label, value }){
  return (
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
      <span style={{display:"flex",alignItems:"center",gap:6,color:COLORS.muted,fontSize:12.5}}><Icon size={13}/> {label}</span>
      <span style={{fontWeight:700,fontSize:12.5}}>{value}</span>
    </div>
  );
}

/* ---------- Patient Appointments ---------- */
function PatientAppointments({ ctx, patient, onOpen, onBookAgain }){
  const [tab, setTab] = useState("upcoming");
  const mine = ctx.appointments.filter(a=>a.patientId===patient.id);
  const upcoming = mine.filter(a=>["pending","confirmed","arrived"].includes(a.status)).sort((a,b)=> (a.date+a.time).localeCompare(b.date+b.time));
  const history = mine.filter(a=>["completed","cancelled","rejected"].includes(a.status)).sort((a,b)=> (b.date+b.time).localeCompare(a.date+a.time));
  const list = tab==="upcoming"?upcoming:history;

  return (
    <div className="mq-fade-in">
      <TopBar title="My Appointments" />
      <div style={{display:"flex",gap:8,padding:"14px 16px 0"}}>
        <TabBtn active={tab==="upcoming"} onClick={()=>setTab("upcoming")} label={`Upcoming (${upcoming.length})`} />
        <TabBtn active={tab==="history"} onClick={()=>setTab("history")} label="History" />
      </div>
      <div style={{padding:16}}>
        {list.length===0 ? (
          <EmptyState icon={CalendarClock} title={tab==="upcoming"?"No upcoming appointments":"No past appointments"} subtitle={tab==="upcoming"?"Book an appointment to see it here":"Your appointment history will appear here"} />
        ) : (
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            {list.map(a => {
              const doc = ctx.doctors.find(d=>d.id===a.doctorId);
              if (!doc) return null;
              return (
                <Card key={a.id} hover onClick={()=>onOpen(a)}>
                  <div style={{display:"flex",gap:10}}>
                    <Avatar src={doc.photo} name={doc.name} size={48} />
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                        <div style={{fontWeight:800,fontSize:13.5}}>{doc.name}</div>
                        <Badge tone={STATUS_TONE(a.status)}>{a.status}</Badge>
                      </div>
                      <div style={{fontSize:11.5,color:COLORS.muted}}>{doc.specialization}</div>
                      <div style={{display:"flex",gap:12,marginTop:6,fontSize:11.5,color:COLORS.muted}}>
                        <span style={{display:"flex",alignItems:"center",gap:3}}><Calendar size={11}/>{fmtDateLabel(a.date)}</span>
                        <span style={{display:"flex",alignItems:"center",gap:3}}><Clock size={11}/>{fmtTime12(a.time)}</span>
                        <span>Token #{a.tokenNumber}</span>
                      </div>
                    </div>
                  </div>
                  {tab==="history" && a.status==="completed" && <div style={{marginTop:10}}><Btn size="sm" variant="outline" full onClick={(e)=>{e.stopPropagation(); onBookAgain(doc);}}>Book Again</Btn></div>}
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
function TabBtn({ active, onClick, label }){
  return (
    <button className="mq-btn" onClick={onClick} style={{flex:1,padding:"9px 10px",borderRadius:10,background:active?COLORS.primary:"#F1F5F9",color:active?"#fff":COLORS.text,fontWeight:700,fontSize:12.5}}>{label}</button>
  );
}

function AppointmentDetail({ ctx, appt, patient, onBack }){
  const [showCancel, setShowCancel] = useState(false);
  const [showReschedule, setShowReschedule] = useState(false);
  const [showReview, setShowReview] = useState(false);
  if (!appt) return <LoadingState />;
  const doc = ctx.doctors.find(d=>d.id===appt.doctorId);
  const currentToken = doc?.currentTokenByDate?.[appt.date] || 0;
  const isToday = appt.date === fmtDate(new Date());
  const waitMins = Math.max(0, (appt.tokenNumber - currentToken)) * (doc?.slotDuration||15);
  const existingReview = ctx.reviews.find(r=>r.appointmentId===appt.id);

  const cancelAppt = () => {
    ctx.updateAppointments(prev => prev.map(a => a.id===appt.id ? {...a, status:"cancelled"} : a));
    ctx.updateNotifications(prev => [...prev, { id:uid("notif"), userId:patient.id, role:"patient", type:"cancel", message:`Your appointment with ${doc.name} on ${fmtDateLabel(appt.date)} was cancelled.`, date:new Date().toISOString(), read:false }]);
    ctx.showToast("Appointment cancelled");
    setShowCancel(false);
    onBack();
  };

  return (
    <div className="mq-fade-in">
      <TopBar title="Appointment Details" onBack={onBack} />
      <div style={{padding:16}}>
        {isToday && ["confirmed","arrived"].includes(appt.status) && (
          <Card style={{marginBottom:14, background:`linear-gradient(135deg, ${COLORS.primary}, ${COLORS.primaryDark})`,color:"#fff",border:"none"}}>
            <div style={{fontSize:11.5,fontWeight:700,opacity:0.85,marginBottom:8,display:"flex",alignItems:"center",gap:5}}><BellRing size={13}/> LIVE QUEUE STATUS</div>
            <div style={{display:"flex",justifyContent:"space-around",alignItems:"center",textAlign:"center"}}>
              <div>
                <div className="mq-display" style={{fontSize:30,fontWeight:800}}>{currentToken || "–"}</div>
                <div style={{fontSize:10.5,opacity:0.85}}>Now Serving</div>
              </div>
              <div style={{width:1,height:36,background:"rgba(255,255,255,0.3)"}} />
              <div>
                <div className="mq-display mq-pulse" style={{fontSize:30,fontWeight:800,borderRadius:8}}>{appt.tokenNumber}</div>
                <div style={{fontSize:10.5,opacity:0.85}}>Your Token</div>
              </div>
            </div>
            <div style={{textAlign:"center",marginTop:10,fontSize:12.5,fontWeight:700}}>
              Estimated wait: {waitMins<=0 ? "You're next!" : `~${waitMins} min`}
            </div>
          </Card>
        )}

        <Card style={{marginBottom:14,display:"flex",gap:12}}>
          <Avatar src={doc?.photo} name={doc?.name} size={56} />
          <div style={{flex:1}}>
            <div style={{fontWeight:800,fontSize:15}}>{doc?.name}</div>
            <div style={{fontSize:12,color:COLORS.primary,fontWeight:700}}>{doc?.specialization}</div>
            <div style={{marginTop:6}}><Badge tone={STATUS_TONE(appt.status)}>{appt.status}</Badge></div>
          </div>
        </Card>

        <Card style={{marginBottom:14}}>
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            <Row icon={Calendar} label="Date" value={fmtDateLabel(appt.date)} />
            <Row icon={Clock} label="Time" value={fmtTime12(appt.time)} />
            <Row icon={appt.type==="Video Consult"?Video:Building2} label="Type" value={appt.type} />
            <Row icon={IndianRupee} label="Fee" value={`₹${appt.fee}`} />
            <Row icon={FileText} label="Reason" value={appt.reason} />
            <Row icon={User} label="Patient" value={`${appt.patientName}, ${appt.patientAge}y`} />
          </div>
        </Card>

        {["pending","confirmed"].includes(appt.status) && (
          <div style={{display:"flex",gap:10,marginBottom:14}}>
            <Btn variant="outline" full onClick={()=>setShowReschedule(true)}>Reschedule</Btn>
            <Btn variant="dangerOutline" full onClick={()=>setShowCancel(true)}>Cancel</Btn>
          </div>
        )}

        {appt.status==="completed" && !existingReview && (
          <Btn full icon={Star} onClick={()=>setShowReview(true)}>Rate & Review</Btn>
        )}
        {appt.status==="completed" && existingReview && (
          <Card><div style={{fontWeight:700,fontSize:13,marginBottom:6}}>Your review</div><StarRow rating={existingReview.rating}/><div style={{fontSize:13,color:COLORS.muted,marginTop:6}}>{existingReview.comment}</div></Card>
        )}
      </div>

      <Modal open={showCancel} onClose={()=>setShowCancel(false)} title="Cancel Appointment">
        <div style={{fontSize:13.5,color:COLORS.muted,marginBottom:18}}>Are you sure you want to cancel this appointment with {doc?.name}? This action cannot be undone.</div>
        <div style={{display:"flex",gap:10}}>
          <Btn variant="subtle" full onClick={()=>setShowCancel(false)}>Keep it</Btn>
          <Btn variant="danger" full onClick={cancelAppt}>Yes, cancel</Btn>
        </div>
      </Modal>

      <RescheduleModal open={showReschedule} onClose={()=>setShowReschedule(false)} ctx={ctx} appt={appt} doctor={doc} patient={patient} />
      <ReviewModal open={showReview} onClose={()=>setShowReview(false)} ctx={ctx} appt={appt} patient={patient} />
    </div>
  );
}

function RescheduleModal({ open, onClose, ctx, appt, doctor, patient }){
  const [date, setDate] = useState(appt.date);
  const [time, setTime] = useState(null);
  useEffect(()=>{ if(open){ setDate(appt.date); setTime(null); } }, [open, appt]);
  if (!open || !doctor) return null;
  const dates = next14Days().filter(d => doctor.workingDays.includes(dayOfWeek(d)) && !doctor.blockedDates?.includes(d));
  const slots = getSlotsForDate(doctor, date, ctx.appointments.filter(a=>a.id!==appt.id));
  const submit = () => {
    if (!time) { ctx.showToast("Select a new time slot","danger"); return; }
    ctx.updateAppointments(prev => prev.map(a => a.id===appt.id ? {...a, date, time, status:"pending", rescheduled:true} : a));
    ctx.updateNotifications(prev => [...prev, { id:uid("notif"), userId:patient.id, role:"patient", type:"reschedule", message:`Appointment with ${doctor.name} rescheduled to ${fmtDateLabel(date)} at ${fmtTime12(time)}.`, date:new Date().toISOString(), read:false }]);
    ctx.showToast("Appointment rescheduled");
    onClose();
  };
  return (
    <Modal open={open} onClose={onClose} title="Reschedule Appointment">
      <Field label="New date">
        <div className="mq-scroll" style={{display:"flex",gap:8,overflowX:"auto",paddingBottom:4}}>
          {dates.map(d=>(
            <button key={d} className="mq-btn" onClick={()=>{setDate(d);setTime(null);}} style={{flexShrink:0,background:date===d?COLORS.primary:"#F1F5F9",color:date===d?"#fff":COLORS.text,borderRadius:10,padding:"8px 12px",fontSize:12,fontWeight:700}}>{fmtDateLabel(d)}</button>
          ))}
        </div>
      </Field>
      <Field label="New time slot">
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8}}>
          {slots.map(s=>(
            <button key={s.time} disabled={s.taken} className="mq-btn" onClick={()=>setTime(s.time)} style={{background:s.taken?"#F1F5F9":time===s.time?COLORS.primary:"#fff",color:s.taken?COLORS.muted:time===s.time?"#fff":COLORS.text,border:`1px solid ${COLORS.border}`,borderRadius:10,padding:"8px 4px",fontSize:12,fontWeight:700}}>{fmtTime12(s.time)}</button>
          ))}
        </div>
      </Field>
      <Btn full size="lg" onClick={submit}>Confirm New Slot</Btn>
    </Modal>
  );
}

function ReviewModal({ open, onClose, ctx, appt, patient }){
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  if (!open) return null;
  const submit = () => {
    const rev = { id: uid("rev"), doctorId: appt.doctorId, patientId: patient.id, appointmentId: appt.id, rating, comment: comment||"Good experience overall.", date: fmtDate(new Date()) };
    ctx.updateReviews(prev => [...prev, rev]);
    ctx.updateDoctors(prev => prev.map(d => {
      if (d.id!==appt.doctorId) return d;
      const newCount = d.reviewCount+1;
      const newRating = round1(((d.rating*d.reviewCount)+rating)/newCount);
      return { ...d, reviewCount:newCount, rating:newRating };
    }));
    ctx.showToast("Thanks for your feedback!");
    onClose();
  };
  return (
    <Modal open={open} onClose={onClose} title="Rate your visit">
      <div style={{display:"flex",justifyContent:"center",gap:6,marginBottom:16}}>
        {[1,2,3,4,5].map(n => (
          <button key={n} className="mq-btn" onClick={()=>setRating(n)} style={{background:"none"}}>
            <Star size={30} fill={n<=rating?COLORS.warning:"none"} color={COLORS.warning} />
          </button>
        ))}
      </div>
      <Field label="Your feedback"><TextArea value={comment} onChange={e=>setComment(e.target.value)} placeholder="Share your experience..." /></Field>
      <Btn full size="lg" icon={ThumbsUp} onClick={submit}>Submit Review</Btn>
    </Modal>
  );
}

/* ---------- Notifications ---------- */
function PatientNotifications({ ctx, patient }){
  const mine = ctx.notifications.filter(n=>n.userId===patient.id).slice().reverse();
  useEffect(()=>{
    if (mine.some(n=>!n.read)){
      ctx.updateNotifications(prev => prev.map(n => n.userId===patient.id ? {...n, read:true} : n));
    }
    // eslint-disable-next-line
  }, []);
  return (
    <div className="mq-fade-in">
      <TopBar title="Notifications" />
      <div style={{padding:16}}>
        {mine.length===0 ? <EmptyState icon={Bell} title="No notifications yet" subtitle="Booking updates and queue alerts will show up here" /> : (
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            {mine.map(n => (
              <Card key={n.id} style={{display:"flex",gap:10}}>
                <div style={{width:34,height:34,borderRadius:10,background:COLORS.primarySoft,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                  <Bell size={16} color={COLORS.primary} />
                </div>
                <div style={{flex:1}}>
                  <div style={{fontSize:13,lineHeight:1.4}}>{n.message}</div>
                  <div style={{fontSize:11,color:COLORS.muted,marginTop:4}}>{timeAgo(n.date)}</div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------- Patient Profile ---------- */
function PatientProfile({ ctx, patient, onOpenDoctor }){
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(patient);
  const favDoctors = ctx.doctors.filter(d=>patient.favorites?.includes(d.id));
  const mine = ctx.appointments.filter(a=>a.patientId===patient.id);
  const completed = mine.filter(a=>a.status==="completed").length;

  const save = () => {
    ctx.updatePatients(prev => prev.map(p=>p.id===patient.id?{...p,...form}:p));
    ctx.showToast("Profile updated");
    setEditing(false);
  };

  return (
    <div className="mq-fade-in">
      <TopBar title="Profile" right={<button className="mq-btn" onClick={()=>ctx.logout()} style={{background:"none",color:COLORS.danger,display:"flex",alignItems:"center",gap:5,fontSize:12.5,fontWeight:700}}><LogOut size={15}/>Logout</button>} />
      <div style={{padding:16}}>
        <Card style={{textAlign:"center",marginBottom:16}}>
          <Avatar src="" name={patient.name} size={68} />
          <div style={{fontWeight:800,fontSize:16,marginTop:10}}>{patient.name}</div>
          <div style={{fontSize:12.5,color:COLORS.muted}}>{patient.phone}</div>
          <div style={{display:"flex",justifyContent:"center",gap:20,marginTop:14}}>
            <div><div style={{fontWeight:800,fontSize:17}}>{mine.length}</div><div style={{fontSize:11,color:COLORS.muted}}>Appointments</div></div>
            <div><div style={{fontWeight:800,fontSize:17}}>{completed}</div><div style={{fontSize:11,color:COLORS.muted}}>Completed</div></div>
            <div><div style={{fontWeight:800,fontSize:17}}>{favDoctors.length}</div><div style={{fontSize:11,color:COLORS.muted}}>Favourites</div></div>
          </div>
        </Card>

        <SectionHeader title="Personal Information" action={<button className="mq-btn" onClick={()=>editing?save():setEditing(true)} style={{background:"none",color:COLORS.primary,fontWeight:700,fontSize:12.5,display:"flex",alignItems:"center",gap:4}}>{editing?<><Check size={14}/>Save</>:<><Pencil size={13}/>Edit</>}</button>} />
        <Card style={{marginBottom:20}}>
          {editing ? (
            <div>
              <Field label="Name"><TextInput value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} /></Field>
              <Field label="Email"><TextInput value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))} /></Field>
              <Field label="Date of birth"><TextInput type="date" value={form.dob} onChange={e=>setForm(f=>({...f,dob:e.target.value}))} /></Field>
              <Field label="Gender">
                <Select value={form.gender} onChange={e=>setForm(f=>({...f,gender:e.target.value}))}><option value="">Select</option><option>Male</option><option>Female</option><option>Other</option></Select>
              </Field>
            </div>
          ) : (
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              <Row icon={Mail} label="Email" value={patient.email||"Not set"} />
              <Row icon={Calendar} label="Date of birth" value={patient.dob||"Not set"} />
              <Row icon={User} label="Gender" value={patient.gender||"Not set"} />
            </div>
          )}
        </Card>

        <SectionHeader title="Favourite Doctors" />
        {favDoctors.length===0 ? <EmptyState icon={Heart} title="No favourites yet" subtitle="Tap the heart icon on a doctor's profile to save them here" /> : (
          <div style={{display:"flex",flexDirection:"column",gap:12,marginBottom:20}}>
            {favDoctors.map(d => <DoctorCard key={d.id} doctor={d} onClick={()=>onOpenDoctor(d)} onFav={()=>{
              ctx.updatePatients(prev => prev.map(p => p.id===patient.id ? {...p, favorites:p.favorites.filter(id=>id!==d.id)} : p));
            }} isFav={true} />)}
          </div>
        )}
      </div>
    </div>
  );
}

/* ============================================================================
   DOCTOR APP
============================================================================ */
function DoctorApp({ ctx }){
  const doctor = ctx.doctors.find(d=>d.id===ctx.session.id);
  const [tab, setTab] = useState("dashboard");
  const [view, setView] = useState({ name:"dashboard" });

  if (!doctor) return <LoadingState />;

  if (doctor.status !== "approved"){
    return <DoctorPendingScreen ctx={ctx} doctor={doctor} />;
  }

  const myAppts = ctx.appointments.filter(a=>a.doctorId===doctor.id);
  const todayStr = fmtDate(new Date());
  const todaysAppts = myAppts.filter(a=>a.date===todayStr);
  const pendingCount = myAppts.filter(a=>a.status==="pending").length;

  const navItems = [
    { key:"dashboard", label:"Dashboard", icon:LayoutGrid },
    { key:"appointments", label:"Appointments", icon:ClipboardList, badge:pendingCount },
    { key:"queue", label:"Queue", icon:ListChecks },
    { key:"patients", label:"Patients", icon:Users },
    { key:"profile", label:"Profile", icon:UserCog },
  ];
  const goTab = (t) => { setTab(t); setView({name:t}); };

  let content;
  if (tab==="dashboard") content = <DoctorDashboard ctx={ctx} doctor={doctor} goTab={goTab} />;
  else if (tab==="appointments") content = <DoctorAppointments ctx={ctx} doctor={doctor} />;
  else if (tab==="queue") content = <DoctorQueue ctx={ctx} doctor={doctor} />;
  else if (tab==="patients") content = <DoctorPatients ctx={ctx} doctor={doctor} />;
  else if (tab==="profile") content = <DoctorProfileSettings ctx={ctx} doctor={doctor} />;

  return (
    <div style={{display:"flex",flexDirection:"column",minHeight:"100vh"}}>
      <div style={{flex:1}}>{content}</div>
      <BottomNav items={navItems} active={tab} onChange={goTab} />
    </div>
  );
}

function DoctorPendingScreen({ ctx, doctor }){
  const rejected = doctor.status === "rejected";
  return (
    <div className="mq-fade-in" style={{minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:28,textAlign:"center"}}>
      <div style={{width:70,height:70,borderRadius:"50%",background: rejected?COLORS.dangerSoft:COLORS.warnSoft,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:18}}>
        {rejected ? <XCircle size={34} color={COLORS.danger}/> : <ShieldAlert size={34} color={COLORS.warning}/>}
      </div>
      <div className="mq-display" style={{fontWeight:800,fontSize:19,marginBottom:8}}>{rejected?"Registration Rejected":"Verification Pending"}</div>
      <div style={{color:COLORS.muted,fontSize:13.5,maxWidth:300,marginBottom:24}}>
        {rejected ? "Your registration was not approved. Please contact support for more details." : "Your registration is under review by our admin team. You'll be able to access your dashboard once verified — this usually takes 24-48 hours."}
      </div>
      <Btn variant="outline" onClick={()=>ctx.logout()} icon={LogOut}>Logout</Btn>
    </div>
  );
}

function DoctorDashboard({ ctx, doctor, goTab }){
  const myAppts = ctx.appointments.filter(a=>a.doctorId===doctor.id);
  const todayStr = fmtDate(new Date());
  const today = myAppts.filter(a=>a.date===todayStr);
  const upcoming = myAppts.filter(a=>a.date>todayStr && ["pending","confirmed"].includes(a.status));
  const completed = myAppts.filter(a=>a.status==="completed");
  const cancelled = myAppts.filter(a=>["cancelled","rejected"].includes(a.status));
  const earnings = completed.reduce((s,a)=>s+a.fee,0);
  const currentToken = doctor.currentTokenByDate?.[todayStr] || 0;
  const uniquePatients = new Set(myAppts.map(a=>a.patientId)).size;

  const queueToday = today.filter(a=>["confirmed","arrived"].includes(a.status)).sort((a,b)=>a.tokenNumber-b.tokenNumber);
  const pendingReq = myAppts.filter(a=>a.status==="pending").slice(0,4);

  return (
    <div className="mq-fade-in">
      <TopBar title="Dashboard" right={<button className="mq-btn" onClick={()=>ctx.logout()} style={{background:"none",color:COLORS.danger}}><LogOut size={17}/></button>} />
      <div style={{padding:16}}>
        <Card style={{display:"flex",gap:12,marginBottom:16,alignItems:"center"}}>
          <Avatar src={doctor.photo} name={doctor.name} size={54} />
          <div style={{flex:1}}>
            <div style={{fontWeight:800,fontSize:15}}>{doctor.name}</div>
            <div style={{fontSize:12,color:COLORS.primary,fontWeight:700}}>{doctor.specialization}</div>
          </div>
          <Badge tone="success"><ShieldCheck size={11}/> Verified</Badge>
        </Card>

        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:16}}>
          <StatCard icon={CalendarClock} label="Today's Appointments" value={today.length} tone="primary" />
          <StatCard icon={ListChecks} label="Now Serving" value={currentToken||"–"} tone="secondary" />
          <StatCard icon={Users} label="Total Patients" value={uniquePatients} tone="success" />
          <StatCard icon={IndianRupee} label="Total Earnings" value={`₹${earnings.toLocaleString("en-IN")}`} tone="warning" />
        </div>

        <SectionHeader title="Pending Requests" subtitle="Awaiting your response" action={pendingReq.length>0 && <button className="mq-btn" onClick={()=>goTab("appointments")} style={{background:"none",color:COLORS.primary,fontSize:12,fontWeight:700}}>View all</button>} />
        {pendingReq.length===0 ? (
          <Card style={{marginBottom:18}}><div style={{textAlign:"center",color:COLORS.muted,fontSize:13,padding:8}}>No pending requests right now.</div></Card>
        ) : (
          <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:18}}>
            {pendingReq.map(a => <DoctorApptRow key={a.id} ctx={ctx} appt={a} compact />)}
          </div>
        )}

        <SectionHeader title="Today's Queue" action={<button className="mq-btn" onClick={()=>goTab("queue")} style={{background:"none",color:COLORS.primary,fontSize:12,fontWeight:700}}>Manage</button>} />
        {queueToday.length===0 ? (
          <Card style={{marginBottom:18}}><div style={{textAlign:"center",color:COLORS.muted,fontSize:13,padding:8}}>No patients in queue today.</div></Card>
        ) : (
          <Card style={{marginBottom:18}}>
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              {queueToday.slice(0,5).map(a => (
                <div key={a.id} style={{display:"flex",alignItems:"center",gap:10,paddingBottom:8,borderBottom:`1px solid ${COLORS.border}`}}>
                  <div style={{width:30,height:30,borderRadius:8,background: a.tokenNumber===currentToken?COLORS.primary:COLORS.primarySoft,color:a.tokenNumber===currentToken?"#fff":COLORS.primary,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,fontSize:12,flexShrink:0}}>{a.tokenNumber}</div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontWeight:700,fontSize:12.5,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{a.patientName}</div>
                    <div style={{fontSize:11,color:COLORS.muted}}>{fmtTime12(a.time)}</div>
                  </div>
                  <Badge tone={STATUS_TONE(a.status)}>{a.status}</Badge>
                </div>
              ))}
            </div>
          </Card>
        )}

        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
          <StatCard icon={CheckCircle2} label="Completed" value={completed.length} tone="success" />
          <StatCard icon={Ban} label="Cancelled" value={cancelled.length} tone="danger" />
        </div>
      </div>
    </div>
  );
}

function DoctorApptRow({ ctx, appt, compact=false }){
  const accept = () => {
    ctx.updateAppointments(prev => prev.map(a=>a.id===appt.id?{...a,status:"confirmed"}:a));
    ctx.updateNotifications(prev => [...prev, { id:uid("notif"), userId:appt.patientId, role:"patient", type:"confirm", message:`Your appointment for ${fmtDateLabel(appt.date)} at ${fmtTime12(appt.time)} was confirmed. Token #${appt.tokenNumber}.`, date:new Date().toISOString(), read:false }]);
    ctx.showToast("Appointment confirmed");
  };
  const reject = () => {
    ctx.updateAppointments(prev => prev.map(a=>a.id===appt.id?{...a,status:"rejected"}:a));
    ctx.updateNotifications(prev => [...prev, { id:uid("notif"), userId:appt.patientId, role:"patient", type:"reject", message:`Your appointment request for ${fmtDateLabel(appt.date)} was declined by the doctor.`, date:new Date().toISOString(), read:false }]);
    ctx.showToast("Appointment declined","danger");
  };
  return (
    <Card>
      <div style={{display:"flex",gap:10,alignItems:"center"}}>
        <div style={{width:34,height:34,borderRadius:9,background:COLORS.primarySoft,color:COLORS.primary,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,fontSize:12.5,flexShrink:0}}>{appt.tokenNumber}</div>
        <div style={{flex:1,minWidth:0}}>
          <div style={{fontWeight:700,fontSize:13}}>{appt.patientName}</div>
          <div style={{fontSize:11.5,color:COLORS.muted}}>{fmtDateLabel(appt.date)} · {fmtTime12(appt.time)} · {appt.type}</div>
        </div>
      </div>
      <div style={{display:"flex",gap:8,marginTop:10}}>
        <Btn size="sm" variant="dangerOutline" full onClick={reject}>Decline</Btn>
        <Btn size="sm" full onClick={accept}>Accept</Btn>
      </div>
    </Card>
  );
}

function DoctorAppointments({ ctx, doctor }){
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [rescheduleAppt, setRescheduleAppt] = useState(null);
  const mine = ctx.appointments.filter(a=>a.doctorId===doctor.id).sort((a,b)=>(b.date+b.time).localeCompare(a.date+a.time));
  const todayStr = fmtDate(new Date());

  const filtered = mine.filter(a => {
    if (statusFilter!=="all" && a.status!==statusFilter) return false;
    if (dateFilter==="today" && a.date!==todayStr) return false;
    if (dateFilter==="upcoming" && a.date<=todayStr) return false;
    if (dateFilter==="past" && a.date>=todayStr) return false;
    return true;
  });

  const setStatus = (a, status) => {
    ctx.updateAppointments(prev => prev.map(x=>x.id===a.id?{...x,status}:x));
    const msgs = { confirmed:"confirmed", cancelled:"cancelled", arrived:"marked as arrived", completed:"marked as completed", rejected:"declined" };
    ctx.updateNotifications(prev => [...prev, { id:uid("notif"), userId:a.patientId, role:"patient", type:status, message:`Your appointment on ${fmtDateLabel(a.date)} was ${msgs[status]||status} by ${doctor.name}.`, date:new Date().toISOString(), read:false }]);
    ctx.showToast(`Appointment ${msgs[status]||status}`);
  };

  return (
    <div className="mq-fade-in">
      <TopBar title="Appointments" />
      <div style={{padding:"14px 16px 0"}}>
        <div className="mq-scroll" style={{display:"flex",gap:7,overflowX:"auto",paddingBottom:8}}>
          {["all","pending","confirmed","arrived","completed","cancelled","rejected"].map(s => (
            <button key={s} className="mq-btn" onClick={()=>setStatusFilter(s)} style={{whiteSpace:"nowrap",background:statusFilter===s?COLORS.primary:"#F1F5F9",color:statusFilter===s?"#fff":COLORS.text,borderRadius:20,padding:"7px 13px",fontSize:12,fontWeight:700,textTransform:"capitalize"}}>{s}</button>
          ))}
        </div>
        <div style={{display:"flex",gap:7,paddingBottom:8}}>
          {[["all","All dates"],["today","Today"],["upcoming","Upcoming"],["past","Past"]].map(([k,l])=>(
            <button key={k} className="mq-btn" onClick={()=>setDateFilter(k)} style={{background:dateFilter===k?COLORS.secondarySoft:"transparent",color:dateFilter===k?COLORS.secondary:COLORS.muted,borderRadius:8,padding:"5px 10px",fontSize:11.5,fontWeight:700,border:`1px solid ${dateFilter===k?COLORS.secondary:COLORS.border}`}}>{l}</button>
          ))}
        </div>
      </div>
      <div style={{padding:"6px 16px 16px"}}>
        {filtered.length===0 ? <EmptyState icon={ClipboardList} title="No appointments found" subtitle="Try a different filter" /> : (
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            {filtered.map(a => (
              <Card key={a.id}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                  <div style={{display:"flex",gap:10}}>
                    <div style={{width:34,height:34,borderRadius:9,background:COLORS.primarySoft,color:COLORS.primary,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,fontSize:12.5,flexShrink:0}}>{a.tokenNumber}</div>
                    <div>
                      <div style={{fontWeight:700,fontSize:13.5}}>{a.patientName}</div>
                      <div style={{fontSize:11.5,color:COLORS.muted}}>{a.patientAge}y, {a.patientGender||"—"} · {a.patientPhone}</div>
                    </div>
                  </div>
                  <Badge tone={STATUS_TONE(a.status)}>{a.status}</Badge>
                </div>
                <div style={{display:"flex",gap:14,marginTop:10,fontSize:11.5,color:COLORS.muted}}>
                  <span style={{display:"flex",alignItems:"center",gap:3}}><Calendar size={11}/>{fmtDateLabel(a.date)}</span>
                  <span style={{display:"flex",alignItems:"center",gap:3}}><Clock size={11}/>{fmtTime12(a.time)}</span>
                  <span>{a.type}</span>
                </div>
                <div style={{fontSize:12,color:COLORS.text,marginTop:6}}><b>Reason:</b> {a.reason}</div>

                <div style={{display:"flex",gap:8,marginTop:10,flexWrap:"wrap"}}>
                  {a.status==="pending" && <>
                    <Btn size="sm" onClick={()=>setStatus(a,"confirmed")}>Accept</Btn>
                    <Btn size="sm" variant="dangerOutline" onClick={()=>setStatus(a,"rejected")}>Reject</Btn>
                  </>}
                  {a.status==="confirmed" && <>
                    {a.date===todayStr && <Btn size="sm" variant="secondary" onClick={()=>setStatus(a,"arrived")}>Mark Arrived</Btn>}
                    <Btn size="sm" variant="outline" onClick={()=>setRescheduleAppt(a)}>Reschedule</Btn>
                    <Btn size="sm" variant="dangerOutline" onClick={()=>setStatus(a,"cancelled")}>Cancel</Btn>
                  </>}
                  {a.status==="arrived" && <Btn size="sm" onClick={()=>setStatus(a,"completed")}>Mark Completed</Btn>}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
      <DoctorRescheduleModal open={!!rescheduleAppt} onClose={()=>setRescheduleAppt(null)} ctx={ctx} appt={rescheduleAppt} doctor={doctor} />
    </div>
  );
}

function DoctorRescheduleModal({ open, onClose, ctx, appt, doctor }){
  const [date, setDate] = useState(appt?.date);
  const [time, setTime] = useState(null);
  useEffect(()=>{ if(open && appt){ setDate(appt.date); setTime(null); } }, [open, appt]);
  if (!open || !appt) return null;
  const dates = next14Days().filter(d => doctor.workingDays.includes(dayOfWeek(d)) && !doctor.blockedDates?.includes(d));
  const slots = getSlotsForDate(doctor, date, ctx.appointments.filter(a=>a.id!==appt.id));
  const submit = () => {
    if (!time){ ctx.showToast("Select a slot","danger"); return; }
    ctx.updateAppointments(prev => prev.map(a=>a.id===appt.id?{...a,date,time,rescheduled:true}:a));
    ctx.updateNotifications(prev => [...prev, { id:uid("notif"), userId:appt.patientId, role:"patient", type:"reschedule", message:`${doctor.name} rescheduled your appointment to ${fmtDateLabel(date)} at ${fmtTime12(time)}.`, date:new Date().toISOString(), read:false }]);
    ctx.showToast("Appointment rescheduled");
    onClose();
  };
  return (
    <Modal open={open} onClose={onClose} title={`Reschedule — ${appt.patientName}`}>
      <Field label="New date">
        <div className="mq-scroll" style={{display:"flex",gap:8,overflowX:"auto",paddingBottom:4}}>
          {dates.map(d=>(<button key={d} className="mq-btn" onClick={()=>{setDate(d);setTime(null);}} style={{flexShrink:0,background:date===d?COLORS.primary:"#F1F5F9",color:date===d?"#fff":COLORS.text,borderRadius:10,padding:"8px 12px",fontSize:12,fontWeight:700}}>{fmtDateLabel(d)}</button>))}
        </div>
      </Field>
      <Field label="New time">
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8}}>
          {slots.map(s=>(<button key={s.time} disabled={s.taken} className="mq-btn" onClick={()=>setTime(s.time)} style={{background:s.taken?"#F1F5F9":time===s.time?COLORS.primary:"#fff",color:s.taken?COLORS.muted:time===s.time?"#fff":COLORS.text,border:`1px solid ${COLORS.border}`,borderRadius:10,padding:"8px 4px",fontSize:12,fontWeight:700}}>{fmtTime12(s.time)}</button>))}
        </div>
      </Field>
      <Btn full size="lg" onClick={submit}>Confirm New Slot</Btn>
    </Modal>
  );
}

function DoctorQueue({ ctx, doctor }){
  const todayStr = fmtDate(new Date());
  const [selDate, setSelDate] = useState(todayStr);
  const dayAppts = ctx.appointments.filter(a=>a.doctorId===doctor.id && a.date===selDate && ["confirmed","arrived","completed"].includes(a.status)).sort((a,b)=>a.tokenNumber-b.tokenNumber);
  const currentToken = doctor.currentTokenByDate?.[selDate] || 0;
  const waiting = dayAppts.filter(a=>a.tokenNumber>currentToken && a.status!=="completed");

  const setToken = (n) => {
    ctx.updateDoctors(prev => prev.map(d=>d.id===doctor.id?{...d, currentTokenByDate:{...d.currentTokenByDate, [selDate]:n}}:d));
  };
  const callNext = () => {
    // mark current as completed if exists, advance token
    const current = dayAppts.find(a=>a.tokenNumber===currentToken);
    if (current && current.status!=="completed"){
      ctx.updateAppointments(prev => prev.map(a=>a.id===current.id?{...a,status:"completed"}:a));
    }
    const nextAppt = dayAppts.find(a=>a.tokenNumber>currentToken);
    if (nextAppt){
      setToken(nextAppt.tokenNumber);
      ctx.updateAppointments(prev => prev.map(a=>a.id===nextAppt.id?{...a,status:"arrived"}:a));
      ctx.updateNotifications(prev => [...prev, { id:uid("notif"), userId:nextAppt.patientId, role:"patient", type:"queue", message:`It's your turn! ${doctor.name} is now calling token #${nextAppt.tokenNumber}.`, date:new Date().toISOString(), read:false }]);
      ctx.showToast(`Now calling token #${nextAppt.tokenNumber}`);
    } else {
      ctx.showToast("No more patients in queue","primary");
    }
  };
  const resetQueue = () => { setToken(0); ctx.showToast("Queue reset"); };

  return (
    <div className="mq-fade-in">
      <TopBar title="Live Queue" />
      <div style={{padding:16}}>
        <Field label="Select date">
          <div className="mq-scroll" style={{display:"flex",gap:8,overflowX:"auto"}}>
            {next14Days().slice(0,7).map(d=>(
              <button key={d} className="mq-btn" onClick={()=>setSelDate(d)} style={{flexShrink:0,background:selDate===d?COLORS.primary:"#F1F5F9",color:selDate===d?"#fff":COLORS.text,borderRadius:10,padding:"8px 12px",fontSize:12,fontWeight:700}}>{fmtDateLabel(d)}</button>
            ))}
          </div>
        </Field>

        <Card style={{background:`linear-gradient(135deg, ${COLORS.primary}, ${COLORS.primaryDark})`,color:"#fff",border:"none",marginBottom:16}}>
          <div style={{fontSize:11,fontWeight:700,opacity:0.85,marginBottom:6,letterSpacing:0.5}}>NOW SERVING</div>
          <div className="mq-display mq-pulse" style={{fontSize:52,fontWeight:800,textAlign:"center",padding:"6px 0",borderRadius:12}}>{currentToken || "–"}</div>
          <div style={{textAlign:"center",fontSize:12,opacity:0.85,marginBottom:14}}>{waiting.length} patients waiting</div>
          <div style={{display:"flex",gap:10}}>
            <Btn full variant="subtle" style={{background:"rgba(255,255,255,0.18)",color:"#fff"}} icon={RefreshCw} onClick={resetQueue}>Reset</Btn>
            <Btn full style={{background:"#fff",color:COLORS.primary}} icon={PlayCircle} onClick={callNext}>Call Next</Btn>
          </div>
        </Card>

        <SectionHeader title={`Queue — ${fmtDateLabel(selDate)}`} subtitle={`${dayAppts.length} patients scheduled`} />
        {dayAppts.length===0 ? <EmptyState icon={ListChecks} title="No queue for this date" subtitle="Confirmed appointments will appear here" /> : (
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            {dayAppts.map(a => (
              <Card key={a.id} style={{display:"flex",alignItems:"center",gap:12, borderColor: a.tokenNumber===currentToken?COLORS.primary:COLORS.border, borderWidth: a.tokenNumber===currentToken?2:1}}>
                <div style={{width:38,height:38,borderRadius:10,background: a.status==="completed"?COLORS.successSoft: a.tokenNumber===currentToken?COLORS.primary:COLORS.primarySoft,color: a.status==="completed"?COLORS.success: a.tokenNumber===currentToken?"#fff":COLORS.primary,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,fontSize:14,flexShrink:0}}>{a.tokenNumber}</div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontWeight:700,fontSize:13.5}}>{a.patientName}</div>
                  <div style={{fontSize:11.5,color:COLORS.muted}}>{fmtTime12(a.time)} · {a.type}</div>
                </div>
                <Badge tone={STATUS_TONE(a.status)}>{a.status}</Badge>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function DoctorPatients({ ctx, doctor }){
  const [q, setQ] = useState("");
  const mine = ctx.appointments.filter(a=>a.doctorId===doctor.id);
  const byPatient = {};
  mine.forEach(a=>{
    if (!byPatient[a.patientId]) byPatient[a.patientId] = { id:a.patientId, name:a.patientName, phone:a.patientPhone, visits:0, lastDate:a.date, completed:0 };
    byPatient[a.patientId].visits++;
    if (a.status==="completed") byPatient[a.patientId].completed++;
    if (a.date>byPatient[a.patientId].lastDate) byPatient[a.patientId].lastDate = a.date;
  });
  let list = Object.values(byPatient).sort((a,b)=>b.lastDate.localeCompare(a.lastDate));
  if (q.trim()) list = list.filter(p=>p.name.toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="mq-fade-in">
      <TopBar title="My Patients" />
      <div style={{padding:"14px 16px 0"}}>
        <div style={{position:"relative",marginBottom:12}}>
          <Search size={16} style={{position:"absolute",left:12,top:12,color:COLORS.muted}} />
          <TextInput value={q} onChange={e=>setQ(e.target.value)} placeholder="Search patients..." style={{paddingLeft:36}} />
        </div>
      </div>
      <div style={{padding:"0 16px 16px"}}>
        {list.length===0 ? <EmptyState icon={Users} title="No patients yet" /> : (
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            {list.map(p => (
              <Card key={p.id} style={{display:"flex",gap:12,alignItems:"center"}}>
                <Avatar name={p.name} size={42} />
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontWeight:700,fontSize:13.5}}>{p.name}</div>
                  <div style={{fontSize:11.5,color:COLORS.muted}}>{p.phone} · Last visit {fmtDateLabel(p.lastDate)}</div>
                </div>
                <div style={{textAlign:"center"}}>
                  <div style={{fontWeight:800,fontSize:15}}>{p.visits}</div>
                  <div style={{fontSize:9.5,color:COLORS.muted}}>visits</div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function DoctorProfileSettings({ ctx, doctor }){
  const [tab, setTab] = useState("profile");
  const [form, setForm] = useState(doctor);
  useEffect(()=>setForm(doctor), [doctor.id]);
  const set = (k,v) => setForm(f=>({...f,[k]:v}));
  const [newBlockDate, setNewBlockDate] = useState("");

  const save = () => {
    ctx.updateDoctors(prev => prev.map(d=>d.id===doctor.id?{...d,...form}:d));
    ctx.showToast("Settings saved");
  };
  const toggleDay = (d) => {
    setForm(f => ({...f, workingDays: f.workingDays.includes(d) ? f.workingDays.filter(x=>x!==d) : [...f.workingDays,d].sort()}));
  };
  const addBlock = () => {
    if (!newBlockDate) return;
    setForm(f => ({...f, blockedDates: [...new Set([...f.blockedDates, newBlockDate])]}));
    setNewBlockDate("");
  };
  const removeBlock = (d) => setForm(f => ({...f, blockedDates: f.blockedDates.filter(x=>x!==d)}));
  const toggleConsultType = (t) => {
    setForm(f => ({...f, consultTypes: f.consultTypes.includes(t) ? f.consultTypes.filter(x=>x!==t) : [...f.consultTypes,t]}));
  };

  return (
    <div className="mq-fade-in">
      <TopBar title="Profile & Settings" right={<button className="mq-btn" onClick={()=>ctx.logout()} style={{background:"none",color:COLORS.danger}}><LogOut size={17}/></button>} />
      <div style={{padding:"14px 16px 0",display:"flex",gap:8}}>
        <TabBtn active={tab==="profile"} onClick={()=>setTab("profile")} label="Profile" />
        <TabBtn active={tab==="hours"} onClick={()=>setTab("hours")} label="Hours & Fee" />
        <TabBtn active={tab==="dates"} onClick={()=>setTab("dates")} label="Blocked Dates" />
      </div>
      <div style={{padding:16}}>
        {tab==="profile" && (
          <div>
            <Card style={{textAlign:"center",marginBottom:16}}>
              <Avatar src={doctor.photo} name={doctor.name} size={72} />
              <div style={{fontWeight:800,fontSize:16,marginTop:10}}>{doctor.name}</div>
              <Badge tone="success">Verified Doctor</Badge>
            </Card>
            <Field label="Full name"><TextInput value={form.name} onChange={e=>set("name",e.target.value)} /></Field>
            <Field label="Specialization">
              <Select value={form.specialization} onChange={e=>set("specialization",e.target.value)}>{SPECIALTIES.map(s=><option key={s.name}>{s.name}</option>)}</Select>
            </Field>
            <Field label="Qualification"><TextInput value={form.qualification} onChange={e=>set("qualification",e.target.value)} /></Field>
            <Field label="Experience (years)"><TextInput type="number" value={form.experience} onChange={e=>set("experience",Number(e.target.value))} /></Field>
            <Field label="Clinic name"><TextInput value={form.clinicName} onChange={e=>set("clinicName",e.target.value)} /></Field>
            <Field label="Address"><TextInput value={form.address} onChange={e=>set("address",e.target.value)} /></Field>
            <Field label="Area">
              <Select value={form.area} onChange={e=>set("area",e.target.value)}>{AREAS.map(a=><option key={a}>{a}</option>)}</Select>
            </Field>
            <Field label="About"><TextArea value={form.about} onChange={e=>set("about",e.target.value)} /></Field>
            <Field label="Consultation types">
              <div style={{display:"flex",gap:8}}>
                {["In-Clinic","Video Consult"].map(t=>(
                  <button key={t} className="mq-btn" onClick={()=>toggleConsultType(t)} style={{flex:1,background:form.consultTypes.includes(t)?COLORS.primarySoft:"#F1F5F9",border:`1.5px solid ${form.consultTypes.includes(t)?COLORS.primary:COLORS.border}`,borderRadius:10,padding:"9px 6px",fontSize:12,fontWeight:700,color:form.consultTypes.includes(t)?COLORS.primary:COLORS.text}}>{t}</button>
                ))}
              </div>
            </Field>
            <Btn full size="lg" onClick={save}>Save Changes</Btn>
          </div>
        )}

        {tab==="hours" && (
          <div>
            <Field label="Working days">
              <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                {DAY_NAMES.map((d,i)=>(
                  <button key={d} className="mq-btn" onClick={()=>toggleDay(i)} style={{width:42,height:42,borderRadius:10,background:form.workingDays.includes(i)?COLORS.primary:"#F1F5F9",color:form.workingDays.includes(i)?"#fff":COLORS.text,fontWeight:700,fontSize:12}}>{d}</button>
                ))}
              </div>
            </Field>
            <div style={{display:"flex",gap:10}}>
              <Field label="Start time" style={{flex:1}}><TextInput type="time" value={form.startTime} onChange={e=>set("startTime",e.target.value)} /></Field>
              <Field label="End time" style={{flex:1}}><TextInput type="time" value={form.endTime} onChange={e=>set("endTime",e.target.value)} /></Field>
            </div>
            <div style={{display:"flex",gap:10}}>
              <Field label="Break start" style={{flex:1}}><TextInput type="time" value={form.breakStart} onChange={e=>set("breakStart",e.target.value)} /></Field>
              <Field label="Break end" style={{flex:1}}><TextInput type="time" value={form.breakEnd} onChange={e=>set("breakEnd",e.target.value)} /></Field>
            </div>
            <Field label={`Appointment duration: ${form.slotDuration} min`}>
              <div style={{display:"flex",gap:8}}>
                {[10,15,20,30].map(m=>(
                  <button key={m} className="mq-btn" onClick={()=>set("slotDuration",m)} style={{flex:1,background:form.slotDuration===m?COLORS.primary:"#F1F5F9",color:form.slotDuration===m?"#fff":COLORS.text,borderRadius:10,padding:"9px 4px",fontWeight:700,fontSize:12.5}}>{m}m</button>
                ))}
              </div>
            </Field>
            <Field label="Consultation fee (₹)"><TextInput type="number" value={form.fee} onChange={e=>set("fee",Number(e.target.value))} /></Field>
            <Btn full size="lg" onClick={save}>Save Changes</Btn>
          </div>
        )}

        {tab==="dates" && (
          <div>
            <Field label="Block a date" hint="Patients won't be able to book on blocked dates">
              <div style={{display:"flex",gap:8}}>
                <TextInput type="date" value={newBlockDate} onChange={e=>setNewBlockDate(e.target.value)} style={{flex:1}} />
                <Btn onClick={addBlock} icon={Plus}>Add</Btn>
              </div>
            </Field>
            <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:18}}>
              {form.blockedDates.length===0 && <div style={{fontSize:13,color:COLORS.muted}}>No blocked dates.</div>}
              {form.blockedDates.map(d=>(
                <div key={d} style={{display:"flex",justifyContent:"space-between",alignItems:"center",background:"#F1F5F9",borderRadius:10,padding:"9px 12px"}}>
                  <span style={{fontSize:13,fontWeight:600}}>{new Date(d+"T00:00:00").toLocaleDateString("en-IN",{weekday:"short",day:"numeric",month:"short",year:"numeric"})}</span>
                  <button className="mq-btn" onClick={()=>removeBlock(d)} style={{background:"none",color:COLORS.danger}}><Trash2 size={15}/></button>
                </div>
              ))}
            </div>
            <Btn full size="lg" onClick={save}>Save Changes</Btn>
          </div>
        )}
      </div>
    </div>
  );
}

/* ============================================================================
   ADMIN APP
============================================================================ */
function AdminApp({ ctx }){
  const [tab, setTab] = useState("dashboard");
  const [more, setMore] = useState(false);
  const pendingDoctors = ctx.doctors.filter(d=>d.status==="pending").length;

  const navItems = [
    { key:"dashboard", label:"Dashboard", icon:LayoutGrid },
    { key:"doctors", label:"Doctors", icon:Stethoscope, badge:pendingDoctors },
    { key:"appointments", label:"Appointments", icon:ClipboardList },
    { key:"reviews", label:"Reviews", icon:Star },
    { key:"more", label:"More", icon:MoreHorizontal },
  ];
  const goTab = (t) => { if (t==="more"){ setMore(true); return; } setTab(t); setMore(false); };

  let content;
  if (tab==="dashboard") content = <AdminDashboard ctx={ctx} goTab={goTab} />;
  else if (tab==="doctors") content = <AdminDoctors ctx={ctx} />;
  else if (tab==="appointments") content = <AdminAppointments ctx={ctx} />;
  else if (tab==="reviews") content = <AdminReviews ctx={ctx} />;
  else if (tab==="patients") content = <AdminPatients ctx={ctx} />;
  else if (tab==="specialties") content = <AdminSpecialties ctx={ctx} />;
  else if (tab==="clinics") content = <AdminClinics ctx={ctx} />;

  return (
    <div style={{display:"flex",flexDirection:"column",minHeight:"100vh"}}>
      <div style={{flex:1}}>{content}</div>
      <BottomNav items={navItems} active={more?"more":tab} onChange={goTab} />
      <Modal open={more} onClose={()=>setMore(false)} title="More">
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          <MoreRow icon={Users} label="Patients" onClick={()=>{setTab("patients");setMore(false);}} />
          <MoreRow icon={Tags} label="Specialties & Categories" onClick={()=>{setTab("specialties");setMore(false);}} />
          <MoreRow icon={Hospital} label="Clinics" onClick={()=>{setTab("clinics");setMore(false);}} />
          <MoreRow icon={LogOut} label="Logout" danger onClick={()=>ctx.logout()} />
        </div>
      </Modal>
    </div>
  );
}
function MoreRow({ icon:Icon, label, onClick, danger }){
  return (
    <button className="mq-btn" onClick={onClick} style={{display:"flex",alignItems:"center",gap:12,background:"#F8FAFC",borderRadius:12,padding:14,textAlign:"left",color:danger?COLORS.danger:COLORS.text}}>
      <Icon size={18} /> <span style={{fontWeight:700,fontSize:14}}>{label}</span>
    </button>
  );
}

function AdminDashboard({ ctx, goTab }){
  const totalDoctors = ctx.doctors.length;
  const approvedDoctors = ctx.doctors.filter(d=>d.status==="approved").length;
  const pendingDoctors = ctx.doctors.filter(d=>d.status==="pending").length;
  const totalPatients = ctx.patients.length;
  const totalAppts = ctx.appointments.length;
  const completed = ctx.appointments.filter(a=>a.status==="completed").length;
  const cancelled = ctx.appointments.filter(a=>["cancelled","rejected"].includes(a.status)).length;
  const revenue = ctx.appointments.filter(a=>a.status==="completed").reduce((s,a)=>s+a.fee,0);
  const todayAppts = ctx.appointments.filter(a=>a.date===fmtDate(new Date())).length;

  const specCounts = {};
  ctx.doctors.forEach(d=>{ specCounts[d.specialization] = (specCounts[d.specialization]||0)+1; });
  const topSpecs = Object.entries(specCounts).sort((a,b)=>b[1]-a[1]).slice(0,5);
  const maxSpec = Math.max(...topSpecs.map(s=>s[1]),1);

  return (
    <div className="mq-fade-in">
      <TopBar title="Admin Dashboard" right={<button className="mq-btn" onClick={()=>ctx.logout()} style={{background:"none",color:COLORS.danger}}><LogOut size={17}/></button>} />
      <div style={{padding:16}}>
        {pendingDoctors>0 && (
          <Card hover onClick={()=>goTab("doctors")} style={{marginBottom:16, background:COLORS.warnSoft, border:`1px solid #F0D9A8`,display:"flex",alignItems:"center",gap:12}}>
            <ShieldAlert size={22} color={COLORS.warning} />
            <div style={{flex:1}}>
              <div style={{fontWeight:800,fontSize:13.5}}>{pendingDoctors} doctors awaiting verification</div>
              <div style={{fontSize:11.5,color:COLORS.muted}}>Review and approve new registrations</div>
            </div>
            <ChevronRight size={18} color={COLORS.warning} />
          </Card>
        )}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:16}}>
          <StatCard icon={Stethoscope} label="Total Doctors" value={totalDoctors} tone="primary" />
          <StatCard icon={Users} label="Total Patients" value={totalPatients} tone="secondary" />
          <StatCard icon={CalendarClock} label="Total Appointments" value={totalAppts} tone="warning" />
          <StatCard icon={IndianRupee} label="Total Revenue" value={`₹${revenue.toLocaleString("en-IN")}`} tone="success" />
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:20}}>
          <MiniStat icon={CalendarCheck2} label="Today" value={todayAppts} />
          <MiniStat icon={CheckCircle2} label="Completed" value={completed} />
          <MiniStat icon={CalendarX2} label="Cancelled" value={cancelled} />
        </div>

        <SectionHeader title="Doctors by Specialty" />
        <Card style={{marginBottom:20}}>
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            {topSpecs.map(([spec,count])=>(
              <div key={spec}>
                <div style={{display:"flex",justifyContent:"space-between",fontSize:12.5,marginBottom:4}}>
                  <span style={{fontWeight:700}}>{spec}</span><span style={{color:COLORS.muted}}>{count}</span>
                </div>
                <div style={{height:7,borderRadius:6,background:"#F1F5F9"}}>
                  <div style={{height:"100%",width:`${(count/maxSpec)*100}%`,borderRadius:6,background:COLORS.primary}} />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <SectionHeader title="Quick Actions" />
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
          <QuickAction icon={ShieldCheck} label="Verify Doctors" onClick={()=>goTab("doctors")} />
          <QuickAction icon={ClipboardList} label="All Appointments" onClick={()=>goTab("appointments")} />
          <QuickAction icon={Tags} label="Specialties" onClick={()=>goTab("specialties")} />
          <QuickAction icon={Hospital} label="Clinics" onClick={()=>goTab("clinics")} />
        </div>
      </div>
    </div>
  );
}
function QuickAction({ icon:Icon, label, onClick }){
  return (
    <button className="mq-btn mq-card-hover" onClick={onClick} style={{background:"#fff",border:`1px solid ${COLORS.border}`,borderRadius:14,padding:14,display:"flex",flexDirection:"column",alignItems:"flex-start",gap:8}}>
      <div style={{width:34,height:34,borderRadius:10,background:COLORS.primarySoft,display:"flex",alignItems:"center",justifyContent:"center"}}><Icon size={16} color={COLORS.primary}/></div>
      <span style={{fontWeight:700,fontSize:12.5}}>{label}</span>
    </button>
  );
}

function AdminDoctors({ ctx }){
  const [statusFilter, setStatusFilter] = useState("pending");
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState(null);

  let list = ctx.doctors;
  if (statusFilter!=="all") list = list.filter(d=>d.status===statusFilter);
  if (q.trim()) list = list.filter(d=>d.name.toLowerCase().includes(q.toLowerCase()) || d.specialization.toLowerCase().includes(q.toLowerCase()));
  list = [...list].sort((a,b)=> b.createdAt.localeCompare(a.createdAt));

  const setDocStatus = (doc, status) => {
    ctx.updateDoctors(prev => prev.map(d=>d.id===doc.id?{...d,status}:d));
    ctx.showToast(`${doc.name} ${status}`);
    setSelected(null);
  };
  const removeDoctor = (doc) => {
    ctx.updateDoctors(prev => prev.filter(d=>d.id!==doc.id));
    ctx.showToast("Doctor removed","danger");
    setSelected(null);
  };

  return (
    <div className="mq-fade-in">
      <TopBar title="Manage Doctors" />
      <div style={{padding:"14px 16px 0"}}>
        <div style={{position:"relative",marginBottom:10}}>
          <Search size={16} style={{position:"absolute",left:12,top:12,color:COLORS.muted}} />
          <TextInput value={q} onChange={e=>setQ(e.target.value)} placeholder="Search doctors..." style={{paddingLeft:36}} />
        </div>
        <div className="mq-scroll" style={{display:"flex",gap:7,overflowX:"auto",paddingBottom:10}}>
          {["pending","approved","rejected","all"].map(s=>(
            <button key={s} className="mq-btn" onClick={()=>setStatusFilter(s)} style={{whiteSpace:"nowrap",background:statusFilter===s?COLORS.primary:"#F1F5F9",color:statusFilter===s?"#fff":COLORS.text,borderRadius:20,padding:"7px 13px",fontSize:12,fontWeight:700,textTransform:"capitalize"}}>{s}</button>
          ))}
        </div>
      </div>
      <div style={{padding:"0 16px 16px"}}>
        {list.length===0 ? <EmptyState icon={Stethoscope} title="No doctors found" /> : (
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            {list.map(d=>(
              <Card key={d.id} hover onClick={()=>setSelected(d)} style={{display:"flex",gap:12,alignItems:"center"}}>
                <Avatar src={d.photo} name={d.name} size={46} />
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontWeight:700,fontSize:13.5}}>{d.name}</div>
                  <div style={{fontSize:11.5,color:COLORS.muted}}>{d.specialization} · {d.area}</div>
                </div>
                <Badge tone={d.status==="approved"?"success":d.status==="pending"?"warning":"danger"}>{d.status}</Badge>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Modal open={!!selected} onClose={()=>setSelected(null)} title="Doctor Details">
        {selected && (
          <div>
            <div style={{display:"flex",gap:12,marginBottom:14}}>
              <Avatar src={selected.photo} name={selected.name} size={60} />
              <div>
                <div style={{fontWeight:800,fontSize:15}}>{selected.name}</div>
                <div style={{fontSize:12.5,color:COLORS.primary,fontWeight:700}}>{selected.specialization}</div>
                <div style={{fontSize:11.5,color:COLORS.muted}}>{selected.qualification}</div>
              </div>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:14,fontSize:13}}>
              <Row icon={Briefcase} label="Experience" value={`${selected.experience} yrs`} />
              <Row icon={FileText} label="Reg. No." value={selected.regNo} />
              <Row icon={Building2} label="Clinic" value={selected.clinicName} />
              <Row icon={MapPin} label="Address" value={`${selected.address}`} />
              <Row icon={IndianRupee} label="Fee" value={`₹${selected.fee}`} />
              <Row icon={Clock} label="Hours" value={`${fmtTime12(selected.startTime)} – ${fmtTime12(selected.endTime)}`} />
            </div>
            <div style={{marginBottom:14}}>
              <div style={{fontWeight:700,fontSize:12.5,marginBottom:6}}>Verification documents</div>
              <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                {selected.verificationDocs.map(doc=><Badge key={doc} tone="default"><FileText size={11}/>{doc}</Badge>)}
              </div>
            </div>
            {selected.status==="pending" && (
              <div style={{display:"flex",gap:10}}>
                <Btn variant="dangerOutline" full onClick={()=>setDocStatus(selected,"rejected")}>Reject</Btn>
                <Btn full icon={ShieldCheck} onClick={()=>setDocStatus(selected,"approved")}>Approve</Btn>
              </div>
            )}
            {selected.status==="approved" && (
              <Btn variant="dangerOutline" full icon={Ban} onClick={()=>setDocStatus(selected,"rejected")}>Suspend / Revoke</Btn>
            )}
            {selected.status==="rejected" && (
              <div style={{display:"flex",gap:10}}>
                <Btn full icon={ShieldCheck} onClick={()=>setDocStatus(selected,"approved")}>Approve</Btn>
                <Btn variant="dangerOutline" full icon={Trash2} onClick={()=>removeDoctor(selected)}>Remove</Btn>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}

function AdminAppointments({ ctx }){
  const [statusFilter, setStatusFilter] = useState("all");
  const [q, setQ] = useState("");
  let list = ctx.appointments.slice().sort((a,b)=>(b.date+b.time).localeCompare(a.date+a.time));
  if (statusFilter!=="all") list = list.filter(a=>a.status===statusFilter);
  if (q.trim()) list = list.filter(a => a.patientName.toLowerCase().includes(q.toLowerCase()) || (ctx.doctors.find(d=>d.id===a.doctorId)?.name||"").toLowerCase().includes(q.toLowerCase()));
  list = list.slice(0,60);

  const cancelAppt = (a) => {
    ctx.updateAppointments(prev => prev.map(x=>x.id===a.id?{...x,status:"cancelled"}:x));
    ctx.showToast("Appointment cancelled by admin");
  };

  return (
    <div className="mq-fade-in">
      <TopBar title="All Appointments" />
      <div style={{padding:"14px 16px 0"}}>
        <div style={{position:"relative",marginBottom:10}}>
          <Search size={16} style={{position:"absolute",left:12,top:12,color:COLORS.muted}} />
          <TextInput value={q} onChange={e=>setQ(e.target.value)} placeholder="Search by patient or doctor..." style={{paddingLeft:36}} />
        </div>
        <div className="mq-scroll" style={{display:"flex",gap:7,overflowX:"auto",paddingBottom:10}}>
          {["all","pending","confirmed","arrived","completed","cancelled","rejected"].map(s=>(
            <button key={s} className="mq-btn" onClick={()=>setStatusFilter(s)} style={{whiteSpace:"nowrap",background:statusFilter===s?COLORS.primary:"#F1F5F9",color:statusFilter===s?"#fff":COLORS.text,borderRadius:20,padding:"7px 13px",fontSize:12,fontWeight:700,textTransform:"capitalize"}}>{s}</button>
          ))}
        </div>
      </div>
      <div style={{padding:"0 16px 16px"}}>
        {list.length===0 ? <EmptyState icon={ClipboardList} title="No appointments found" /> : (
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            {list.map(a=>{
              const doc = ctx.doctors.find(d=>d.id===a.doctorId);
              return (
                <Card key={a.id}>
                  <div style={{display:"flex",justifyContent:"space-between"}}>
                    <div>
                      <div style={{fontWeight:700,fontSize:13}}>{a.patientName} <span style={{color:COLORS.muted,fontWeight:500}}>→</span> {doc?.name}</div>
                      <div style={{fontSize:11.5,color:COLORS.muted}}>{fmtDateLabel(a.date)} · {fmtTime12(a.time)} · Token #{a.tokenNumber}</div>
                    </div>
                    <Badge tone={STATUS_TONE(a.status)}>{a.status}</Badge>
                  </div>
                  {["pending","confirmed"].includes(a.status) && (
                    <div style={{marginTop:10}}><Btn size="sm" variant="dangerOutline" onClick={()=>cancelAppt(a)}>Cancel Appointment</Btn></div>
                  )}
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function AdminReviews({ ctx }){
  const [q, setQ] = useState("");
  let list = ctx.reviews.slice().reverse();
  if (q.trim()) list = list.filter(r => (ctx.doctors.find(d=>d.id===r.doctorId)?.name||"").toLowerCase().includes(q.toLowerCase()));
  const removeReview = (r) => {
    ctx.updateReviews(prev => prev.filter(x=>x.id!==r.id));
    ctx.showToast("Review removed","danger");
  };
  return (
    <div className="mq-fade-in">
      <TopBar title="Manage Reviews" />
      <div style={{padding:"14px 16px 0"}}>
        <div style={{position:"relative",marginBottom:10}}>
          <Search size={16} style={{position:"absolute",left:12,top:12,color:COLORS.muted}} />
          <TextInput value={q} onChange={e=>setQ(e.target.value)} placeholder="Search by doctor name..." style={{paddingLeft:36}} />
        </div>
      </div>
      <div style={{padding:"0 16px 16px"}}>
        {list.length===0 ? <EmptyState icon={Star} title="No reviews found" /> : (
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            {list.slice(0,50).map(r=>{
              const doc = ctx.doctors.find(d=>d.id===r.doctorId);
              return (
                <Card key={r.id}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                    <div>
                      <div style={{fontWeight:700,fontSize:13}}>{doc?.name}</div>
                      <StarRow rating={r.rating} size={12} />
                    </div>
                    <button className="mq-btn" onClick={()=>removeReview(r)} style={{background:"none",color:COLORS.danger}}><Trash2 size={15}/></button>
                  </div>
                  <div style={{fontSize:12.5,color:COLORS.text,marginTop:6}}>{r.comment}</div>
                  <div style={{fontSize:10.5,color:COLORS.muted,marginTop:4}}>{r.date}</div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function AdminPatients({ ctx }){
  const [q, setQ] = useState("");
  let list = ctx.patients.slice().sort((a,b)=>b.createdAt.localeCompare(a.createdAt));
  if (q.trim()) list = list.filter(p=>p.name.toLowerCase().includes(q.toLowerCase()) || p.phone.includes(q));
  return (
    <div className="mq-fade-in">
      <TopBar title="Manage Patients" />
      <div style={{padding:"14px 16px 0"}}>
        <div style={{position:"relative",marginBottom:10}}>
          <Search size={16} style={{position:"absolute",left:12,top:12,color:COLORS.muted}} />
          <TextInput value={q} onChange={e=>setQ(e.target.value)} placeholder="Search patients..." style={{paddingLeft:36}} />
        </div>
      </div>
      <div style={{padding:"0 16px 16px"}}>
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {list.slice(0,80).map(p=>{
            const visits = ctx.appointments.filter(a=>a.patientId===p.id).length;
            return (
              <Card key={p.id} style={{display:"flex",gap:12,alignItems:"center"}}>
                <Avatar name={p.name} size={42} />
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontWeight:700,fontSize:13.5}}>{p.name}</div>
                  <div style={{fontSize:11.5,color:COLORS.muted}}>{p.phone}</div>
                </div>
                <Badge tone="primary">{visits} visits</Badge>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function AdminSpecialties({ ctx }){
  const [newSpec, setNewSpec] = useState("");
  const counts = {};
  ctx.doctors.forEach(d=>{ counts[d.specialization] = (counts[d.specialization]||0)+1; });
  const add = () => {
    if (!newSpec.trim()) return;
    if (ctx.specialties.includes(newSpec.trim())){ ctx.showToast("Already exists","danger"); return; }
    ctx.updateSpecialties(prev => [...prev, newSpec.trim()]);
    setNewSpec("");
    ctx.showToast("Specialty added");
  };
  const remove = (s) => {
    ctx.updateSpecialties(prev => prev.filter(x=>x!==s));
    ctx.showToast("Specialty removed","danger");
  };
  return (
    <div className="mq-fade-in">
      <TopBar title="Specialties & Categories" />
      <div style={{padding:16}}>
        <Field label="Add new specialty">
          <div style={{display:"flex",gap:8}}>
            <TextInput value={newSpec} onChange={e=>setNewSpec(e.target.value)} placeholder="e.g. Rheumatologist" style={{flex:1}} />
            <Btn onClick={add} icon={Plus}>Add</Btn>
          </div>
        </Field>
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          {ctx.specialties.map(s=>(
            <div key={s} style={{display:"flex",justifyContent:"space-between",alignItems:"center",background:"#fff",border:`1px solid ${COLORS.border}`,borderRadius:12,padding:"11px 14px"}}>
              <div>
                <div style={{fontWeight:700,fontSize:13.5}}>{s}</div>
                <div style={{fontSize:11,color:COLORS.muted}}>{counts[s]||0} doctors</div>
              </div>
              <button className="mq-btn" onClick={()=>remove(s)} style={{background:"none",color:COLORS.danger}}><Trash2 size={16}/></button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AdminClinics({ ctx }){
  const [q, setQ] = useState("");
  const byClinic = {};
  ctx.doctors.forEach(d=>{
    if (!byClinic[d.clinicName]) byClinic[d.clinicName] = { name:d.clinicName, area:d.area, doctors:0 };
    byClinic[d.clinicName].doctors++;
  });
  let list = Object.values(byClinic).sort((a,b)=>b.doctors-a.doctors);
  if (q.trim()) list = list.filter(c=>c.name.toLowerCase().includes(q.toLowerCase()));
  return (
    <div className="mq-fade-in">
      <TopBar title="Manage Clinics" />
      <div style={{padding:"14px 16px 0"}}>
        <div style={{position:"relative",marginBottom:10}}>
          <Search size={16} style={{position:"absolute",left:12,top:12,color:COLORS.muted}} />
          <TextInput value={q} onChange={e=>setQ(e.target.value)} placeholder="Search clinics..." style={{paddingLeft:36}} />
        </div>
      </div>
      <div style={{padding:"0 16px 16px"}}>
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {list.map(c=>(
            <Card key={c.name} style={{display:"flex",gap:12,alignItems:"center"}}>
              <div style={{width:42,height:42,borderRadius:11,background:COLORS.secondarySoft,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><Hospital size={19} color={COLORS.secondary}/></div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontWeight:700,fontSize:13.5}}>{c.name}</div>
                <div style={{fontSize:11.5,color:COLORS.muted}}>{c.area}, {CITY}</div>
              </div>
              <Badge tone="secondary">{c.doctors} doctor{c.doctors>1?"s":""}</Badge>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
