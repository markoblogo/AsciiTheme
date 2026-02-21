function s() {
  return document.documentElement;
}
function I(e, t = document) {
  return Array.from(t.querySelectorAll(e));
}
function w() {
  return typeof window > "u" || typeof window.matchMedia != "function" ? "light" : window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}
function $() {
  return w();
}
function H(e) {
  try {
    const t = localStorage.getItem(e);
    if (!t)
      return {};
    const a = JSON.parse(t);
    if (!a || typeof a != "object")
      return {};
    const o = a;
    return {
      style: o.style === "ascii" ? "ascii" : o.style === "default" ? "default" : void 0,
      mode: o.mode === "dark" ? "dark" : o.mode === "light" ? "light" : void 0
    };
  } catch {
    return {};
  }
}
function E(e, t) {
  try {
    localStorage.setItem(e, JSON.stringify(t));
  } catch {
  }
}
const b = "asciiOriginalHtml", S = "data-ascii-sticker-rendered", N = "pre.ascii-sticker";
function p(e, t = 2) {
  const a = e.replace(/\s+/g, " ").trim(), o = `${" ".repeat(t)}${a}${" ".repeat(t)}`, r = `┌${"─".repeat(o.length)}┐`, c = `│${o}│`, g = `└${"─".repeat(o.length)}┘`;
  return `${r}
${c}
${g}`;
}
function C(e) {
  e.dataset[b] || (e.dataset[b] = e.innerHTML);
  const t = (e.getAttribute("data-ascii-sticker") || "").trim();
  if (!t)
    return;
  const a = e.querySelector(N);
  if (e.getAttribute(S) === "1" && a) {
    a.textContent = p(t);
    return;
  }
  e.innerHTML = "";
  const o = document.createElement("pre");
  o.className = "ascii-sticker", o.textContent = p(t), e.matches("button, a, [role='button']") && e.setAttribute("aria-label", t), e.appendChild(o), e.setAttribute(S, "1");
}
function R(e) {
  const t = e.dataset[b];
  t !== void 0 && (e.innerHTML = t, e.removeAttribute(S));
}
function L(e = document) {
  const t = I("[data-ascii-sticker]", e);
  for (const a of t)
    C(a);
}
function q(e = document) {
  const t = I("[data-ascii-sticker]", e);
  for (const a of t)
    R(a);
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
let n = { ...i }, l = null, u = null, h = null;
function T(e) {
  return e === "ascii" ? "ascii" : "default";
}
function d(e) {
  return e === "dark" ? "dark" : "light";
}
function A(e) {
  const t = s(), a = t.getAttribute(e);
  if (a === "dark" || a === "light")
    return a;
  const o = t.getAttribute("data-theme");
  return o === "dark" || o === "light" ? o : t.classList.contains("dark") ? "dark" : (t.classList.contains("light"), "light");
}
function B(e) {
  const t = s(), a = t.getAttribute(e);
  if (a === "dark" || a === "light")
    return { hasHostTheme: !0, mode: a };
  const o = t.getAttribute("data-theme");
  return o === "dark" || o === "light" ? { hasHostTheme: !0, mode: o } : t.classList.contains("dark") ? { hasHostTheme: !0, mode: "dark" } : t.classList.contains("light") ? { hasHostTheme: !0, mode: "light" } : { hasHostTheme: !1 };
}
function O(e) {
  const t = e.integrateTheme ?? i.integrateTheme, a = e.addThemeToggle ?? i.addThemeToggle, o = e.managedMode, r = e.defaultMode ? d(e.defaultMode) : $();
  if (t === "managed")
    return {
      managedMode: !0,
      addThemeToggle: a,
      defaultMode: r
    };
  if (t === "respect")
    return {
      managedMode: !1,
      addThemeToggle: !1,
      defaultMode: A(e.themeAttr ?? i.themeAttr)
    };
  const c = s(), g = e.detectTheme ? e.detectTheme(c) : B(e.themeAttr ?? i.themeAttr);
  return e.hasHostTheme ?? g.hasHostTheme ? {
    managedMode: !1,
    addThemeToggle: !1,
    defaultMode: d(g.mode ?? A(e.themeAttr ?? i.themeAttr))
  } : {
    managedMode: o ?? (a ? !0 : i.managedMode),
    addThemeToggle: a,
    defaultMode: r
  };
}
function P(e) {
  const t = s();
  if (!n.managedMode) {
    t.removeAttribute("data-ascii-mode");
    return;
  }
  const a = d(e ?? n.defaultMode);
  t.setAttribute("data-ascii-mode", a);
}
function x(e, t) {
  const a = H(n.storageKey);
  E(n.storageKey, {
    ...a,
    style: e,
    mode: n.managedMode ? t : void 0
  });
}
function _() {
  if (n.managedMode) {
    const e = s();
    return d(e.getAttribute("data-ascii-mode"));
  }
  return A(n.themeAttr);
}
function f() {
  if (u) {
    const t = k() !== "ascii";
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
function v(e, t) {
  const a = document.createElement("button");
  return a.type = "button", a.className = `ascii-theme-toggle-btn ${t}`.trim(), a.dataset.asciiToggleType = e, a;
}
function j() {
  var c;
  const e = n.mountSelector;
  if (!(!!e && (n.addThemeToggle || n.addStyleToggle)) || !e)
    return;
  const a = document.querySelector(e);
  if (!a)
    return;
  h != null && h.parentElement && h.remove();
  const o = document.createElement("div");
  o.className = "ascii-theme-toggle-group", o.setAttribute("data-ascii-controls", "1");
  const r = ((c = n.className) == null ? void 0 : c.trim()) || "";
  n.addThemeToggle ? (l = v("theme", r), l.addEventListener("click", () => {
    z(), f();
  })) : l = null, n.addStyleToggle && !n.base ? (u = v("style", r), u.addEventListener("click", () => {
    D(), f();
  })) : u = null, l && o.append(l), u && o.append(u), n.mountPlacement === "prepend" ? a.prepend(o) : a.append(o), h = o, f();
}
function y(e) {
  const t = s(), a = n.base ? "ascii" : T(e);
  t.setAttribute("data-style", a), a === "ascii" ? L(document) : q(document);
  const o = n.managedMode ? d(t.getAttribute("data-ascii-mode")) : void 0;
  return x(a, o), f(), a;
}
function J(e = {}) {
  const t = e.base ?? i.base;
  if (typeof window > "u" || typeof document > "u")
    return t ? "ascii" : T(e.defaultStyle ?? i.defaultStyle);
  const a = {
    ...e,
    managedMode: t ? e.managedMode ?? !0 : e.managedMode
  }, o = O(a);
  n = {
    ...i,
    ...a,
    base: t,
    managedMode: o.managedMode,
    addThemeToggle: o.addThemeToggle,
    addStyleToggle: t ? !1 : a.addStyleToggle ?? i.addStyleToggle,
    defaultStyle: t ? "ascii" : T(a.defaultStyle ?? i.defaultStyle),
    defaultMode: o.defaultMode
  }, n.mountPlacement === "afterThemeToggle" && !n.addThemeToggle && (n.mountPlacement = "append");
  const r = H(n.storageKey), c = n.base ? "ascii" : T(r.style ?? n.defaultStyle);
  if (n.managedMode) {
    const m = r.mode ? d(r.mode) : e.defaultMode ? d(e.defaultMode) : w();
    P(m), r.mode || E(n.storageKey, {
      ...r,
      style: c,
      mode: m
    });
  } else {
    const m = s();
    if (m.removeAttribute("data-ascii-mode"), n.themeAttr !== "data-theme") {
      const M = m.getAttribute(n.themeAttr);
      (M === "light" || M === "dark") && m.setAttribute("data-theme", M);
    }
  }
  j();
  const g = y(c);
  return f(), g;
}
function U(e) {
  return y(e);
}
function D() {
  if (n.base)
    return y("ascii");
  const e = k();
  return y(e === "ascii" ? "default" : "ascii");
}
function k() {
  if (n.base)
    return "ascii";
  const e = s();
  return T(e.getAttribute("data-style"));
}
function K(e) {
  if (!n.managedMode)
    return d(A(n.themeAttr));
  const t = s(), a = d(e);
  return t.setAttribute("data-ascii-mode", a), x(k(), a), f(), a;
}
function z() {
  if (!n.managedMode)
    return d(A(n.themeAttr));
  const e = s(), t = d(e.getAttribute("data-ascii-mode"));
  return K(t === "dark" ? "light" : "dark");
}
function F(e = document) {
  L(e);
}
export {
  k as getAsciiStyle,
  J as initAsciiTheme,
  F as renderAsciiStickers,
  K as setAsciiMode,
  U as setAsciiStyle,
  z as toggleAsciiMode,
  D as toggleAsciiStyle
};
