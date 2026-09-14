import React from "react";
import { ArrowLeft } from "lucide-react";
import { COLORS, AayuRahiLogoMark } from "./App";

/* ============================================================================
   LEGAL CONTENT — Privacy Policy & Terms of Service
   Plain-language drafts covering how AayuRahi actually works today. Update
   LEGAL_LAST_UPDATED whenever the wording changes, and review with a lawyer
   before relying on this for a real public launch / app-store submission —
   this is a solid starting point, not a substitute for legal advice.
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

function PrivacyPolicyContent() {
  return (
    <>
      <Section title="1. Introduction">
        AayuRahi ("we", "us", "our") operates a doctor appointment booking platform for Purnea, Bihar.
        This Privacy Policy explains what personal information we collect when you use the AayuRahi
        app, why we collect it, and how it is stored and protected.
      </Section>
      <Section title="2. Information We Collect">
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
        <b>Usage data:</b> anonymous visit and page-view analytics that do not identify you personally.
      </Section>
      <Section title="3. How We Use Your Information">
        We use your information to create and manage your account; let patients and doctors find each
        other and book appointments; send you notifications about chats, appointment status changes,
        reminders, new reviews, and prescriptions; review and verify doctor applications; protect the
        app from spam and abuse; and respond to support requests.
      </Section>
      <Section title="4. Where Your Data Is Stored">
        Your data is stored with Supabase (database, authentication, and file storage), with
        access rules that ensure you can generally only see your own data or data you're authorized to
        see (for example, a doctor can see appointments booked with them, but not another doctor's
        patients). Push notifications are delivered through Google Firebase Cloud Messaging. Some of
        these providers may process or store data on servers located outside India.
      </Section>
      <Section title="5. Sharing Your Information">
        We do not sell your personal information. We share it only: with the doctor or patient
        involved in a specific appointment or chat, so the booking can happen; with our service
        providers (Supabase, Firebase, Vercel, hCaptcha) solely to operate the app; or if required by
        law, court order, or government request.
      </Section>
      <Section title="6. Your Rights & Choices">
        You can ask us for a copy of the personal data we hold about you, ask us to correct it, or ask
        us to delete your account and associated data, by emailing us at <Contact/>. You can also turn
        off notification permissions at any time from your device settings.
      </Section>
      <Section title="7. Data Retention">
        We keep your information for as long as your account is active. Appointment and prescription
        records may be retained for a reasonable period after account closure for medical
        record-keeping and legal purposes, unless you request earlier deletion and no legal reason
        requires us to keep it.
      </Section>
      <Section title="8. Children's Privacy">
        AayuRahi accounts are intended for adults. If you want to book an appointment for a child or
        other dependent, please do so using the "Family Members" feature under your own account rather
        than creating a separate account for them.
      </Section>
      <Section title="9. Cookies & Local Storage">
        We use your browser's local storage to remember simple preferences like your chosen language
        and to keep you signed in. We do not use third-party advertising or tracking cookies.
      </Section>
      <Section title="10. Changes to This Policy">
        We may update this Privacy Policy from time to time. If we make significant changes, we'll
        update the "Last updated" date above. Continuing to use AayuRahi after a change means you
        accept the updated policy.
      </Section>
      <Section title="11. Contact Us">
        Questions about this policy or your data? Email us at <Contact/>.
      </Section>
    </>
  );
}

function TermsContent() {
  return (
    <>
      <Section title="1. Acceptance of Terms">
        By creating an account or using AayuRahi, you agree to these Terms of Service. If you do not
        agree, please do not use the app.
      </Section>
      <Section title="2. What AayuRahi Does">
        AayuRahi helps patients in Purnea, Bihar find doctors and book appointments with them, and
        helps doctors manage their appointments, chat with patients, and issue prescriptions. AayuRahi
        itself is a booking platform — we are not a hospital, clinic, or medical provider.
      </Section>
      <Section title="3. Medical Disclaimer">
        AayuRahi is not a substitute for professional medical advice, diagnosis, or treatment. Always
        seek the advice of a qualified doctor with any questions about a medical condition.
        <b> In a medical emergency, call your local emergency services or go to the nearest hospital
        immediately — do not rely on this app.</b>
      </Section>
      <Section title="4. Your Account">
        You must provide accurate information when creating your account and keep your password
        secure. You're responsible for activity that happens under your account. Please keep one
        account per person.
      </Section>
      <Section title="5. Doctor Listings & Verification">
        Doctors who apply to be listed submit documents (medical registration, ID proof, degree
        certificate, and optionally clinic registration) which our admin team reviews before the
        listing goes live. While we review these documents, AayuRahi does not independently verify a
        doctor's medical competence and is not responsible for the accuracy of any doctor's listed
        qualifications, availability, or the medical advice or treatment they provide.
      </Section>
      <Section title="6. Appointments & Cancellations">
        Bookings are subject to the doctor's actual availability and may be rescheduled or cancelled
        by either the patient or the doctor. At this time, consultation fees are paid directly at the
        clinic — AayuRahi does not yet process payments in-app.
      </Section>
      <Section title="7. Acceptable Use">
        Please don't provide false information, misuse the chat or review features, impersonate
        someone else, or harass doctors or patients through the app. We may suspend accounts that
        violate this.
      </Section>
      <Section title="8. Reviews">
        Reviews should reflect your genuine experience. We may remove reviews that are false,
        defamatory, or otherwise violate these terms.
      </Section>
      <Section title="9. Intellectual Property">
        The AayuRahi name, logo, and app content are owned by AayuRahi and may not be copied or reused
        without permission.
      </Section>
      <Section title="10. Limitation of Liability">
        AayuRahi is provided "as is." To the fullest extent permitted by law, we are not liable for
        indirect damages, medical outcomes, missed appointments due to technical issues, or outages of
        third-party services we rely on (such as Supabase or Firebase).
      </Section>
      <Section title="11. Termination">
        We may suspend or terminate accounts that violate these terms.
      </Section>
      <Section title="12. Governing Law">
        These terms are governed by the laws of India, and courts in Purnea, Bihar shall have
        exclusive jurisdiction over any disputes.
      </Section>
      <Section title="13. Changes to These Terms">
        We may update these terms from time to time; the "Last updated" date above will reflect the
        latest revision.
      </Section>
      <Section title="14. Contact Us">
        Questions about these terms? Email us at <Contact/>.
      </Section>
    </>
  );
}

/* ============================================================================
   LegalPage — shared viewer for both documents.
   - Used as an in-app overlay (pass onBack) from Auth screens, Profile &
     Settings screens, and the Admin "More" menu.
   - Used as a standalone public page (pass standalone) when the app is
     opened directly at /privacy or /terms — e.g. for app-store listings —
     with no login or app data required to render it.
============================================================================ */
export default function LegalPage({ doc, onBack, standalone = false }) {
  const title = doc === "terms" ? "Terms of Service" : "Privacy Policy";
  return (
    <div className="mq-fade-in" style={{ minHeight: "100%", background: COLORS.bg, overflowY: "auto" }}>
      <div style={{ position: "sticky", top: 0, background: "#fff", borderBottom: `1px solid ${COLORS.border}`, padding: "16px 20px", display: "flex", alignItems: "center", gap: 12, zIndex: 2 }}>
        {onBack && (
          <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", color: COLORS.muted, display: "flex", alignItems: "center", padding: 0 }}>
            <ArrowLeft size={20} />
          </button>
        )}
        <AayuRahiLogoMark size={26} />
        <div style={{ fontWeight: 800, fontSize: 16 }}>{title}</div>
      </div>
      <div style={{ padding: "20px 20px 60px" }}>
        <div style={{ fontSize: 11.5, color: COLORS.muted, marginBottom: 18 }}>Last updated: {LEGAL_LAST_UPDATED}</div>
        {doc === "terms" ? <TermsContent /> : <PrivacyPolicyContent />}
        {standalone && (
          <div style={{ marginTop: 30, textAlign: "center" }}>
            <a href="/" style={{ color: COLORS.primary, fontWeight: 700, fontSize: 13, textDecoration: "none" }}>← Open AayuRahi</a>
          </div>
        )}
      </div>
    </div>
  );
}
