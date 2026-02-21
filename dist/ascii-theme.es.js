function s() {
  return document.documentElement;
}
function w(e, t = document) {
  return Array.from(t.querySelectorAll(e));
}
function H() {
  return typeof window > "u" || typeof window.matchMedia != "function" ? "light" : window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}
function $() {
  return H();
}
function E(e) {
  try {
    const t = localStorage.getItem(e);
    if (!t)
      return {};
    const a = JSON.parse(t);
    if (!a || typeof a != "object")
      return {};
    const n = a;
    return {
      style: n.style === "ascii" ? "ascii" : n.style === "default" ? "default" : void 0,
      mode: n.mode === "dark" ? "dark" : n.mode === "light" ? "light" : void 0
    };
  } catch {
    return {};
  }
}
function b(e, t) {
  try {
    localStorage.setItem(e, JSON.stringify(t));
  } catch {
  }
}
const S = "asciiOriginalHtml", k = "data-ascii-sticker-rendered", N = "pre.ascii-sticker";
function v(e, t = 2) {
  const a = e.replace(/\s+/g, " ").trim(), n = `${" ".repeat(t)}${a}${" ".repeat(t)}`, r = `┌${"─".repeat(n.length)}┐`, c = `│${n}│`, g = `└${"─".repeat(n.length)}┘`;
  return `${r}
${c}
${g}`;
}
function C(e) {
  e.dataset[S] || (e.dataset[S] = e.innerHTML);
  const t = (e.getAttribute("data-ascii-sticker") || "").trim();
  if (!t)
    return;
  const a = e.querySelector(N);
  if (e.getAttribute(k) === "1" && a) {
    a.textContent = v(t);
    return;
  }
  e.innerHTML = "";
  const n = document.createElement("pre");
  n.className = "ascii-sticker", n.textContent = v(t), e.matches("button, a, [role='button']") && e.setAttribute("aria-label", t), e.appendChild(n), e.setAttribute(k, "1");
}
function R(e) {
  const t = e.dataset[S];
  t !== void 0 && (e.innerHTML = t, e.removeAttribute(k));
}
function L(e = document) {
  const t = w("[data-ascii-sticker]", e);
  for (const a of t)
    C(a);
}
function q(e = document) {
  const t = w("[data-ascii-sticker]", e);
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
let o = { ...i }, l = null, u = null, h = null;
function T(e) {
  return e === "ascii" ? "ascii" : "default";
}
function d(e) {
  return e === "dark" ? "dark" : "light";
}
function y(e) {
  const t = s(), a = t.getAttribute(e);
  if (a === "dark" || a === "light")
    return a;
  const n = t.getAttribute("data-theme");
  return n === "dark" || n === "light" ? n : t.classList.contains("dark") ? "dark" : (t.classList.contains("light"), "light");
}
function B(e) {
  const t = s(), a = t.getAttribute(e);
  if (a === "dark" || a === "light")
    return { hasHostTheme: !0, mode: a };
  const n = t.getAttribute("data-theme");
  return n === "dark" || n === "light" ? { hasHostTheme: !0, mode: n } : t.classList.contains("dark") ? { hasHostTheme: !0, mode: "dark" } : t.classList.contains("light") ? { hasHostTheme: !0, mode: "light" } : { hasHostTheme: !1 };
}
function K(e) {
  const t = e.integrateTheme ?? i.integrateTheme, a = e.addThemeToggle ?? i.addThemeToggle, n = e.managedMode, r = e.defaultMode ? d(e.defaultMode) : $();
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
      defaultMode: y(e.themeAttr ?? i.themeAttr)
    };
  const c = s(), g = e.detectTheme ? e.detectTheme(c) : B(e.themeAttr ?? i.themeAttr);
  return e.hasHostTheme ?? g.hasHostTheme ? {
    managedMode: !1,
    addThemeToggle: !1,
    defaultMode: d(g.mode ?? y(e.themeAttr ?? i.themeAttr))
  } : {
    managedMode: n ?? (a ? !0 : i.managedMode),
    addThemeToggle: a,
    defaultMode: r
  };
}
function O(e) {
  const t = s();
  if (!o.managedMode) {
    t.removeAttribute("data-ascii-mode");
    return;
  }
  const a = d(e ?? o.defaultMode);
  t.setAttribute("data-ascii-mode", a);
}
function x(e, t) {
  const a = E(o.storageKey);
  b(o.storageKey, {
    ...a,
    style: o.base ? e : void 0,
    mode: o.managedMode ? t : void 0
  });
}
function P() {
  if (o.managedMode) {
    const e = s();
    return d(e.getAttribute("data-ascii-mode"));
  }
  return y(o.themeAttr);
}
function f() {
  if (u) {
    const t = p() !== "ascii";
    u.textContent = t ? "ASCII" : "Default", u.setAttribute(
      "aria-label",
      t ? "Switch to ASCII style" : "Switch to default style"
    );
  }
  if (l) {
    const e = P(), t = e === "dark" ? o.icons.moon ?? "☾" : o.icons.sun ?? "☀";
    l.textContent = t, l.setAttribute(
      "aria-label",
      e === "dark" ? "Switch to light mode" : "Switch to dark mode"
    );
  }
}
function I(e, t) {
  const a = document.createElement("button");
  return a.type = "button", a.className = `ascii-theme-toggle-btn ${t}`.trim(), a.dataset.asciiToggleType = e, a;
}
function _() {
  var c;
  const e = o.mountSelector;
  if (!(!!e && (o.addThemeToggle || o.addStyleToggle)) || !e)
    return;
  const a = document.querySelector(e);
  if (!a)
    return;
  h != null && h.parentElement && h.remove();
  const n = document.createElement("div");
  n.className = "ascii-theme-toggle-group", n.setAttribute("data-ascii-controls", "1");
  const r = ((c = o.className) == null ? void 0 : c.trim()) || "";
  o.addThemeToggle ? (l = I("theme", r), l.addEventListener("click", () => {
    z(), f();
  })) : l = null, o.addStyleToggle && !o.base ? (u = I("style", r), u.addEventListener("click", () => {
    j(), f();
  })) : u = null, l && n.append(l), u && n.append(u), o.mountPlacement === "prepend" ? a.prepend(n) : a.append(n), h = n, f();
}
function A(e) {
  const t = s(), a = o.base ? "ascii" : T(e);
  t.setAttribute("data-style", a), a === "ascii" ? L(document) : q(document);
  const n = o.managedMode ? d(t.getAttribute("data-ascii-mode")) : void 0;
  return x(a, n), f(), a;
}
function J(e = {}) {
  const t = e.base ?? i.base;
  if (typeof window > "u" || typeof document > "u")
    return t ? "ascii" : T(e.defaultStyle ?? i.defaultStyle);
  const a = {
    ...e,
    managedMode: t ? e.managedMode ?? !0 : e.managedMode
  }, n = K(a);
  o = {
    ...i,
    ...a,
    base: t,
    managedMode: n.managedMode,
    addThemeToggle: n.addThemeToggle,
    addStyleToggle: t ? !1 : a.addStyleToggle ?? i.addStyleToggle,
    defaultStyle: t ? "ascii" : T(a.defaultStyle ?? i.defaultStyle),
    defaultMode: n.defaultMode
  }, o.mountPlacement === "afterThemeToggle" && !o.addThemeToggle && (o.mountPlacement = "append");
  const r = E(o.storageKey), c = o.base ? "ascii" : T(o.defaultStyle);
  if (o.managedMode) {
    const m = r.mode ? d(r.mode) : e.defaultMode ? d(e.defaultMode) : H();
    O(m), (!r.mode || r.style) && b(o.storageKey, {
      ...r,
      style: o.base ? c : void 0,
      mode: m
    });
  } else {
    const m = s();
    if (m.removeAttribute("data-ascii-mode"), r.style && b(o.storageKey, {
      ...r,
      style: void 0
    }), o.themeAttr !== "data-theme") {
      const M = m.getAttribute(o.themeAttr);
      (M === "light" || M === "dark") && m.setAttribute("data-theme", M);
    }
  }
  _();
  const g = A(c);
  return f(), g;
}
function U(e) {
  return A(e);
}
function j() {
  if (o.base)
    return A("ascii");
  const e = p();
  return A(e === "ascii" ? "default" : "ascii");
}
function p() {
  if (o.base)
    return "ascii";
  const e = s();
  return T(e.getAttribute("data-style"));
}
function D(e) {
  if (!o.managedMode)
    return d(y(o.themeAttr));
  const t = s(), a = d(e);
  return t.setAttribute("data-ascii-mode", a), x(p(), a), f(), a;
}
function z() {
  if (!o.managedMode)
    return d(y(o.themeAttr));
  const e = s(), t = d(e.getAttribute("data-ascii-mode"));
  return D(t === "dark" ? "light" : "dark");
}
function F(e = document) {
  L(e);
}
export {
  p as getAsciiStyle,
  J as initAsciiTheme,
  F as renderAsciiStickers,
  D as setAsciiMode,
  U as setAsciiStyle,
  z as toggleAsciiMode,
  j as toggleAsciiStyle
};
