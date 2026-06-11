import { computed, onScopeDispose, shallowRef } from "vue";

import {
  getAsciiThemeState,
  initAsciiTheme,
  setAsciiMode,
  setAsciiStyle,
  setTheme,
  subscribeAsciiTheme,
  toggleAsciiMode,
  toggleAsciiStyle,
  type AsciiThemeOptions,
} from "@abvx/ascii-theme";

export function useAsciiTheme() {
  const state = shallowRef(getAsciiThemeState());
  const unsubscribe = subscribeAsciiTheme((next) => {
    state.value = next;
  });
  onScopeDispose(unsubscribe);

  return {
    state,
    style: computed(() => state.value.style),
    theme: computed(() => state.value.theme),
    mode: computed(() => state.value.mode),
    managedMode: computed(() => state.value.managedMode),
    base: computed(() => state.value.base),
    setStyle: setAsciiStyle,
    toggleStyle: toggleAsciiStyle,
    setTheme,
    setMode: setAsciiMode,
    toggleMode: toggleAsciiMode,
  };
}

export function createAsciiThemePlugin(options?: AsciiThemeOptions) {
  return {
    install() {
      if (typeof window !== "undefined") {
        initAsciiTheme(options);
      }
    },
  };
}
