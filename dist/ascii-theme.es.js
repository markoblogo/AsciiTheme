const h = document.documentElement;
function p() {
  return h;
}
function m(t, e = document) {
  return Array.from(e.querySelectorAll(t));
}
function T() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}
function A(t) {
  try {
    const e = localStorage.getItem(t);
    if (!e)
      return {};
    const r = JSON.parse(e);
    if (!r || typeof r != "object")
      return {};
    const i = r;
    return {
      style: i.style === "ascii" ? "ascii" : i.style === "default" ? "default" : void 0,
      mode: i.mode === "dark" ? "dark" : i.mode === "light" ? "light" : void 0
    };
  } catch {
    return {};
  }
}
function v(t, e) {
  try {
    localStorage.setItem(t, JSON.stringify(e));
  } catch {
  }
}
const u = "asciiOriginalHtml", l = "data-ascii-sticker-rendered", $ = "pre.ascii-sticker";
function g(t, e = 2) {
  const r = t.replace(/\s+/g, " ").trim(), i = `${" ".repeat(e)}${r}${" ".repeat(e)}`, d = `┌${"─".repeat(i.length)}┐`, k = `│${i}│`, b = `└${"─".repeat(i.length)}┘`;
  return `${d}
${k}
${b}`;
}
function E(t) {
  t.dataset[u] || (t.dataset[u] = t.innerHTML);
  const e = (t.getAttribute("data-ascii-sticker") || "").trim();
  if (!e)
    return;
  const r = t.querySelector($);
  if (t.getAttribute(l) === "1" && r) {
    r.textContent = g(e);
    return;
  }
  t.innerHTML = "";
  const i = document.createElement("pre");
  i.className = "ascii-sticker", i.textContent = g(e), t.matches("button, a, [role='button']") && t.setAttribute("aria-label", e), t.appendChild(i), t.setAttribute(l, "1");
}
function R(t) {
  const e = t.dataset[u];
  e !== void 0 && (t.innerHTML = e, t.removeAttribute(l));
}
function y(t = document) {
  const e = m("[data-ascii-sticker]", t);
  for (const r of e)
    E(r);
}
function x(t = document) {
  const e = m("[data-ascii-sticker]", t);
  for (const r of e)
    R(r);
}
const c = {
  storageKey: "ascii_theme_v1",
  defaultStyle: "default",
  managedMode: !1,
  defaultMode: "light",
  themeAttr: "data-theme"
};
let a = { ...c };
const n = p();
function s(t) {
  return t === "ascii" ? "ascii" : "default";
}
function o(t) {
  return t === "dark" ? "dark" : "light";
}
function L(t) {
  if (!a.managedMode) {
    n.removeAttribute("data-ascii-mode");
    return;
  }
  const e = o(t ?? a.defaultMode);
  n.setAttribute("data-ascii-mode", e);
}
function M(t, e) {
  const r = A(a.storageKey);
  v(a.storageKey, {
    ...r,
    style: t,
    mode: a.managedMode ? e : void 0
  });
}
function f(t) {
  const e = s(t);
  n.setAttribute("data-style", e), e === "ascii" ? y(document) : x(document);
  const r = a.managedMode ? o(n.getAttribute("data-ascii-mode")) : void 0;
  return M(e, r), e;
}
function _(t = {}) {
  const e = t.managedMode ?? c.managedMode, r = t.defaultMode ? o(t.defaultMode) : e ? T() : c.defaultMode;
  a = {
    ...c,
    ...t,
    managedMode: e,
    defaultStyle: s(t.defaultStyle ?? c.defaultStyle),
    defaultMode: r
  };
  const i = A(a.storageKey), d = s(i.style ?? a.defaultStyle);
  return a.managedMode ? L(i.mode ?? a.defaultMode) : n.removeAttribute("data-ascii-mode"), f(d);
}
function H(t) {
  return f(t);
}
function I() {
  const t = S();
  return f(t === "ascii" ? "default" : "ascii");
}
function S() {
  return s(n.getAttribute("data-style"));
}
function O(t) {
  if (!a.managedMode)
    return o(n.getAttribute(a.themeAttr));
  const e = o(t);
  return n.setAttribute("data-ascii-mode", e), M(S(), e), e;
}
function N() {
  if (!a.managedMode)
    return o(n.getAttribute(a.themeAttr));
  const t = o(n.getAttribute("data-ascii-mode"));
  return O(t === "dark" ? "light" : "dark");
}
function w(t = document) {
  y(t);
}
export {
  S as getAsciiStyle,
  _ as initAsciiTheme,
  w as renderAsciiStickers,
  O as setAsciiMode,
  H as setAsciiStyle,
  N as toggleAsciiMode,
  I as toggleAsciiStyle
};
