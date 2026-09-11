import { setAsciiMode, setAsciiStyle, setTheme, toggleAsciiMode, toggleAsciiStyle, type AsciiThemeOptions } from "@abvx/ascii-theme";
export declare function useAsciiTheme(): {
    setStyle: typeof setAsciiStyle;
    toggleStyle: typeof toggleAsciiStyle;
    setTheme: typeof setTheme;
    setMode: typeof setAsciiMode;
    toggleMode: typeof toggleAsciiMode;
    style: import("@abvx/ascii-theme").AsciiStyle;
    theme: import("@abvx/ascii-theme").ThemeName;
    mode: import("@abvx/ascii-theme").AsciiMode;
    managedMode: boolean;
    base: boolean;
};
export declare function AsciiThemeBoot(props: {
    options?: AsciiThemeOptions;
}): null;
