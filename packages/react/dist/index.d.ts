import { setAsciiMode, setAsciiStyle, setTheme, toggleAsciiMode, toggleAsciiStyle, type AsciiThemeOptions } from "@abvx/ascii-theme";
export declare function useAsciiTheme(): {
    setStyle: typeof setAsciiStyle;
    toggleStyle: typeof toggleAsciiStyle;
    setTheme: typeof setTheme;
    setMode: typeof setAsciiMode;
    toggleMode: typeof toggleAsciiMode;
    style: import("dist/types").AsciiStyle;
    theme: import("dist/types").ThemeName;
    mode: import("dist/types").AsciiMode;
    managedMode: boolean;
    base: boolean;
};
export declare function AsciiThemeBoot(props: {
    options?: AsciiThemeOptions;
}): null;
