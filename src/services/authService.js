import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth } from "../firebase/config";

const ADMIN_EMAILS = (import.meta.env.VITE_ADMIN_EMAILS || "")
  .split(",")
  .map((email) => email.trim().toLowerCase())
  .filter(Boolean);

export function isAdminEmail(email) {
  if (!email) return false;

  // If no whitelist is configured, allow any authenticated user.
  if (ADMIN_EMAILS.length === 0) return true;

  return ADMIN_EMAILS.includes(email.toLowerCase());
}

export async function loginAdmin(email, password) {
  const credential = await signInWithEmailAndPassword(auth, email, password);

  if (!isAdminEmail(credential.user.email)) {
    await signOut(auth);
    throw new Error("Este usuario no tiene permisos de administrador.");
  }

  return credential.user;
}

export function onAdminAuthStateChanged(callback) {
  return onAuthStateChanged(auth, async (user) => {
    if (user && !isAdminEmail(user.email)) {
      await signOut(auth);
      callback(null);
      return;
    }

    callback(user);
  });
}

export function logoutAdmin() {
  return signOut(auth);
}
