export type PersistedState = {
    style?: "default" | "ascii";
    mode?: "light" | "dark";
    theme?: string;
};
export declare function readState(storageKey: string): PersistedState;
export declare function writeState(storageKey: string, state: PersistedState): void;
