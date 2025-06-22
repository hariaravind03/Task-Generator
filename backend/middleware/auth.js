const admin = require("firebase-admin");

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    }),
  });
}

async function verifyFirebaseToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.log("[Auth] No Authorization header or Bearer token.");
    return res.status(401).json({ error: "Unauthorized" });
  }
  const idToken = authHeader.split("Bearer ")[1];
  console.log("[Auth] Received token:", idToken.slice(0, 10) + "... (truncated)");
  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    req.user = decodedToken;
    console.log(`[Auth] Token verified for user: ${decodedToken.uid}`);
    next();
  } catch (err) {
    console.error("[Auth] Token verification failed:", err.message);
    return res.status(401).json({ error: "Invalid token" });
  }
}

module.exports = verifyFirebaseToken; 