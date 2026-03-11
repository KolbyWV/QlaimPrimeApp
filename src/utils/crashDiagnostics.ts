import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";

const LAST_FATAL_ERROR_KEY = "prime.lastFatalError";
const MAX_STORED_LENGTH = 3000;

let handlerInstalled = false;

function toSerializableError(error: unknown) {
  const base =
    error instanceof Error
      ? {
          name: error.name,
          message: error.message,
          stack: error.stack,
        }
      : {
          name: "NonError",
          message: String(error),
          stack: null,
        };

  return {
    ...base,
    platform: Platform.OS,
  };
}

function truncate(value: string) {
  if (value.length <= MAX_STORED_LENGTH) return value;
  return value.slice(0, MAX_STORED_LENGTH);
}

async function writePayload(payload: Record<string, unknown>) {
  try {
    await SecureStore.setItemAsync(LAST_FATAL_ERROR_KEY, truncate(JSON.stringify(payload)));
  } catch {
    // Avoid throwing while handling another exception.
  }
}

export async function readLastFatalError() {
  try {
    const raw = await SecureStore.getItemAsync(LAST_FATAL_ERROR_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export async function clearLastFatalError() {
  try {
    await SecureStore.deleteItemAsync(LAST_FATAL_ERROR_KEY);
  } catch {
    // best effort only
  }
}

export function recordFatalError(
  source: string,
  error: unknown,
  context: Record<string, unknown> = {},
) {
  const payload = {
    source,
    context,
    capturedAt: new Date().toISOString(),
    error: toSerializableError(error),
  };

  void writePayload(payload);
}

export function installGlobalErrorHandler() {
  if (handlerInstalled) return;
  handlerInstalled = true;

  const errorUtils = (globalThis as any)?.ErrorUtils;
  if (!errorUtils?.getGlobalHandler || !errorUtils?.setGlobalHandler) {
    return;
  }

  const previous = errorUtils.getGlobalHandler();
  errorUtils.setGlobalHandler((error: unknown, isFatal?: boolean) => {
    recordFatalError("global", error, { isFatal: !!isFatal });
    if (typeof previous === "function") {
      previous(error, isFatal);
    }
  });
}
