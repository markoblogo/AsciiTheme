const L = document.documentElement;
function x() {
  return L;
}
function I(e, t = document) {
  return Array.from(t.querySelectorAll(e));
}
function $() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}
function v(e) {
  try {
    const t = localStorage.getItem(e);
    if (!t)
      return {};
    const a = JSON.parse(t);
    if (!a || typeof a != "object")
      return {};
    const r = a;
    return {
      style: r.style === "ascii" ? "ascii" : r.style === "default" ? "default" : void 0,
      mode: r.mode === "dark" ? "dark" : r.mode === "light" ? "light" : void 0
    };
  } catch {
    return {};
  }
}
function N(e, t) {
  try {
    localStorage.setItem(e, JSON.stringify(t));
  } catch {
  }
}
const b = "asciiOriginalHtml", M = "data-ascii-sticker-rendered", w = "pre.ascii-sticker";
function k(e, t = 2) {
  const a = e.replace(/\s+/g, " ").trim(), r = `${" ".repeat(t)}${a}${" ".repeat(t)}`, d = `┌${"─".repeat(r.length)}┐`, s = `│${r}│`, f = `└${"─".repeat(r.length)}┘`;
  return `${d}
${s}
${f}`;
}
function R(e) {
  e.dataset[b] || (e.dataset[b] = e.innerHTML);
  const t = (e.getAttribute("data-ascii-sticker") || "").trim();
  if (!t)
    return;
  const a = e.querySelector(w);
  if (e.getAttribute(M) === "1" && a) {
    a.textContent = k(t);
    return;
  }
  e.innerHTML = "";
  const r = document.createElement("pre");
  r.className = "ascii-sticker", r.textContent = k(t), e.matches("button, a, [role='button']") && e.setAttribute("aria-label", t), e.appendChild(r), e.setAttribute(M, "1");
}
function C(e) {
  const t = e.dataset[b];
  t !== void 0 && (e.innerHTML = t, e.removeAttribute(M));
}
function H(e = document) {
  const t = I("[data-ascii-sticker]", e);
  for (const a of t)
    R(a);
}
function O(e = document) {
  const t = I("[data-ascii-sticker]", e);
  for (const a of t)
    C(a);
}
const i = {
  storageKey: "ascii_theme_v1",
  defaultStyle: "default",
  managedMode: !1,
  defaultMode: "light",
  themeAttr: "data-theme",
  integrateTheme: "auto",
  addThemeToggle: !1,
  addStyleToggle: !1,
  mountSelector: "",
  mountPlacement: "append",
  icons: {
    sun: "☀",
    moon: "☾"
  },
  className: "",
  base: !1
};
let n = { ...i };
const o = x();
let l = null, u = null, g = null;
function h(e) {
  return e === "ascii" ? "ascii" : "default";
}
function c(e) {
  return e === "dark" ? "dark" : "light";
}
function y(e) {
  const t = o.getAttribute(e);
  if (t === "dark" || t === "light")
    return t;
  const a = o.getAttribute("data-theme");
  return a === "dark" || a === "light" ? a : o.classList.contains("dark") ? "dark" : (o.classList.contains("light"), "light");
}
function q(e) {
  const t = o.getAttribute(e);
  if (t === "dark" || t === "light")
    return { hasHostTheme: !0, mode: t };
  const a = o.getAttribute("data-theme");
  return a === "dark" || a === "light" ? { hasHostTheme: !0, mode: a } : o.classList.contains("dark") ? { hasHostTheme: !0, mode: "dark" } : o.classList.contains("light") ? { hasHostTheme: !0, mode: "light" } : { hasHostTheme: !1 };
}
function B(e) {
  const t = e.integrateTheme ?? i.integrateTheme, a = e.addThemeToggle ?? i.addThemeToggle, r = e.managedMode, d = e.defaultMode ? c(e.defaultMode) : $();
  if (t === "managed")
    return {
      managedMode: !0,
      addThemeToggle: a,
      defaultMode: d
    };
  if (t === "respect")
    return {
      managedMode: !1,
      addThemeToggle: !1,
      defaultMode: y(e.themeAttr ?? i.themeAttr)
    };
  const s = e.detectTheme ? e.detectTheme(o) : q(e.themeAttr ?? i.themeAttr);
  return e.hasHostTheme ?? s.hasHostTheme ? {
    managedMode: !1,
    addThemeToggle: !1,
    defaultMode: c(s.mode ?? y(e.themeAttr ?? i.themeAttr))
  } : {
    managedMode: r ?? (a ? !0 : i.managedMode),
    addThemeToggle: a,
    defaultMode: d
  };
}
function P(e) {
  if (!n.managedMode) {
    o.removeAttribute("data-ascii-mode");
    return;
  }
  const t = c(e ?? n.defaultMode);
  o.setAttribute("data-ascii-mode", t);
}
function E(e, t) {
  const a = v(n.storageKey);
  N(n.storageKey, {
    ...a,
    style: e,
    mode: n.managedMode ? t : void 0
  });
}
function _() {
  return n.managedMode ? c(o.getAttribute("data-ascii-mode")) : y(n.themeAttr);
}
function m() {
  if (u) {
    const t = S() !== "ascii";
    u.textContent = t ? "ASCII" : "Default", u.setAttribute(
      "aria-label",
      t ? "Switch to ASCII style" : "Switch to default style"
    );
  }
  if (l) {
    const e = _(), t = e === "dark" ? n.icons.moon ?? "☾" : n.icons.sun ?? "☀";
    l.textContent = t, l.setAttribute(
      "aria-label",
      e === "dark" ? "Switch to light mode" : "Switch to dark mode"
    );
  }
}
function p(e, t) {
  const a = document.createElement("button");
  return a.type = "button", a.className = `ascii-theme-toggle-btn ${t}`.trim(), a.dataset.asciiToggleType = e, a;
}
function j() {
  var s;
  const e = n.mountSelector;
  if (!(!!e && (n.addThemeToggle || n.addStyleToggle)) || !e)
    return;
  const a = document.querySelector(e);
  if (!a)
    return;
  g != null && g.parentElement && g.remove();
  const r = document.createElement("div");
  r.className = "ascii-theme-toggle-group", r.setAttribute("data-ascii-controls", "1");
  const d = ((s = n.className) == null ? void 0 : s.trim()) || "";
  n.addThemeToggle ? (l = p("theme", d), l.addEventListener("click", () => {
    z(), m();
  })) : l = null, n.addStyleToggle && !n.base ? (u = p("style", d), u.addEventListener("click", () => {
    D(), m();
  })) : u = null, l && r.append(l), u && r.append(u), n.mountPlacement === "prepend" ? a.prepend(r) : a.append(r), g = r, m();
}
function T(e) {
  const t = n.base ? "ascii" : h(e);
  o.setAttribute("data-style", t), t === "ascii" ? H(document) : O(document);
  const a = n.managedMode ? c(o.getAttribute("data-ascii-mode")) : void 0;
  return E(t, a), m(), t;
}
function J(e = {}) {
  const t = e.base ?? i.base, a = {
    ...e,
    managedMode: t ? e.managedMode ?? !0 : e.managedMode
  }, r = B(a);
  n = {
    ...i,
    ...a,
    base: t,
    managedMode: r.managedMode,
    addThemeToggle: r.addThemeToggle,
    addStyleToggle: t ? !1 : a.addStyleToggle ?? i.addStyleToggle,
    defaultStyle: t ? "ascii" : h(a.defaultStyle ?? i.defaultStyle),
    defaultMode: r.defaultMode
  }, n.mountPlacement === "afterThemeToggle" && !n.addThemeToggle && (n.mountPlacement = "append");
  const d = v(n.storageKey), s = n.base ? "ascii" : h(d.style ?? n.defaultStyle);
  if (n.managedMode)
    P(d.mode ?? n.defaultMode);
  else if (o.removeAttribute("data-ascii-mode"), n.themeAttr !== "data-theme") {
    const A = o.getAttribute(n.themeAttr);
    (A === "light" || A === "dark") && o.setAttribute("data-theme", A);
  }
  j();
  const f = T(s);
  return m(), f;
}
function U(e) {
  return T(e);
}
function D() {
  if (n.base)
    return T("ascii");
  const e = S();
  return T(e === "ascii" ? "default" : "ascii");
}
function S() {
  return n.base ? "ascii" : h(o.getAttribute("data-style"));
}
function K(e) {
  if (!n.managedMode)
    return c(o.getAttribute(n.themeAttr));
  const t = c(e);
  return o.setAttribute("data-ascii-mode", t), E(S(), t), m(), t;
}
function z() {
  if (!n.managedMode)
    return c(o.getAttribute(n.themeAttr));
  const e = c(o.getAttribute("data-ascii-mode"));
  return K(e === "dark" ? "light" : "dark");
}
function F(e = document) {
  H(e);
}
export {
  S as getAsciiStyle,
  J as initAsciiTheme,
  F as renderAsciiStickers,
  K as setAsciiMode,
  U as setAsciiStyle,
  z as toggleAsciiMode,
  D as toggleAsciiStyle
};
