import React, { useState } from "react";
import { ArrowLeft, ShieldCheck, FileText as FileTextIcon, Mail, AlertTriangle } from "lucide-react";
import { COLORS, AayuRahiLogoMark } from "./App";

/* ============================================================================
   LEGAL CONTENT — Privacy Policy & Terms of Service
   Written in AayuRahi's own voice for what the app actually does today.
   Update LEGAL_LAST_UPDATED whenever the wording changes, and have a lawyer
   review this before relying on it for a real public/commercial launch —
   it's a strong starting point, not a substitute for legal advice.

   AayuRahi is currently run independently by its developer, based in
   Purnea, Bihar — not yet registered as a company. Update the "operator"
   line below if/when that changes.
============================================================================ */
export const LEGAL_CONTACT_EMAIL = "support.aayurahi@gmail.com";
export const LEGAL_LAST_UPDATED = "September 14, 2026";

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: 22 }}>
      <div style={{ fontWeight: 800, fontSize: 14.5, marginBottom: 7, color: COLORS.text }}>{title}</div>
      <div style={{ fontSize: 13.5, lineHeight: 1.65, color: COLORS.muted }}>{children}</div>
    </div>
  );
}

function Contact() {
  return (
    <a href={`mailto:${LEGAL_CONTACT_EMAIL}`} style={{ color: COLORS.primary, fontWeight: 700 }}>{LEGAL_CONTACT_EMAIL}</a>
  );
}

function WarningBox({ children }) {
  return (
    <div style={{ background: COLORS.warnSoft, border: `1.5px solid ${COLORS.warning}`, borderRadius: 14, padding: 14, marginBottom: 22, display: "flex", gap: 10 }}>
      <AlertTriangle size={18} color={COLORS.warning} style={{ flexShrink: 0, marginTop: 1 }} />
      <div style={{ fontSize: 13.5, lineHeight: 1.65, color: COLORS.text, fontWeight: 600 }}>{children}</div>
    </div>
  );
}

function GetInTouch() {
  return (
    <div style={{ background: "#fff", border: `1.5px solid ${COLORS.border}`, borderRadius: 16, padding: 16, marginTop: 8 }}>
      <div style={{ fontWeight: 800, fontSize: 14.5, marginBottom: 10 }}>Get in Touch</div>
      <div style={{ fontSize: 13, color: COLORS.muted, marginBottom: 12, lineHeight: 1.6 }}>
        Questions about your data, these terms, or anything else about AayuRahi — we're happy to help.
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
        <Mail size={15} color={COLORS.primary} />
        <span style={{ fontSize: 13, fontWeight: 700, color: COLORS.muted, minWidth: 46 }}>Email</span>
        <Contact />
      </div>
      <div style={{ display: "flex", gap: 10 }}>
        <span style={{ width: 15 }} />
        <span style={{ fontSize: 13, fontWeight: 700, color: COLORS.muted, minWidth: 46 }}>Based in</span>
        <span style={{ fontSize: 13, color: COLORS.text }}>Purnea, Bihar, India</span>
      </div>
    </div>
  );
}

function PrivacyPolicyContent() {
  return (
    <>
      <Section title="Introduction">
        AayuRahi is built to make it simple for people in Purnea, Bihar to find real, verified doctors
        and book appointments with them — right from their phone. Because that means handling some
        genuinely personal information, including health-related details, we want to be upfront about
        exactly what we collect, why, and how it's protected. AayuRahi is currently developed and
        operated independently (not yet registered as a company); "we", "us", and "our" below refer to
        AayuRahi.
      </Section>
      <Section title="Information We Collect">
        <b>Account details:</b> your name, phone number, email address, and password (stored securely
        by our authentication provider, never in plain text).<br/><br/>
        <b>Profile details:</b> date of birth, gender, and profile photo, if you choose to add them.<br/><br/>
        <b>Health-related information:</b> your appointment history, prescriptions uploaded by your
        doctor, reviews you write, and messages you exchange with a doctor through in-app chat.<br/><br/>
        <b>Family member details:</b> name and basic details of family members you add so you can book
        appointments on their behalf.<br/><br/>
        <b>Doctor application details</b> (only if you apply to be listed as a doctor): specialty,
        qualifications, clinic name and address, consultation fee, clinic location (GPS coordinates),
        and verification documents (medical registration certificate, ID proof, degree certificate,
        clinic registration).<br/><br/>
        <b>Device information:</b> a device token used to deliver push notifications (appointment
        updates, chat messages, reminders).<br/><br/>
        <b>Payment information</b> (once online payments are available — see "A Note on Payments"
        below): handled entirely by our payment processor, Razorpay. We never see or store your card,
        UPI, or bank details ourselves.<br/><br/>
        <b>Usage data:</b> anonymous visit and page-view analytics that do not identify you personally.
      </Section>
      <Section title="How We Use Your Information">
        We use your information to create and manage your account; let patients and doctors find each
        other and book appointments; send you notifications about chats, appointment status changes,
        reminders, new reviews, and prescriptions; review and verify doctor applications; protect the
        app from spam and abuse; and respond to your questions when you write in.
      </Section>
      <Section title="Where Your Data Is Stored">
        Your data is stored with Supabase (database, authentication, and file storage), with access
        rules that ensure you can generally only see your own data or data you're authorized to see —
        for example, a doctor can see appointments booked with them, but never another doctor's
        patients. Push notifications are delivered through Google Firebase Cloud Messaging. Some of
        these providers may process or store data on servers located outside India.
      </Section>
      <Section title="A Note on Payments">
        AayuRahi doesn't process payments in-app yet — consultation fees are currently paid directly
        at the clinic. When online payment goes live, it will be handled through Razorpay, a licensed
        Indian payment gateway. At that point, any payment details you enter (card, UPI, netbanking)
        will go straight to Razorpay and never touch AayuRahi's own servers — we'll only receive
        confirmation that a payment succeeded, along with the amount and transaction ID, so we can
        update your booking. This policy will be updated with full details before that feature
        launches.
      </Section>
      <Section title="Sharing Your Information">
        We do not sell your personal information. We share it only: with the doctor or patient
        involved in a specific appointment or chat, so the booking can happen; with our service
        providers (Supabase, Firebase, Vercel, hCaptcha, and Razorpay once payments launch) solely to
        operate the app; or if required by law, court order, or government request.
      </Section>
      <Section title="Your Rights & Choices">
        You can ask us for a copy of the personal data we hold about you, ask us to correct it, or ask
        us to delete your account and associated data, by emailing us at <Contact/>. You can also turn
        off notification permissions at any time from your device settings.
      </Section>
      <Section title="Data Retention">
        We keep your information for as long as your account is active. Appointment and prescription
        records may be retained for a reasonable period after account closure for medical
        record-keeping and legal purposes, unless you request earlier deletion and no legal reason
        requires us to keep it.
      </Section>
      <Section title="Children's Privacy">
        AayuRahi accounts are intended for adults. If you want to book an appointment for a child or
        other dependent, please do so using the "Family Members" feature under your own account rather
        than creating a separate account for them.
      </Section>
      <Section title="Cookies & Local Storage">
        We use your browser's local storage to remember simple preferences like your chosen language
        and to keep you signed in. We do not use third-party advertising or tracking cookies.
      </Section>
      <Section title="Changes to This Policy">
        We may update this Privacy Policy from time to time — most likely as new features like online
        payments launch. If we make significant changes, we'll update the "Last updated" date above.
        Continuing to use AayuRahi after a change means you accept the updated policy.
      </Section>
      <GetInTouch />
    </>
  );
}

function TermsContent() {
  return (
    <>
      <Section title="Acceptance of Terms">
        By creating an account or using AayuRahi, you agree to these Terms of Service. If you do not
        agree, please do not use the app.
      </Section>
      <Section title="What AayuRahi Does">
        AayuRahi helps patients in Purnea, Bihar find doctors and book appointments with them, and
        helps doctors manage their appointments, chat with patients, and issue prescriptions. AayuRahi
        itself is a booking platform — we are not a hospital, clinic, or medical provider, and
        AayuRahi is currently operated independently by its developer, not a registered company.
      </Section>
      <WarningBox>
        AayuRahi is a booking tool, not a doctor. Nothing on this app — including doctor profiles,
        reviews, chat messages, or prescriptions viewed in-app — is a substitute for an actual
        in-person medical examination, professional diagnosis, or treatment. Never delay or avoid
        seeking care because of something (or the absence of something) you saw on AayuRahi.
        <br/><br/>
        <u>If you are facing a medical emergency, do not use this app.</u> Call 108 (ambulance) or 112
        (national emergency number) immediately, or go straight to the nearest hospital.
      </WarningBox>
      <Section title="Your Account">
        You must provide accurate information when creating your account and keep your password
        secure. You're responsible for activity that happens under your account. Please keep one
        account per person.
      </Section>
      <Section title="Doctor Listings & Verification">
        Doctors who apply to be listed submit documents (medical registration, ID proof, degree
        certificate, and optionally clinic registration) which our admin team reviews before the
        listing goes live. While we review these documents, AayuRahi does not independently verify a
        doctor's medical competence and is not responsible for the accuracy of any doctor's listed
        qualifications, availability, or the medical advice or treatment they provide.
      </Section>
      <Section title="Appointments & Cancellations">
        Bookings are subject to the doctor's actual availability and may be rescheduled or cancelled
        by either the patient or the doctor.
      </Section>
      <Section title="Payments (Currently at the Clinic, Razorpay Coming Soon)">
        Right now, consultation fees are paid directly at the clinic when you visit — AayuRahi does
        not collect any money from you in-app. When in-app payment launches, it will be processed
        through Razorpay, a RBI-authorised Indian payment gateway, and will come with its own
        transaction and refund terms, published here before the feature goes live. AayuRahi will never
        ask you to pay outside of the official in-app Razorpay checkout once that's introduced —
        treat any such request as suspicious and report it to us.
      </Section>
      <Section title="Acceptable Use">
        Please don't provide false information, misuse the chat or review features, impersonate
        someone else, or harass doctors or patients through the app. We may suspend accounts that
        violate this.
      </Section>
      <Section title="Reviews">
        Reviews should reflect your genuine experience. We may remove reviews that are false,
        defamatory, or otherwise violate these terms.
      </Section>
      <Section title="Intellectual Property">
        The AayuRahi name, logo, and app content are owned by AayuRahi and may not be copied or reused
        without permission.
      </Section>
      <Section title="Limitation of Liability">
        AayuRahi is provided "as is." To the fullest extent permitted by law, we are not liable for
        indirect damages, medical outcomes, missed appointments due to technical issues, or outages of
        third-party services we rely on (such as Supabase, Firebase, or Razorpay).
      </Section>
      <Section title="Termination">
        We may suspend or terminate accounts that violate these terms.
      </Section>
      <Section title="Governing Law">
        These terms are governed by the laws of India, and courts in Purnea, Bihar shall have
        exclusive jurisdiction over any disputes.
      </Section>
      <Section title="Changes to These Terms">
        We may update these terms from time to time — most likely as new features like online
        payments launch; the "Last updated" date above will reflect the latest revision.
      </Section>
      <GetInTouch />
    </>
  );
}

/* ============================================================================
   LegalPage — shared viewer for both documents, with its own tab switcher so
   someone can flip between Privacy Policy and Terms of Service in place
   (inspired by a two-tab reference site), rather than needing to go back.
   - Used as an in-app overlay (pass onBack) from Auth screens, Profile &
     Settings screens, and the Admin "More" menu.
   - Used as a standalone public page (pass standalone) when the app is
     opened directly at /privacy or /terms — e.g. for app-store listings —
     with no login or app data required to render it.
============================================================================ */
export default function LegalPage({ doc, onBack, standalone = false }) {
  const [current, setCurrent] = useState(doc === "terms" ? "terms" : "privacy");
  const title = current === "terms" ? "Terms of Service" : "Privacy Policy";
  return (
    <div className="mq-fade-in" style={{ minHeight: "100%", background: COLORS.bg, overflowY: "auto" }}>
      <div style={{ position: "sticky", top: 0, background: "#fff", borderBottom: `1px solid ${COLORS.border}`, padding: "16px 20px 0", zIndex: 2 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
          {onBack && (
            <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", color: COLORS.muted, display: "flex", alignItems: "center", padding: 0 }}>
              <ArrowLeft size={20} />
            </button>
          )}
          <AayuRahiLogoMark size={26} />
          <div style={{ fontWeight: 800, fontSize: 16 }}>{title}</div>
        </div>
        <div style={{ display: "flex", gap: 6, paddingBottom: 12 }}>
          <button onClick={() => setCurrent("privacy")} style={{ flex: 1, padding: "8px 0", borderRadius: 10, border: "none", background: current === "privacy" ? COLORS.primarySoft : "transparent", color: current === "privacy" ? COLORS.primary : COLORS.muted, fontWeight: 700, fontSize: 12.5, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
            <ShieldCheck size={14} /> Privacy Policy
          </button>
          <button onClick={() => setCurrent("terms")} style={{ flex: 1, padding: "8px 0", borderRadius: 10, border: "none", background: current === "terms" ? COLORS.primarySoft : "transparent", color: current === "terms" ? COLORS.primary : COLORS.muted, fontWeight: 700, fontSize: 12.5, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
            <FileTextIcon size={14} /> Terms of Service
          </button>
        </div>
      </div>
      <div style={{ padding: "20px 20px 60px" }}>
        <div style={{ fontSize: 11.5, color: COLORS.muted, marginBottom: 18 }}>Last updated: {LEGAL_LAST_UPDATED}</div>
        {current === "terms" ? <TermsContent /> : <PrivacyPolicyContent />}
        {standalone && (
          <div style={{ marginTop: 30, textAlign: "center" }}>
            <a href="/" style={{ color: COLORS.primary, fontWeight: 700, fontSize: 13, textDecoration: "none" }}>← Open AayuRahi</a>
          </div>
        )}
      </div>
    </div>
  );
}
