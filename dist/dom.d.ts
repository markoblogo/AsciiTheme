export declare function getRoot(): HTMLElement;
export declare function queryAll<T extends Element>(selector: string, root?: ParentNode): T[];
export declare function readDataAttr(element: HTMLElement, key: string): string | undefined;
export declare function setDataAttr(element: HTMLElement, key: string, value: string): void;
export declare function getSystemMode(): "light" | "dark";
export declare function getPreferredMode(): "light" | "dark";
