import React from "react";
import * as Sentry from "@sentry/react";
import { COLORS } from "./App";

// Catches any crash happening inside the app's UI and shows a friendly,
// branded recovery screen instead of a blank white page. This is a safety
// net for real users — it can't prevent bugs, but it stops one broken
// screen from taking down the whole app experience.
export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("AayuRahi crashed:", error, info);
    if (import.meta.env.VITE_SENTRY_DSN) {
      Sentry.captureException(error, { extra: info });
    }
  }

  render() {
    if (!this.state.hasError) return this.props.children;
    return (
      <div style={{
        minHeight: "100vh", display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", padding: 28,
        textAlign: "center", fontFamily: "'Inter',system-ui,sans-serif",
        background: COLORS?.bg || "#F6F9FB",
      }}>
        <img src="/icon-512.png" alt="AayuRahi" width={64} height={64} style={{ borderRadius: 16, marginBottom: 18 }} />
        <div style={{ fontWeight: 800, fontSize: 18, marginBottom: 8, color: COLORS?.text || "#0F1B2D" }}>
          Something went wrong
        </div>
        <div style={{ fontSize: 14, color: COLORS?.muted || "#67788F", marginBottom: 22, maxWidth: 300 }}>
          This screen ran into a problem. Your data is safe — try reloading the app.
        </div>
        <button
          onClick={() => window.location.reload()}
          style={{
            background: COLORS?.primary || "#0D9C88", color: "#fff", border: "none",
            borderRadius: 14, padding: "12px 28px", fontWeight: 700, fontSize: 14.5, cursor: "pointer",
          }}
        >
          Reload App
        </button>
      </div>
    );
  }
}
