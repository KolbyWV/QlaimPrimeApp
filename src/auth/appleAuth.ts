import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";

const APPLE_EMAIL_KEY_PREFIX = "prime.apple.email.";

function normalizeEmail(value: string | null | undefined) {
  return String(value || "").trim().toLowerCase();
}

function getAppleAuthenticationModule() {
  try {
    // Loaded lazily so older dev clients without the native module do not crash on import.
    // eslint-disable-next-line @typescript-eslint/no-var-requires, global-require
    return require("expo-apple-authentication");
  } catch {
    return null;
  }
}

function appleEmailStorageKey(userId: string) {
  return `${APPLE_EMAIL_KEY_PREFIX}${userId}`;
}

export async function saveAppleEmailForUser(userId: string, email: string | null | undefined) {
  const normalized = normalizeEmail(email);
  if (!normalized) return;
  await SecureStore.setItemAsync(appleEmailStorageKey(userId), normalized);
}

export function isAppleAuthCanceled(error: any) {
  return error?.code === "ERR_REQUEST_CANCELED";
}

export function buildApplePassword(userId: string) {
  return `Qlaim#Apple#${userId}`;
}

export function isExistingAccountError(message: string) {
  const lower = String(message || "").toLowerCase();
  return (
    lower.includes("already exists") ||
    lower.includes("already registered") ||
    lower.includes("already in use") ||
    lower.includes("unique constraint")
  );
}

export async function startAppleAuthentication() {
  if (Platform.OS !== "ios") {
    throw new Error("Sign in with Apple is only available on iOS devices.");
  }
  const AppleAuthentication = getAppleAuthenticationModule();
  if (!AppleAuthentication) {
    throw new Error("Sign in with Apple is not available in this app build yet.");
  }

  const isAvailable = await AppleAuthentication.isAvailableAsync();
  if (!isAvailable) {
    throw new Error("Sign in with Apple is not available on this device.");
  }

  const credential = await AppleAuthentication.signInAsync({
    requestedScopes: [
      AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
      AppleAuthentication.AppleAuthenticationScope.EMAIL,
    ],
  });

  const userId = credential?.user || "";
  if (!userId) {
    throw new Error("Apple Sign In did not return a user identifier.");
  }

  const incomingEmail = normalizeEmail(credential?.email);
  await saveAppleEmailForUser(userId, incomingEmail);

  const storedEmail = normalizeEmail(await SecureStore.getItemAsync(appleEmailStorageKey(userId)));
  return {
    userId,
    email: incomingEmail || storedEmail || null,
  };
}
