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
// or in the background.
messaging.onBackgroundMessage((payload) => {
  const title = payload.notification?.title || payload.data?.title || "AayuRahi";
  const options = {
    body: payload.notification?.body || payload.data?.body || "",
    icon: "/icon-192.png",
    badge: "/icon-192.png",
  };
  self.registration.showNotification(title, options);
});

// Tapping the notification should open the app (or focus it if it's already
// open in a tab) instead of doing nothing.
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && "focus" in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow("/");
      }
    })
  );
});
