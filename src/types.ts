export type AsciiStyle = "default" | "ascii";
export type AsciiMode = "light" | "dark";
export type BuiltInThemeName = "light" | "dark" | "sepia" | "matrix";
export type ThemeName = BuiltInThemeName | (string & {});
export type ThemeIntegrationMode = "auto" | "respect" | "managed";

export type ThemeDetection = {
  hasHostTheme: boolean;
  mode?: AsciiMode;
};

export type AsciiThemeTokens = {
  bg: string;
  fg: string;
  muted: string;
  border?: string;
  link?: string;
  codeBg?: string;
};

export type AsciiUiTokens = {
  bg?: string;
  fg?: string;
  muted?: string;
  border?: string;
  surface?: string;
  card?: string;
};

export type AsciiThemeDefinition = {
  label?: string;
  mode?: AsciiMode;
  colorScheme?: AsciiMode;
  ascii: AsciiThemeTokens;
  ui?: AsciiUiTokens;
};

export type AsciiThemeOptions = {
  storageKey?: string;
  defaultStyle?: AsciiStyle;
  managedMode?: boolean;
  defaultMode?: AsciiMode;
  defaultTheme?: ThemeName;
  themeAttr?: string;
  integrateTheme?: ThemeIntegrationMode;
  detectTheme?: (root: HTMLElement) => ThemeDetection;
  hasHostTheme?: boolean;
  addThemeToggle?: boolean;
  addStyleToggle?: boolean;
  mountSelector?: string | null;
  mountPlacement?: "append" | "prepend" | "afterThemeToggle";
  icons?: {
    sun?: string;
    moon?: string;
  };
  className?: string;
  base?: boolean;
  themes?: Record<string, AsciiThemeDefinition>;
  transitions?: boolean;
  keyboardShortcut?: false | "Alt+T";
};

export type AsciiThemeState = {
  style: AsciiStyle;
  theme: ThemeName;
  mode: AsciiMode;
  managedMode: boolean;
  base: boolean;
};

export type AsciiThemeListener = (state: AsciiThemeState) => void;

export type AsciiThemeController = {
  init(options?: AsciiThemeOptions): AsciiStyle;
  getState(): AsciiThemeState;
  subscribe(listener: AsciiThemeListener): () => void;
  setStyle(style: AsciiStyle): AsciiStyle;
  toggleStyle(): AsciiStyle;
  getStyle(): AsciiStyle;
  setMode(mode: AsciiMode): AsciiMode;
  toggleMode(): AsciiMode;
  getMode(): AsciiMode;
  setTheme(theme: ThemeName): ThemeName;
  getTheme(): ThemeName;
  registerTheme(name: ThemeName, definition: AsciiThemeDefinition): void;
  getThemes(): Record<string, AsciiThemeDefinition>;
};

export type StickerCategory = "dev" | "retro" | "emoji" | "borders";
export type StickerAnimation = "spinner" | "pulse" | "blink";
export type StickerPreset =
  | "box"
  | "progress"
  | "clock"
  | "status-badge"
  | "spinner";
export type StickerPosition =
  | "inline"
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right";

export type StickerConfig = {
  id: string;
  content?: string;
  preset?: StickerPreset;
  category?: StickerCategory;
  animate?: boolean;
  animation?: StickerAnimation;
  position?: StickerPosition;
  target?: string | HTMLElement;
  className?: string;
  ariaLabel?: string;
  decorative?: boolean;
  value?: number;
  max?: number;
  status?: string;
  intervalMs?: number;
  mount?: "append" | "prepend";
};
