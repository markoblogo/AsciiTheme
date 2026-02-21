const E = document.documentElement;
function L() {
  return E;
}
function p(e, t = document) {
  return Array.from(t.querySelectorAll(e));
}
function x() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}
function I(e) {
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
function $(e, t) {
  try {
    localStorage.setItem(e, JSON.stringify(t));
  } catch {
  }
}
const h = "asciiOriginalHtml", T = "data-ascii-sticker-rendered", N = "pre.ascii-sticker";
function S(e, t = 2) {
  const a = e.replace(/\s+/g, " ").trim(), n = `${" ".repeat(t)}${a}${" ".repeat(t)}`, d = `┌${"─".repeat(n.length)}┐`, i = `│${n}│`, b = `└${"─".repeat(n.length)}┘`;
  return `${d}
${i}
${b}`;
}
function R(e) {
  e.dataset[h] || (e.dataset[h] = e.innerHTML);
  const t = (e.getAttribute("data-ascii-sticker") || "").trim();
  if (!t)
    return;
  const a = e.querySelector(N);
  if (e.getAttribute(T) === "1" && a) {
    a.textContent = S(t);
    return;
  }
  e.innerHTML = "";
  const n = document.createElement("pre");
  n.className = "ascii-sticker", n.textContent = S(t), e.matches("button, a, [role='button']") && e.setAttribute("aria-label", t), e.appendChild(n), e.setAttribute(T, "1");
}
function w(e) {
  const t = e.dataset[h];
  t !== void 0 && (e.innerHTML = t, e.removeAttribute(T));
}
function v(e = document) {
  const t = p("[data-ascii-sticker]", e);
  for (const a of t)
    R(a);
}
function C(e = document) {
  const t = p("[data-ascii-sticker]", e);
  for (const a of t)
    w(a);
}
const s = {
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
  className: ""
};
let r = { ...s };
const o = L();
let u = null, l = null, g = null;
function f(e) {
  return e === "ascii" ? "ascii" : "default";
}
function c(e) {
  return e === "dark" ? "dark" : "light";
}
function A(e) {
  const t = o.getAttribute(e);
  if (t === "dark" || t === "light")
    return t;
  const a = o.getAttribute("data-theme");
  return a === "dark" || a === "light" ? a : o.classList.contains("dark") ? "dark" : (o.classList.contains("light"), "light");
}
function O(e) {
  const t = o.getAttribute(e);
  if (t === "dark" || t === "light")
    return { hasHostTheme: !0, mode: t };
  const a = o.getAttribute("data-theme");
  return a === "dark" || a === "light" ? { hasHostTheme: !0, mode: a } : o.classList.contains("dark") ? { hasHostTheme: !0, mode: "dark" } : o.classList.contains("light") ? { hasHostTheme: !0, mode: "light" } : { hasHostTheme: !1 };
}
function q(e) {
  const t = e.integrateTheme ?? s.integrateTheme, a = e.addThemeToggle ?? s.addThemeToggle, n = e.managedMode, d = e.defaultMode ? c(e.defaultMode) : x();
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
      defaultMode: A(e.themeAttr ?? s.themeAttr)
    };
  const i = e.detectTheme ? e.detectTheme(o) : O(e.themeAttr ?? s.themeAttr);
  return e.hasHostTheme ?? i.hasHostTheme ? {
    managedMode: !1,
    addThemeToggle: !1,
    defaultMode: c(i.mode ?? A(e.themeAttr ?? s.themeAttr))
  } : {
    managedMode: n ?? (a ? !0 : s.managedMode),
    addThemeToggle: a,
    defaultMode: d
  };
}
function P(e) {
  if (!r.managedMode) {
    o.removeAttribute("data-ascii-mode");
    return;
  }
  const t = c(e ?? r.defaultMode);
  o.setAttribute("data-ascii-mode", t);
}
function H(e, t) {
  const a = I(r.storageKey);
  $(r.storageKey, {
    ...a,
    style: e,
    mode: r.managedMode ? t : void 0
  });
}
function _() {
  return r.managedMode ? c(o.getAttribute("data-ascii-mode")) : A(r.themeAttr);
}
function m() {
  if (l) {
    const t = y() !== "ascii";
    l.textContent = t ? "ASCII" : "Default", l.setAttribute(
      "aria-label",
      t ? "Switch to ASCII style" : "Switch to default style"
    );
  }
  if (u) {
    const e = _(), t = e === "dark" ? r.icons.moon ?? "☾" : r.icons.sun ?? "☀";
    u.textContent = t, u.setAttribute(
      "aria-label",
      e === "dark" ? "Switch to light mode" : "Switch to dark mode"
    );
  }
}
function k(e, t) {
  const a = document.createElement("button");
  return a.type = "button", a.className = `ascii-theme-toggle-btn ${t}`.trim(), a.dataset.asciiToggleType = e, a;
}
function j() {
  var i;
  const e = r.mountSelector;
  if (!(!!e && (r.addThemeToggle || r.addStyleToggle)) || !e)
    return;
  const a = document.querySelector(e);
  if (!a)
    return;
  g != null && g.parentElement && g.remove();
  const n = document.createElement("div");
  n.className = "ascii-theme-toggle-group", n.setAttribute("data-ascii-controls", "1");
  const d = ((i = r.className) == null ? void 0 : i.trim()) || "";
  r.addThemeToggle ? (u = k("theme", d), u.addEventListener("click", () => {
    K(), m();
  })) : u = null, r.addStyleToggle ? (l = k("style", d), l.addEventListener("click", () => {
    B(), m();
  })) : l = null, u && n.append(u), l && n.append(l), r.mountPlacement === "prepend" ? a.prepend(n) : a.append(n), g = n, m();
}
function M(e) {
  const t = f(e);
  o.setAttribute("data-style", t), t === "ascii" ? v(document) : C(document);
  const a = r.managedMode ? c(o.getAttribute("data-ascii-mode")) : void 0;
  return H(t, a), m(), t;
}
function z(e = {}) {
  const t = q(e);
  r = {
    ...s,
    ...e,
    managedMode: t.managedMode,
    addThemeToggle: t.addThemeToggle,
    defaultStyle: f(e.defaultStyle ?? s.defaultStyle),
    defaultMode: t.defaultMode
  }, r.mountPlacement === "afterThemeToggle" && !r.addThemeToggle && (r.mountPlacement = "append");
  const a = I(r.storageKey), n = f(a.style ?? r.defaultStyle);
  if (r.managedMode)
    P(a.mode ?? r.defaultMode);
  else if (o.removeAttribute("data-ascii-mode"), r.themeAttr !== "data-theme") {
    const i = o.getAttribute(r.themeAttr);
    (i === "light" || i === "dark") && o.setAttribute("data-theme", i);
  }
  j();
  const d = M(n);
  return m(), d;
}
function J(e) {
  return M(e);
}
function B() {
  const e = y();
  return M(e === "ascii" ? "default" : "ascii");
}
function y() {
  return f(o.getAttribute("data-style"));
}
function D(e) {
  if (!r.managedMode)
    return c(o.getAttribute(r.themeAttr));
  const t = c(e);
  return o.setAttribute("data-ascii-mode", t), H(y(), t), m(), t;
}
function K() {
  if (!r.managedMode)
    return c(o.getAttribute(r.themeAttr));
  const e = c(o.getAttribute("data-ascii-mode"));
  return D(e === "dark" ? "light" : "dark");
}
function U(e = document) {
  v(e);
}
export {
  y as getAsciiStyle,
  z as initAsciiTheme,
  U as renderAsciiStickers,
  D as setAsciiMode,
  J as setAsciiStyle,
  K as toggleAsciiMode,
  B as toggleAsciiStyle
};
