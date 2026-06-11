import type { AsciiMode, AsciiThemeDefinition, BuiltInThemeName, ThemeName } from "./types";
export declare const BUILT_IN_THEME_ORDER: BuiltInThemeName[];
export declare function getBuiltInThemes(): Record<BuiltInThemeName, AsciiThemeDefinition>;
export declare function normalizeThemeDefinition(name: ThemeName, definition: AsciiThemeDefinition): AsciiThemeDefinition;
export declare function resolveThemeMode(themeName: ThemeName, definition: AsciiThemeDefinition): AsciiMode;
export declare function isBinaryTheme(themeName: ThemeName): themeName is "light" | "dark";
