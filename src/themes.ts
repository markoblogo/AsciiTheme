import type {
  AsciiMode,
  AsciiThemeDefinition,
  AsciiThemeTokens,
  AsciiUiTokens,
  BuiltInThemeName,
  ThemeName,
} from "./types";

export const BUILT_IN_THEME_ORDER: BuiltInThemeName[] = [
  "light",
  "dark",
  "sepia",
  "matrix",
];

const BUILT_IN_THEMES: Record<BuiltInThemeName, AsciiThemeDefinition> = {
  light: {
    label: "Light",
    mode: "light",
    colorScheme: "light",
    ascii: {
      bg: "#ffffff",
      fg: "#0b2a7a",
      muted: "#1a409c",
      border: "#0b2a7a",
      link: "#0b2a7a",
      codeBg: "#eef2ff",
    },
    ui: {
      bg: "#f7f9ff",
      fg: "#121a2b",
      muted: "#3f4f73",
      border: "rgba(18, 26, 43, 0.22)",
      card: "#ffffff",
      surface: "#ffffff",
    },
  },
  dark: {
    label: "Dark",
    mode: "dark",
    colorScheme: "dark",
    ascii: {
      bg: "#000000",
      fg: "#39ff14",
      muted: "#2ddd18",
      border: "#39ff14",
      link: "#39ff14",
      codeBg: "#051305",
    },
    ui: {
      bg: "#0b0c10",
      fg: "rgba(255, 255, 255, 0.92)",
      muted: "rgba(255, 255, 255, 0.62)",
      border: "rgba(255, 255, 255, 0.18)",
      card: "#101722",
      surface: "#101722",
    },
  },
  sepia: {
    label: "Sepia",
    mode: "light",
    colorScheme: "light",
    ascii: {
      bg: "#f3ead6",
      fg: "#5b4636",
      muted: "#7c5d49",
      border: "#5b4636",
      link: "#7b5330",
      codeBg: "#e6d8bd",
    },
    ui: {
      bg: "#f4ecd8",
      fg: "#4f3b2d",
      muted: "#7f644d",
      border: "rgba(91, 70, 54, 0.28)",
      card: "#fcf4e4",
      surface: "#f8efdc",
    },
  },
  matrix: {
    label: "Matrix",
    mode: "dark",
    colorScheme: "dark",
    ascii: {
      bg: "#020b02",
      fg: "#39ff14",
      muted: "#1fbd33",
      border: "#39ff14",
      link: "#64ff70",
      codeBg: "#041204",
    },
    ui: {
      bg: "#050805",
      fg: "#b9ffbe",
      muted: "#74c977",
      border: "rgba(57, 255, 20, 0.28)",
      card: "#0c140c",
      surface: "#0c140c",
    },
  },
};

export function getBuiltInThemes(): Record<BuiltInThemeName, AsciiThemeDefinition> {
  return { ...BUILT_IN_THEMES };
}

function normalizeAsciiTokens(tokens: AsciiThemeTokens): AsciiThemeTokens {
  return {
    ...tokens,
    border: tokens.border ?? tokens.fg,
    link: tokens.link ?? tokens.fg,
    codeBg: tokens.codeBg ?? tokens.bg,
  };
}

function normalizeUiTokens(ascii: AsciiThemeTokens, ui?: AsciiUiTokens): Required<AsciiUiTokens> {
  return {
    bg: ui?.bg ?? ascii.bg,
    fg: ui?.fg ?? ascii.fg,
    muted: ui?.muted ?? ascii.muted,
    border: ui?.border ?? ascii.border ?? ascii.fg,
    card: ui?.card ?? ui?.surface ?? ascii.bg,
    surface: ui?.surface ?? ui?.card ?? ascii.bg,
  };
}

export function normalizeThemeDefinition(
  name: ThemeName,
  definition: AsciiThemeDefinition,
): AsciiThemeDefinition {
  const ascii = normalizeAsciiTokens(definition.ascii);
  const colorScheme = definition.colorScheme ?? definition.mode ?? "light";

  return {
    label: definition.label ?? String(name),
    mode: definition.mode ?? (colorScheme === "dark" ? "dark" : "light"),
    colorScheme,
    ascii,
    ui: normalizeUiTokens(ascii, definition.ui),
  };
}

export function resolveThemeMode(
  themeName: ThemeName,
  definition: AsciiThemeDefinition,
): AsciiMode {
  if (themeName === "dark" || themeName === "matrix") {
    return "dark";
  }
  if (themeName === "light" || themeName === "sepia") {
    return "light";
  }
  return definition.mode ?? definition.colorScheme ?? "light";
}

export function isBinaryTheme(themeName: ThemeName): themeName is "light" | "dark" {
  return themeName === "light" || themeName === "dark";
}
