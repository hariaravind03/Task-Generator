import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
      clientEmail: process.env.NEXT_PUBLIC_CLIENT_EMAIL_FIREBASE,
      privateKey: process.env.NEXT_FIREBASE_PRIVATE_KEY,
    }),
  });
}

export const adminAuth = getAuth(); 