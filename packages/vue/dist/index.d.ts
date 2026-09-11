import { setAsciiMode, setAsciiStyle, setTheme, toggleAsciiMode, toggleAsciiStyle, type AsciiThemeOptions } from "@abvx/ascii-theme";
export declare function useAsciiTheme(): {
    state: import("vue").ShallowRef<import("@abvx/ascii-theme").AsciiThemeState, import("@abvx/ascii-theme").AsciiThemeState>;
    style: import("vue").ComputedRef<import("@abvx/ascii-theme").AsciiStyle>;
    theme: import("vue").ComputedRef<import("@abvx/ascii-theme").ThemeName>;
    mode: import("vue").ComputedRef<import("@abvx/ascii-theme").AsciiMode>;
    managedMode: import("vue").ComputedRef<boolean>;
    base: import("vue").ComputedRef<boolean>;
    setStyle: typeof setAsciiStyle;
    toggleStyle: typeof toggleAsciiStyle;
    setTheme: typeof setTheme;
    setMode: typeof setAsciiMode;
    toggleMode: typeof toggleAsciiMode;
};
export declare function createAsciiThemePlugin(options?: AsciiThemeOptions): {
    install(): void;
};
