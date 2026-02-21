const I = document.documentElement;
function x() {
  return I;
}
function k(t, e = document) {
  return Array.from(e.querySelectorAll(t));
}
function $() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}
function M(t) {
  try {
    const e = localStorage.getItem(t);
    if (!e)
      return {};
    const o = JSON.parse(e);
    if (!o || typeof o != "object")
      return {};
    const i = o;
    return {
      style: i.style === "ascii" ? "ascii" : i.style === "default" ? "default" : void 0,
      mode: i.mode === "dark" ? "dark" : i.mode === "light" ? "light" : void 0
    };
  } catch {
    return {};
  }
}
function N(t, e) {
  try {
    localStorage.setItem(t, JSON.stringify(e));
  } catch {
  }
}
const h = "asciiOriginalHtml", y = "data-ascii-sticker-rendered", L = "pre.ascii-sticker";
function p(t, e = 2) {
  const o = t.replace(/\s+/g, " ").trim(), i = `${" ".repeat(e)}${o}${" ".repeat(e)}`, d = `┌${"─".repeat(i.length)}┐`, u = `│${i}│`, m = `└${"─".repeat(i.length)}┘`;
  return `${d}
${u}
${m}`;
}
function R(t) {
  t.dataset[h] || (t.dataset[h] = t.innerHTML);
  const e = (t.getAttribute("data-ascii-sticker") || "").trim();
  if (!e)
    return;
  const o = t.querySelector(L);
  if (t.getAttribute(y) === "1" && o) {
    o.textContent = p(e);
    return;
  }
  t.innerHTML = "";
  const i = document.createElement("pre");
  i.className = "ascii-sticker", i.textContent = p(e), t.matches("button, a, [role='button']") && t.setAttribute("aria-label", e), t.appendChild(i), t.setAttribute(y, "1");
}
function w(t) {
  const e = t.dataset[h];
  e !== void 0 && (t.innerHTML = e, t.removeAttribute(y));
}
function v(t = document) {
  const e = k("[data-ascii-sticker]", t);
  for (const o of e)
    R(o);
}
function C(t = document) {
  const e = k("[data-ascii-sticker]", t);
  for (const o of e)
    w(o);
}
const g = {
  storageKey: "ascii_theme_v1",
  defaultStyle: "default",
  managedMode: !1,
  defaultMode: "light",
  themeAttr: "data-theme",
  addThemeToggle: !1,
  addStyleToggle: !1,
  mountSelector: "",
  mountPlacement: "append",
  icons: {
    sun: "☀",
    moon: "☾"
  },
  className: ""
};
let n = { ...g };
const a = x();
let c = null, s = null, f = null;
function A(t) {
  return t === "ascii" ? "ascii" : "default";
}
function r(t) {
  return t === "dark" ? "dark" : "light";
}
function O(t) {
  if (!n.managedMode) {
    a.removeAttribute("data-ascii-mode");
    return;
  }
  const e = r(t ?? n.defaultMode);
  a.setAttribute("data-ascii-mode", e);
}
function E(t, e) {
  const o = M(n.storageKey);
  N(n.storageKey, {
    ...o,
    style: t,
    mode: n.managedMode ? e : void 0
  });
}
function P() {
  return n.managedMode ? r(a.getAttribute("data-ascii-mode")) : r(a.getAttribute(n.themeAttr));
}
function l() {
  if (s) {
    const e = b() !== "ascii";
    s.textContent = e ? "ASCII" : "Default", s.setAttribute(
      "aria-label",
      e ? "Switch to ASCII style" : "Switch to default style"
    );
  }
  if (c) {
    const t = P(), e = t === "dark" ? n.icons.moon ?? "☾" : n.icons.sun ?? "☀";
    c.textContent = e, c.setAttribute(
      "aria-label",
      t === "dark" ? "Switch to light mode" : "Switch to dark mode"
    );
  }
}
function T(t, e) {
  const o = document.createElement("button");
  return o.type = "button", o.className = `ascii-theme-toggle-btn ${e}`.trim(), o.dataset.asciiToggleType = t, o;
}
function _() {
  var u;
  const t = n.mountSelector;
  if (!(!!t && (n.addThemeToggle || n.addStyleToggle)) || !t)
    return;
  const o = document.querySelector(t);
  if (!o)
    return;
  f != null && f.parentElement && f.remove();
  const i = document.createElement("div");
  i.className = "ascii-theme-toggle-group", i.setAttribute("data-ascii-controls", "1");
  const d = ((u = n.className) == null ? void 0 : u.trim()) || "";
  n.addThemeToggle ? (c = T("theme", d), c.addEventListener("click", () => {
    H(), l();
  })) : c = null, n.addStyleToggle ? (s = T("style", d), s.addEventListener("click", () => {
    j(), l();
  })) : s = null, c && i.append(c), s && i.append(s), n.mountPlacement === "prepend" ? o.prepend(i) : o.append(i), f = i, l();
}
function S(t) {
  const e = A(t);
  a.setAttribute("data-style", e), e === "ascii" ? v(document) : C(document);
  const o = n.managedMode ? r(a.getAttribute("data-ascii-mode")) : void 0;
  return E(e, o), l(), e;
}
function q(t = {}) {
  const e = t.managedMode ?? g.managedMode, o = t.defaultMode ? r(t.defaultMode) : e ? $() : g.defaultMode;
  n = {
    ...g,
    ...t,
    managedMode: e,
    defaultStyle: A(t.defaultStyle ?? g.defaultStyle),
    defaultMode: o
  }, n.mountPlacement === "afterThemeToggle" && !n.addThemeToggle && (n.mountPlacement = "append");
  const i = M(n.storageKey), d = A(i.style ?? n.defaultStyle);
  if (n.managedMode)
    O(i.mode ?? n.defaultMode);
  else if (a.removeAttribute("data-ascii-mode"), n.themeAttr !== "data-theme") {
    const m = a.getAttribute(n.themeAttr);
    (m === "light" || m === "dark") && a.setAttribute("data-theme", m);
  }
  _();
  const u = S(d);
  return l(), u;
}
function D(t) {
  return S(t);
}
function j() {
  const t = b();
  return S(t === "ascii" ? "default" : "ascii");
}
function b() {
  return A(a.getAttribute("data-style"));
}
function B(t) {
  if (!n.managedMode)
    return r(a.getAttribute(n.themeAttr));
  const e = r(t);
  return a.setAttribute("data-ascii-mode", e), E(b(), e), l(), e;
}
function H() {
  if (!n.managedMode)
    return r(a.getAttribute(n.themeAttr));
  const t = r(a.getAttribute("data-ascii-mode"));
  return B(t === "dark" ? "light" : "dark");
}
function K(t = document) {
  v(t);
}
export {
  b as getAsciiStyle,
  q as initAsciiTheme,
  K as renderAsciiStickers,
  B as setAsciiMode,
  D as setAsciiStyle,
  H as toggleAsciiMode,
  j as toggleAsciiStyle
};
