const k = document.documentElement;
function b() {
  return k;
}
function m(t, e = document) {
  return Array.from(e.querySelectorAll(t));
}
function p() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}
function g(t) {
  try {
    const e = localStorage.getItem(t);
    if (!e)
      return {};
    const i = JSON.parse(e);
    if (!i || typeof i != "object")
      return {};
    const r = i;
    return {
      style: r.style === "ascii" ? "ascii" : r.style === "default" ? "default" : void 0,
      mode: r.mode === "dark" ? "dark" : r.mode === "light" ? "light" : void 0
    };
  } catch {
    return {};
  }
}
function $(t, e) {
  try {
    localStorage.setItem(t, JSON.stringify(e));
  } catch {
  }
}
const u = "asciiOriginalHtml";
function f(t, e = 2) {
  const i = t.replace(/\s+/g, " ").trim(), r = `${" ".repeat(e)}${i}${" ".repeat(e)}`, d = `┌${"─".repeat(r.length)}┐`, S = `│${r}│`, h = `└${"─".repeat(r.length)}┘`;
  return `${d}
${S}
${h}`;
}
function v(t) {
  t.dataset[u] || (t.dataset[u] = t.innerHTML);
  const e = (t.getAttribute("data-ascii-sticker") || "").trim();
  if (!e)
    return;
  const i = t.firstElementChild;
  if (i && i.tagName === "PRE" && i.classList.contains("ascii-sticker") && t.childElementCount === 1) {
    i.textContent = f(e);
    return;
  }
  t.innerHTML = "";
  const r = document.createElement("pre");
  r.className = "ascii-sticker", r.textContent = f(e), t.matches("button, a, [role='button']") && t.setAttribute("aria-label", e), t.appendChild(r);
}
function T(t) {
  const e = t.dataset[u];
  e !== void 0 && (t.innerHTML = e);
}
function A(t = document) {
  const e = m("[data-ascii-sticker]", t);
  for (const i of e)
    v(i);
}
function x(t = document) {
  const e = m("[data-ascii-sticker]", t);
  for (const i of e)
    T(i);
}
const c = {
  storageKey: "ascii_theme_v1",
  defaultStyle: "default",
  managedMode: !1,
  defaultMode: "light",
  themeAttr: "data-theme"
};
let n = { ...c };
const a = b();
function s(t) {
  return t === "ascii" ? "ascii" : "default";
}
function o(t) {
  return t === "dark" ? "dark" : "light";
}
function L(t) {
  if (!n.managedMode) {
    a.removeAttribute("data-ascii-mode");
    return;
  }
  const e = o(t ?? n.defaultMode);
  a.setAttribute("data-ascii-mode", e);
}
function y(t, e) {
  const i = g(n.storageKey);
  $(n.storageKey, {
    ...i,
    style: t,
    mode: n.managedMode ? e : void 0
  });
}
function l(t) {
  const e = s(t);
  a.setAttribute("data-style", e), e === "ascii" ? A(document) : x(document);
  const i = n.managedMode ? o(a.getAttribute("data-ascii-mode")) : void 0;
  return y(e, i), e;
}
function O(t = {}) {
  const e = t.managedMode ?? c.managedMode, i = t.defaultMode ? o(t.defaultMode) : e ? p() : c.defaultMode;
  n = {
    ...c,
    ...t,
    managedMode: e,
    defaultStyle: s(t.defaultStyle ?? c.defaultStyle),
    defaultMode: i
  };
  const r = g(n.storageKey), d = s(r.style ?? n.defaultStyle);
  return n.managedMode ? L(r.mode ?? n.defaultMode) : a.removeAttribute("data-ascii-mode"), l(d);
}
function C(t) {
  return l(t);
}
function H() {
  const t = M();
  return l(t === "ascii" ? "default" : "ascii");
}
function M() {
  return s(a.getAttribute("data-style"));
}
function E(t) {
  if (!n.managedMode)
    return o(a.getAttribute(n.themeAttr));
  const e = o(t);
  return a.setAttribute("data-ascii-mode", e), y(M(), e), e;
}
function I() {
  if (!n.managedMode)
    return o(a.getAttribute(n.themeAttr));
  const t = o(a.getAttribute("data-ascii-mode"));
  return E(t === "dark" ? "light" : "dark");
}
function N(t = document) {
  A(t);
}
export {
  M as getAsciiStyle,
  O as initAsciiTheme,
  N as renderAsciiStickers,
  E as setAsciiMode,
  C as setAsciiStyle,
  I as toggleAsciiMode,
  H as toggleAsciiStyle
};
