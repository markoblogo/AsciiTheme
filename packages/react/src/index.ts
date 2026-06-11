import { useEffect, useState } from "react";

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
  const [state, setState] = useState(() => getAsciiThemeState());

  useEffect(() => subscribeAsciiTheme((next) => {
    setState(next);
  }), []);

  return {
    ...state,
    setStyle: setAsciiStyle,
    toggleStyle: toggleAsciiStyle,
    setTheme,
    setMode: setAsciiMode,
    toggleMode: toggleAsciiMode,
  };
}

export function AsciiThemeBoot(props: { options?: AsciiThemeOptions }) {
  useEffect(() => {
    initAsciiTheme(props.options);
  }, []);

  return null;
}
