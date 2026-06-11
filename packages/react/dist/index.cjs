"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// packages/react/src/index.ts
var index_exports = {};
__export(index_exports, {
  AsciiThemeBoot: () => AsciiThemeBoot,
  useAsciiTheme: () => useAsciiTheme
});
module.exports = __toCommonJS(index_exports);
var import_react = require("react");
var import_ascii_theme = require("@abvx/ascii-theme");
function useAsciiTheme() {
  const [state, setState] = (0, import_react.useState)(() => (0, import_ascii_theme.getAsciiThemeState)());
  (0, import_react.useEffect)(() => (0, import_ascii_theme.subscribeAsciiTheme)((next) => {
    setState(next);
  }), []);
  return {
    ...state,
    setStyle: import_ascii_theme.setAsciiStyle,
    toggleStyle: import_ascii_theme.toggleAsciiStyle,
    setTheme: import_ascii_theme.setTheme,
    setMode: import_ascii_theme.setAsciiMode,
    toggleMode: import_ascii_theme.toggleAsciiMode
  };
}
function AsciiThemeBoot(props) {
  (0, import_react.useEffect)(() => {
    (0, import_ascii_theme.initAsciiTheme)(props.options);
  }, []);
  return null;
}
