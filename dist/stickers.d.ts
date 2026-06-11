import type { StickerConfig } from "./types";
export declare function renderAsciiStickers(root?: ParentNode): void;
export declare function restoreAsciiStickers(root?: ParentNode): void;
export declare function addSticker(config: StickerConfig): HTMLElement;
export declare function removeSticker(id: string): void;
export declare function updateSticker(id: string, patch: Partial<StickerConfig>): void;
