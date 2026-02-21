const k = document.documentElement;
function p() {
  return k;
}
function A(t, e = document) {
  return Array.from(e.querySelectorAll(t));
}
function T() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}
function y(t) {
  try {
    const e = localStorage.getItem(t);
    if (!e)
      return {};
    const r = JSON.parse(e);
    if (!r || typeof r != "object")
      return {};
    const a = r;
    return {
      style: a.style === "ascii" ? "ascii" : a.style === "default" ? "default" : void 0,
      mode: a.mode === "dark" ? "dark" : a.mode === "light" ? "light" : void 0
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
const l = "asciiOriginalHtml", f = "data-ascii-sticker-rendered", $ = "pre.ascii-sticker";
function g(t, e = 2) {
  const r = t.replace(/\s+/g, " ").trim(), a = `${" ".repeat(e)}${r}${" ".repeat(e)}`, u = `┌${"─".repeat(a.length)}┐`, c = `│${a}│`, b = `└${"─".repeat(a.length)}┘`;
  return `${u}
${c}
${b}`;
}
function E(t) {
  t.dataset[l] || (t.dataset[l] = t.innerHTML);
  const e = (t.getAttribute("data-ascii-sticker") || "").trim();
  if (!e)
    return;
  const r = t.querySelector($);
  if (t.getAttribute(f) === "1" && r) {
    r.textContent = g(e);
    return;
  }
  t.innerHTML = "";
  const a = document.createElement("pre");
  a.className = "ascii-sticker", a.textContent = g(e), t.matches("button, a, [role='button']") && t.setAttribute("aria-label", e), t.appendChild(a), t.setAttribute(f, "1");
}
function R(t) {
  const e = t.dataset[l];
  e !== void 0 && (t.innerHTML = e, t.removeAttribute(f));
}
function h(t = document) {
  const e = A("[data-ascii-sticker]", t);
  for (const r of e)
    E(r);
}
function x(t = document) {
  const e = A("[data-ascii-sticker]", t);
  for (const r of e)
    R(r);
}
const s = {
  storageKey: "ascii_theme_v1",
  defaultStyle: "default",
  managedMode: !1,
  defaultMode: "light",
  themeAttr: "data-theme"
};
let i = { ...s };
const n = p();
function d(t) {
  return t === "ascii" ? "ascii" : "default";
}
function o(t) {
  return t === "dark" ? "dark" : "light";
}
function L(t) {
  if (!i.managedMode) {
    n.removeAttribute("data-ascii-mode");
    return;
  }
  const e = o(t ?? i.defaultMode);
  n.setAttribute("data-ascii-mode", e);
}
function M(t, e) {
  const r = y(i.storageKey);
  v(i.storageKey, {
    ...r,
    style: t,
    mode: i.managedMode ? e : void 0
  });
}
function m(t) {
  const e = d(t);
  n.setAttribute("data-style", e), e === "ascii" ? h(document) : x(document);
  const r = i.managedMode ? o(n.getAttribute("data-ascii-mode")) : void 0;
  return M(e, r), e;
}
function _(t = {}) {
  const e = t.managedMode ?? s.managedMode, r = t.defaultMode ? o(t.defaultMode) : e ? T() : s.defaultMode;
  i = {
    ...s,
    ...t,
    managedMode: e,
    defaultStyle: d(t.defaultStyle ?? s.defaultStyle),
    defaultMode: r
  };
  const a = y(i.storageKey), u = d(a.style ?? i.defaultStyle);
  if (i.managedMode)
    L(a.mode ?? i.defaultMode);
  else if (n.removeAttribute("data-ascii-mode"), i.themeAttr !== "data-theme") {
    const c = n.getAttribute(i.themeAttr);
    (c === "light" || c === "dark") && n.setAttribute("data-theme", c);
  }
  return m(u);
}
function H(t) {
  return m(t);
}
function I() {
  const t = S();
  return m(t === "ascii" ? "default" : "ascii");
}
function S() {
  return d(n.getAttribute("data-style"));
}
function O(t) {
  if (!i.managedMode)
    return o(n.getAttribute(i.themeAttr));
  const e = o(t);
  return n.setAttribute("data-ascii-mode", e), M(S(), e), e;
}
function N() {
  if (!i.managedMode)
    return o(n.getAttribute(i.themeAttr));
  const t = o(n.getAttribute("data-ascii-mode"));
  return O(t === "dark" ? "light" : "dark");
}
function w(t = document) {
  h(t);
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
