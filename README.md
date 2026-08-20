# MediQ — Doctor Appointment Booking App

A full patient / doctor / admin appointment booking + live queue web app.

## Run it on your computer
```
npm install
npm run dev
```
Then open the link shown in the terminal (usually http://localhost:5173).

## Put it on the internet
Push this folder to GitHub, then import the repo at https://vercel.com/new.
Vercel auto-detects Vite and deploys it. You'll get a live URL.

## Important: current data storage
This version saves data in your browser's localStorage — great for demos
and testing, but each device/browser has its own separate data. To make
patient/doctor/admin data sync live across everyone, connect a real
database (Supabase is the easiest). See the full step-by-step guide the
assistant provided alongside this project.
