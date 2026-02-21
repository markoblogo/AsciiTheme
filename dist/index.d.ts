import "./style.css";
export type AsciiStyle = "default" | "ascii";
export type AsciiMode = "light" | "dark";
export type ThemeIntegrationMode = "auto" | "respect" | "managed";
export type ThemeDetection = {
    hasHostTheme: boolean;
    mode?: AsciiMode;
};
export type AsciiThemeOptions = {
    storageKey?: string;
    defaultStyle?: AsciiStyle;
    managedMode?: boolean;
    defaultMode?: AsciiMode;
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
};
export declare function initAsciiTheme(options?: AsciiThemeOptions): AsciiStyle;
export declare function setAsciiStyle(style: AsciiStyle): AsciiStyle;
export declare function toggleAsciiStyle(): AsciiStyle;
export declare function getAsciiStyle(): AsciiStyle;
export declare function setAsciiMode(mode: AsciiMode): AsciiMode;
export declare function toggleAsciiMode(): AsciiMode;
export declare function renderAsciiStickers(rootNode?: ParentNode): void;
