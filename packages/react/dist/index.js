// packages/react/src/index.ts
import { useEffect, useState } from "react";
import {
  getAsciiThemeState,
  initAsciiTheme,
  setAsciiMode,
  setAsciiStyle,
  setTheme,
  subscribeAsciiTheme,
  toggleAsciiMode,
  toggleAsciiStyle
} from "@abvx/ascii-theme";
function useAsciiTheme() {
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
    toggleMode: toggleAsciiMode
  };
}
function AsciiThemeBoot(props) {
  useEffect(() => {
    initAsciiTheme(props.options);
  }, []);
  return null;
}
export {
  AsciiThemeBoot,
  useAsciiTheme
};
