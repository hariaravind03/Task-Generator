"use client"
import { useEffect } from "react";
import { auth } from "@/lib/firebase";
import { GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, User } from "firebase/auth";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function FirebaseLogin() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      if (user) {
        router.replace("/dashboard");
      }
    });
    return () => unsubscribe();
  }, [router]);

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
    // The redirect will happen in the onAuthStateChanged above
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {user ? (
        <>
          <div>Welcome, {user.displayName || user.email}!</div>
          <button className="px-4 py-2 bg-red-500 text-white rounded" onClick={handleLogout}>Sign Out</button>
        </>
      ) : (
        <button className="px-4 py-2 bg-blue-500 text-white rounded" onClick={handleLogin}>Sign in with Google</button>
      )}
    </div>
  );
} 