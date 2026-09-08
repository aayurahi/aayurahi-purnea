/* This file must live at the site root (/firebase-messaging-sw.js) — Firebase
   requires that exact path and filename for its background messaging to work.
   It runs separately from the app's main PWA service worker (sw.js) and only
   handles push notifications; it doesn't do any offline caching. */
importScripts("https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.14.1/firebase-messaging-compat.js");

// Same public config as src/firebaseMessaging.js — a service worker can't
// read Vite's environment variables, so it's repeated here directly.
firebase.initializeApp({
  apiKey: "AIzaSyAWcNBGsghTe2cb_OKTI7hopE7VuGaUDsI",
  authDomain: "aayurahi-purnea.firebaseapp.com",
  projectId: "aayurahi-purnea",
  storageBucket: "aayurahi-purnea.firebasestorage.app",
  messagingSenderId: "704574715976",
  appId: "1:704574715976:web:fc8c2d4a49a40c74f8807d",
});

const messaging = firebase.messaging();

// Shows a system notification when a push arrives while the app is closed
// or in the background. `data` (chatId, type, etc.) is carried along so the
// notificationclick handler below knows exactly where to take the person.
messaging.onBackgroundMessage((payload) => {
  const title = payload.notification?.title || payload.data?.title || "AayuRahi";
  const options = {
    body: payload.notification?.body || payload.data?.body || "",
    icon: "/icon-192.png",
    badge: "/icon-192.png",
    data: payload.data || {},
  };
  self.registration.showNotification(title, options);
});

// Tapping the notification takes the person to the exact place it's about —
// e.g. straight into the relevant chat conversation or appointment, not just
// the app's home screen. This is generic: any notification type just needs
// its relevant id fields in `data`, and App.jsx interprets `data.type` to
// decide where to navigate — no service-worker change needed for new types.
// If a tab is already open, we focus it and hand it the destination via
// postMessage (focusing doesn't reload the page); otherwise we open a fresh
// tab with the destination encoded in the URL, which the app reads on load.
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const data = event.notification.data || {};

  const params = new URLSearchParams();
  if (data.type) params.set("notifType", data.type);
  if (data.chatId) params.set("chatId", data.chatId);
  if (data.apptId) params.set("apptId", data.apptId);
  const targetUrl = [...params].length ? `/?${params.toString()}` : "/";

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && "focus" in client) {
          client.focus();
          if (data.type) {
            client.postMessage({ type: "notificationTapped", data });
          }
          return;
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});
