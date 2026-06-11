import { setAsciiMode, setAsciiStyle, setTheme, toggleAsciiMode, toggleAsciiStyle, type AsciiThemeOptions } from "@abvx/ascii-theme";
export declare function useAsciiTheme(): {
    state: import("vue").ShallowRef<import("dist/types").AsciiThemeState, import("dist/types").AsciiThemeState>;
    style: import("vue").ComputedRef<import("dist/types").AsciiStyle>;
    theme: import("vue").ComputedRef<import("dist/types").ThemeName>;
    mode: import("vue").ComputedRef<import("dist/types").AsciiMode>;
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
