export type PersistedState = {
    style?: "default" | "ascii";
    mode?: "light" | "dark";
};
export declare function readState(storageKey: string): PersistedState;
export declare function writeState(storageKey: string, state: PersistedState): void;
