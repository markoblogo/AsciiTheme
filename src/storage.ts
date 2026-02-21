export type PersistedState = {
  style?: "default" | "ascii";
  mode?: "light" | "dark";
};

export function readState(storageKey: string): PersistedState {
  try {
    const raw = localStorage.getItem(storageKey);
    if (!raw) {
      return {};
    }
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") {
      return {};
    }
    const obj = parsed as Record<string, unknown>;
    return {
      style: obj.style === "ascii" ? "ascii" : obj.style === "default" ? "default" : undefined,
      mode: obj.mode === "dark" ? "dark" : obj.mode === "light" ? "light" : undefined,
    };
  } catch {
    return {};
  }
}

export function writeState(storageKey: string, state: PersistedState): void {
  try {
    localStorage.setItem(storageKey, JSON.stringify(state));
  } catch {
    // no-op
  }
}
