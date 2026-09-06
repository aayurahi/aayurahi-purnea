/* ============================================================================
   Firebase Cloud Messaging — push notifications
   Firebase is used ONLY for delivering push notifications to devices.
   Supabase remains the database, auth, and storage for everything else.
============================================================================ */
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage, isSupported } from "firebase/messaging";
import { supabase } from "./supabaseClient";

// Safe to be public — these values only identify the project to Google's
// servers; real access control is enforced separately by Firebase's own
// security rules, not by keeping this config secret.
const firebaseConfig = {
  apiKey: "AIzaSyAWcNBGsghTe2cb_OKTI7hopE7VuGaUDsI",
  authDomain: "aayurahi-purnea.firebaseapp.com",
  projectId: "aayurahi-purnea",
  storageBucket: "aayurahi-purnea.firebasestorage.app",
  messagingSenderId: "704574715976",
  appId: "1:704574715976:web:fc8c2d4a49a40c74f8807d",
};

const VAPID_KEY = "BACPhZ0rzoj7JhuuG5VjzO-IDvVobWtbkdQwqoYfe9ZemTnUfBCH1EAaYLhoedI9jMQR0LpbGhen4AgMF1RW6Vg";

const firebaseApp = initializeApp(firebaseConfig);

/* --------------------------- Request permission + save token ---------------------------
   Call this once a user is logged in (patient or doctor). It:
   1. Checks the browser actually supports push messaging (older iOS Safari
      versions, for example, may not).
   2. Registers the dedicated firebase-messaging-sw.js service worker.
   3. Asks the browser for notification permission (shows the native prompt).
   4. If granted, gets this device's unique FCM token and saves it to Supabase,
      linked to this user, so we know where to send notifications later. */
export async function requestNotificationPermission(userId) {
  try {
    const supported = await isSupported();
    if (!supported) return { ok: false, reason: "unsupported" };

    if (!("serviceWorker" in navigator)) return { ok: false, reason: "unsupported" };

    const registration = await navigator.serviceWorker.register("/firebase-messaging-sw.js");

    const permission = await Notification.requestPermission();
    if (permission !== "granted") return { ok: false, reason: "denied" };

    const messaging = getMessaging(firebaseApp);
    const token = await getToken(messaging, {
      vapidKey: VAPID_KEY,
      serviceWorkerRegistration: registration,
    });

    if (!token) return { ok: false, reason: "no-token" };

    // Save (or refresh) this device's token against the logged-in user.
    // onConflict on the token itself: if the same device/browser somehow
    // logs in as a different account later, the token just gets re-linked.
    await supabase.from("device_tokens").upsert(
      { user_id: userId, token },
      { onConflict: "token" }
    );

    return { ok: true, token };
  } catch (e) {
    return { ok: false, reason: "error", error: e };
  }
}

/* --------------------------- Foreground messages ---------------------------
   When the app is open and focused, Firebase delivers messages here instead
   of showing a system notification automatically — this lets the app show
   its own in-app toast instead. `onNotification` is a callback the caller
   supplies (e.g. to call showToast). */
export function listenForForegroundMessages(onNotification) {
  isSupported().then((supported) => {
    if (!supported) return;
    const messaging = getMessaging(firebaseApp);
    onMessage(messaging, (payload) => {
      const title = payload.notification?.title || payload.data?.title || "AayuRahi";
      const body = payload.notification?.body || payload.data?.body || "";
      onNotification?.(`${title}${body ? ": " + body : ""}`);
    });
  });
}
