declare const HTMLElementBase: typeof HTMLElement;
export declare class AsciiThemeToggleElement extends HTMLElementBase {
    static get observedAttributes(): string[];
    private unsubscribe;
    private lastState;
    connectedCallback(): void;
    disconnectedCallback(): void;
    attributeChangedCallback(): void;
    private render;
}
export declare function defineAsciiThemeToggle(): void;
export {};
