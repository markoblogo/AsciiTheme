function f() {
  return document.documentElement;
}
function U(e, t = document) {
  return Array.from(t.querySelectorAll(e));
}
function ne() {
  return typeof window > "u" || typeof window.matchMedia != "function" ? "light" : window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}
function ie() {
  return ne();
}
function z(e) {
  try {
    const t = localStorage.getItem(e);
    if (!t)
      return {};
    const r = JSON.parse(t);
    if (!r || typeof r != "object")
      return {};
    const n = r;
    return {
      style: n.style === "ascii" ? "ascii" : n.style === "default" ? "default" : void 0,
      mode: n.mode === "dark" ? "dark" : n.mode === "light" ? "light" : void 0,
      theme: typeof n.theme == "string" ? n.theme : void 0
    };
  } catch {
    return {};
  }
}
function ae(e, t) {
  try {
    localStorage.setItem(e, JSON.stringify(t));
  } catch {
  }
}
const P = "data-ascii-sticker-rendered", oe = "pre.ascii-sticker", I = /* @__PURE__ */ new WeakMap(), T = /* @__PURE__ */ new Map(), K = ["|", "/", "-", "\\"];
function $(e, t = 2) {
  const r = e.replace(/\s+/g, " ").trim(), n = `${" ".repeat(t)}${r}${" ".repeat(t)}`, a = `┌${"─".repeat(n.length)}┐`, c = `│${n}│`, m = `└${"─".repeat(n.length)}┘`;
  return `${a}
${c}
${m}`;
}
function se(e, t) {
  return t <= 0 ? 0 : Math.max(0, Math.min(e, t));
}
function B(e, t = 0) {
  const r = e.preset ?? "box";
  if (r === "progress") {
    const n = e.max ?? 100, a = se(e.value ?? 0, n), c = Math.round(a / n * 5);
    return `[${"▓".repeat(c)}${"░".repeat(5 - c)} ${Math.round(a / n * 100)}%]`;
  }
  return r === "clock" ? `[${(/* @__PURE__ */ new Date()).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}]` : r === "status-badge" ? `[◈ ${(e.status ?? e.content ?? "LIVE").trim().toUpperCase()}]` : r === "spinner" ? `[${K[t % K.length]}] ${(e.content ?? "Loading").trim()}` : $(e.content ?? "");
}
function V(e, t) {
  if (t.decorative ?? !e.matches("button, a, [role='button']")) {
    e.setAttribute("aria-hidden", "true"), e.removeAttribute("aria-label");
    return;
  }
  e.removeAttribute("aria-hidden"), t.ariaLabel && e.setAttribute("aria-label", t.ariaLabel);
}
function F(e, t, r) {
  const n = r.animation ?? (r.animate && r.preset === "spinner" ? "spinner" : void 0);
  e.className = ["ascii-sticker-host", r.className ?? ""].filter(Boolean).join(" "), e.dataset.asciiStickerId = r.id, e.dataset.asciiStickerPreset = r.preset ?? "box", e.dataset.asciiStickerPosition = r.position ?? "inline", t.className = "ascii-sticker", r.category && t.classList.add(`ascii-sticker--${r.category}`), n && n !== "spinner" && t.classList.add(`ascii-sticker--${n}`), r.animate && n === "spinner" && t.classList.add("ascii-sticker--spinner");
}
function J(e) {
  W(e);
  const t = e.config.preset ?? "box";
  if (t !== "clock" && t !== "spinner")
    return;
  const r = e.config.intervalMs ?? (t === "clock" ? 1e3 : 120);
  let n = 0;
  e.timer = window.setInterval(() => {
    n += 1, e.pre.textContent = B(e.config, n);
  }, r);
}
function W(e) {
  e.timer !== null && (window.clearInterval(e.timer), e.timer = null);
}
function ce(e) {
  if (e instanceof HTMLElement)
    return e;
  if (typeof e == "string") {
    const t = document.querySelector(e);
    if (t)
      return t;
  }
  return document.body;
}
function de(e) {
  const t = document.createElement("div"), r = document.createElement("pre");
  return t.append(r), F(t, r, e), V(t, e), r.textContent = B(e), {
    config: { ...e, mount: e.mount ?? "append", position: e.position ?? "inline" },
    host: t,
    pre: r,
    timer: null
  };
}
function ue(e) {
  const t = ce(e.config.target);
  e.config.mount === "prepend" ? t.prepend(e.host) : t.append(e.host), J(e);
}
function le(e) {
  I.has(e) || I.set(e, e.innerHTML);
  const t = (e.getAttribute("data-ascii-sticker") || "").trim();
  if (!t)
    return;
  const r = e.querySelector(oe);
  if (e.getAttribute(P) === "1" && r) {
    r.textContent = $(t);
    return;
  }
  e.innerHTML = "";
  const n = document.createElement("pre");
  n.className = "ascii-sticker ascii-sticker--legacy", n.textContent = $(t), e.matches("button, a, [role='button']") && e.setAttribute("aria-label", t), e.appendChild(n), e.setAttribute(P, "1");
}
function fe(e) {
  const t = I.get(e);
  t !== void 0 && (e.innerHTML = t, e.removeAttribute(P));
}
function Y(e = document) {
  const t = U("[data-ascii-sticker]", e);
  for (const r of t)
    le(r);
}
function me(e = document) {
  const t = U("[data-ascii-sticker]", e);
  for (const r of t)
    fe(r);
}
function ge(e) {
  G(e.id);
  const t = de(e);
  return T.set(e.id, t), ue(t), t.host;
}
function G(e) {
  const t = T.get(e);
  t && (W(t), t.host.remove(), T.delete(e));
}
function he(e, t) {
  const r = T.get(e);
  r && (r.config = { ...r.config, ...t, id: e }, F(r.host, r.pre, r.config), V(r.host, r.config), r.pre.textContent = B(r.config), J(r));
}
const be = [
  "light",
  "dark",
  "sepia",
  "matrix"
], ye = {
  light: {
    label: "Light",
    mode: "light",
    colorScheme: "light",
    ascii: {
      bg: "#ffffff",
      fg: "#0b2a7a",
      muted: "#1a409c",
      border: "#0b2a7a",
      link: "#0b2a7a",
      codeBg: "#eef2ff"
    },
    ui: {
      bg: "#f7f9ff",
      fg: "#121a2b",
      muted: "#3f4f73",
      border: "rgba(18, 26, 43, 0.22)",
      card: "#ffffff",
      surface: "#ffffff"
    }
  },
  dark: {
    label: "Dark",
    mode: "dark",
    colorScheme: "dark",
    ascii: {
      bg: "#000000",
      fg: "#39ff14",
      muted: "#2ddd18",
      border: "#39ff14",
      link: "#39ff14",
      codeBg: "#051305"
    },
    ui: {
      bg: "#0b0c10",
      fg: "rgba(255, 255, 255, 0.92)",
      muted: "rgba(255, 255, 255, 0.62)",
      border: "rgba(255, 255, 255, 0.18)",
      card: "#101722",
      surface: "#101722"
    }
  },
  sepia: {
    label: "Sepia",
    mode: "light",
    colorScheme: "light",
    ascii: {
      bg: "#f3ead6",
      fg: "#5b4636",
      muted: "#7c5d49",
      border: "#5b4636",
      link: "#7b5330",
      codeBg: "#e6d8bd"
    },
    ui: {
      bg: "#f4ecd8",
      fg: "#4f3b2d",
      muted: "#7f644d",
      border: "rgba(91, 70, 54, 0.28)",
      card: "#fcf4e4",
      surface: "#f8efdc"
    }
  },
  matrix: {
    label: "Matrix",
    mode: "dark",
    colorScheme: "dark",
    ascii: {
      bg: "#020b02",
      fg: "#39ff14",
      muted: "#1fbd33",
      border: "#39ff14",
      link: "#64ff70",
      codeBg: "#041204"
    },
    ui: {
      bg: "#050805",
      fg: "#b9ffbe",
      muted: "#74c977",
      border: "rgba(57, 255, 20, 0.28)",
      card: "#0c140c",
      surface: "#0c140c"
    }
  }
};
function Te() {
  return { ...ye };
}
function pe(e) {
  return {
    ...e,
    border: e.border ?? e.fg,
    link: e.link ?? e.fg,
    codeBg: e.codeBg ?? e.bg
  };
}
function ke(e, t) {
  return {
    bg: t?.bg ?? e.bg,
    fg: t?.fg ?? e.fg,
    muted: t?.muted ?? e.muted,
    border: t?.border ?? e.border ?? e.fg,
    card: t?.card ?? t?.surface ?? e.bg,
    surface: t?.surface ?? t?.card ?? e.bg
  };
}
function x(e, t) {
  const r = pe(t.ascii), n = t.colorScheme ?? t.mode ?? "light";
  return {
    label: t.label ?? String(e),
    mode: t.mode ?? (n === "dark" ? "dark" : "light"),
    colorScheme: n,
    ascii: r,
    ui: ke(r, t.ui)
  };
}
function H(e, t) {
  return e === "dark" || e === "matrix" ? "dark" : e === "light" || e === "sepia" ? "light" : t.mode ?? t.colorScheme ?? "light";
}
function C(e) {
  return e === "light" || e === "dark";
}
const p = "ascii-theme-change", k = "ascii-style-change", s = {
  storageKey: "ascii_theme_v1",
  defaultStyle: "default",
  managedMode: !1,
  defaultMode: "light",
  defaultTheme: "light",
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
  base: !1,
  transitions: !0,
  keyboardShortcut: !1
}, o = /* @__PURE__ */ new Map();
let i = { ...s }, u = null, l = null, L = null, h = null, d = "light";
function b(e) {
  return e === "ascii" ? "ascii" : "default";
}
function q(e) {
  return e === "dark" ? "dark" : "light";
}
function Se(e) {
  o.clear();
  const t = Te();
  for (const r of be)
    o.set(r, x(r, t[r]));
  if (e)
    for (const [r, n] of Object.entries(e))
      o.set(r, x(r, n));
}
function Q(e) {
  return o.get(e) ?? o.get("light");
}
function g(e) {
  const t = f(), r = t.getAttribute(e);
  if (r === "dark" || r === "light")
    return r;
  const n = t.getAttribute("data-theme");
  return n === "dark" || n === "light" ? n : t.classList.contains("dark") ? "dark" : (t.classList.contains("light"), "light");
}
function Me(e) {
  const t = f(), r = t.getAttribute(e);
  if (r === "dark" || r === "light")
    return { hasHostTheme: !0, mode: r };
  const n = t.getAttribute("data-theme");
  return n === "dark" || n === "light" ? { hasHostTheme: !0, mode: n } : t.classList.contains("dark") ? { hasHostTheme: !0, mode: "dark" } : t.classList.contains("light") ? { hasHostTheme: !0, mode: "light" } : { hasHostTheme: !1 };
}
function Ae(e) {
  const t = e.integrateTheme ?? s.integrateTheme, r = e.addThemeToggle ?? s.addThemeToggle, n = e.managedMode, a = e.defaultMode ? q(e.defaultMode) : ie();
  if (t === "managed")
    return {
      managedMode: !0,
      addThemeToggle: r,
      defaultMode: a
    };
  if (t === "respect")
    return {
      managedMode: !1,
      addThemeToggle: !1,
      defaultMode: g(e.themeAttr ?? s.themeAttr)
    };
  const c = f(), m = e.detectTheme ? e.detectTheme(c) : Me(e.themeAttr ?? s.themeAttr);
  return e.hasHostTheme ?? m.hasHostTheme ? {
    managedMode: !1,
    addThemeToggle: !1,
    defaultMode: q(
      m.mode ?? g(e.themeAttr ?? s.themeAttr)
    )
  } : {
    managedMode: n ?? (r ? !0 : s.managedMode),
    addThemeToggle: r,
    defaultMode: a
  };
}
function y() {
  return i.base ? "ascii" : b(f().getAttribute("data-style"));
}
function A() {
  return i.managedMode ? H(d, Q(d)) : g(i.themeAttr);
}
function Z() {
  return d;
}
function R() {
  return {
    style: y(),
    theme: Z(),
    mode: A(),
    managedMode: i.managedMode,
    base: i.base
  };
}
function S(e) {
  if (typeof window > "u")
    return;
  const t = R(), r = new CustomEvent(e, { detail: t });
  window.dispatchEvent(r), f().dispatchEvent(new CustomEvent(e, { detail: t }));
}
function N(e) {
  const t = z(i.storageKey);
  ae(i.storageKey, {
    ...t,
    style: e,
    theme: d,
    mode: i.managedMode && C(d) ? d : void 0
  });
}
function we(e) {
  const t = Q(e), r = f(), n = t.ui ?? {};
  d = e, r.setAttribute("data-ascii-theme", e), r.style.setProperty("--a-bg", t.ascii.bg), r.style.setProperty("--a-fg", t.ascii.fg), r.style.setProperty("--a-muted", t.ascii.muted), r.style.setProperty("--a-border", t.ascii.border ?? t.ascii.fg), r.style.setProperty("--a-link", t.ascii.link ?? t.ascii.fg), r.style.setProperty("--a-code-bg", t.ascii.codeBg ?? t.ascii.bg), r.style.setProperty("--bg", n.bg ?? t.ascii.bg), r.style.setProperty("--text", n.fg ?? t.ascii.fg), r.style.setProperty("--muted", n.muted ?? t.ascii.muted), r.style.setProperty("--border", n.border ?? t.ascii.border ?? t.ascii.fg), r.style.setProperty("--a-ui-bg", n.bg ?? t.ascii.bg), r.style.setProperty("--a-ui-fg", n.fg ?? t.ascii.fg), r.style.setProperty("--a-ui-border", n.border ?? t.ascii.border ?? t.ascii.fg), r.style.setProperty("--a-ui-muted", n.muted ?? t.ascii.muted), r.style.setProperty("--a-ui-surface", n.surface ?? n.card ?? t.ascii.bg), r.style.setProperty("--a-ui-card", n.card ?? n.surface ?? t.ascii.bg), r.style.setProperty("--a-color-scheme", t.colorScheme ?? H(e, t)), r.style.colorScheme = t.colorScheme ?? H(e, t), i.managedMode && C(e) ? r.setAttribute("data-ascii-mode", e) : r.removeAttribute("data-ascii-mode");
}
function w() {
  if (l) {
    const t = y() !== "ascii";
    l.textContent = t ? "ASCII" : "Default", l.setAttribute(
      "aria-label",
      t ? "Switch to ASCII style" : "Switch to default style"
    );
  }
  if (u) {
    const e = A(), t = e === "dark" ? i.icons.moon ?? "☾" : i.icons.sun ?? "☀";
    u.textContent = t, u.setAttribute(
      "aria-label",
      e === "dark" ? "Switch to light mode" : "Switch to dark mode"
    );
  }
}
function O(e, t) {
  const r = document.createElement("button");
  return r.type = "button", r.className = `ascii-theme-toggle-btn ${t}`.trim(), r.dataset.asciiToggleType = e, r;
}
function Ee() {
  L?.remove(), L = null, u = null, l = null;
  const e = i.mountSelector;
  if (!(!!e && (i.addThemeToggle || i.addStyleToggle)) || !e)
    return;
  const r = document.querySelector(e);
  if (!r)
    return;
  const n = document.createElement("div");
  n.className = "ascii-theme-toggle-group", n.setAttribute("data-ascii-controls", "1");
  const a = i.className?.trim() || "";
  i.addThemeToggle ? (u = O("theme", a), u.addEventListener("click", () => {
    te();
  })) : u = null, i.addStyleToggle && !i.base ? (l = O("style", a), l.addEventListener("click", () => {
    D();
  })) : l = null, u && n.append(u), l && n.append(l), i.mountPlacement === "prepend" ? r.prepend(n) : r.append(n), L = n, w();
}
function M(e, t = !0) {
  const r = f(), n = i.base ? "ascii" : b(e);
  return r.setAttribute("data-style", n), n === "ascii" ? Y(document) : me(document), N(n), w(), t && S(k), n;
}
function E(e, t = !0) {
  return o.has(e) && (we(e), N(y()), w(), t && S(p)), d;
}
function X() {
  if (i.managedMode)
    return;
  const e = g(i.themeAttr);
  C(e) && E(e, !1);
}
function ve() {
  h && (window.removeEventListener("keydown", h), h = null), !(!i.keyboardShortcut || typeof window > "u") && (h = (e) => {
    i.keyboardShortcut === "Alt+T" && e.altKey && !e.metaKey && !e.ctrlKey && e.key.toLowerCase() === "t" && (e.preventDefault(), D());
  }, window.addEventListener("keydown", h));
}
function Le(e, t) {
  if (e && o.has(e))
    return e;
  if (i.defaultTheme && o.has(i.defaultTheme))
    return i.defaultTheme;
  if (t && o.has(t))
    return t;
  if (i.managedMode && o.has(i.defaultMode))
    return i.defaultMode;
  const r = g(i.themeAttr);
  return o.has(r) ? r : "light";
}
function Pe(e = {}) {
  const t = e.base ?? s.base;
  if (typeof window > "u" || typeof document > "u")
    return t ? "ascii" : b(e.defaultStyle ?? s.defaultStyle);
  Se(e.themes);
  const r = {
    ...e,
    managedMode: t ? e.managedMode ?? !0 : e.managedMode
  }, n = Ae(r);
  i = {
    ...s,
    ...r,
    base: t,
    managedMode: n.managedMode,
    addThemeToggle: n.addThemeToggle,
    addStyleToggle: t ? !1 : r.addStyleToggle ?? s.addStyleToggle,
    defaultStyle: t ? "ascii" : b(r.defaultStyle ?? s.defaultStyle),
    defaultMode: n.defaultMode,
    defaultTheme: r.defaultTheme ?? n.defaultMode
  }, i.mountPlacement === "afterThemeToggle" && !i.addThemeToggle && (i.mountPlacement = "append");
  const a = f();
  a.setAttribute("data-ascii-transitions", i.transitions ? "on" : "off");
  const c = z(i.storageKey), m = i.base ? "ascii" : b(c.style ?? i.defaultStyle), _ = Le(c.theme, c.mode);
  if (E(_, !1), !i.managedMode) {
    if (a.removeAttribute("data-ascii-mode"), i.themeAttr !== "data-theme") {
      const v = a.getAttribute(i.themeAttr);
      (v === "light" || v === "dark") && a.setAttribute("data-theme", v);
    }
    X();
  }
  ve(), Ee();
  const j = M(m, !1);
  return N(j), w(), S(p), S(k), j;
}
function Ie(e) {
  return M(e);
}
function D() {
  return i.base ? M("ascii") : M(y() === "ascii" ? "default" : "ascii");
}
function ee(e) {
  return i.managedMode ? (re(e), e) : (X(), g(i.themeAttr));
}
function te() {
  return ee(A() === "dark" ? "light" : "dark");
}
function re(e) {
  return E(e);
}
function $e(e, t) {
  o.set(e, x(e, t)), e === d && E(e);
}
function xe() {
  return Object.fromEntries(o.entries());
}
function He() {
  return R();
}
function Be(e) {
  if (typeof window > "u")
    return () => {
    };
  const t = (r) => {
    const n = r.detail;
    e(n ?? R());
  };
  return window.addEventListener(p, t), window.addEventListener(k, t), () => {
    window.removeEventListener(p, t), window.removeEventListener(k, t);
  };
}
function Ce(e = document) {
  Y(e);
}
function Re(e) {
  return ge(e);
}
function Ne(e) {
  G(e);
}
function De(e, t) {
  he(e, t);
}
const _e = {
  init: Pe,
  getState: He,
  subscribe: Be,
  setStyle: Ie,
  toggleStyle: D,
  getStyle: y,
  setMode: ee,
  toggleMode: te,
  getMode: A,
  setTheme: re,
  getTheme: Z,
  registerTheme: $e,
  getThemes: xe
};
export {
  _e as AsciiTheme,
  k as STYLE_EVENT,
  p as THEME_EVENT,
  Re as addSticker,
  A as getAsciiMode,
  y as getAsciiStyle,
  He as getAsciiThemeState,
  Z as getTheme,
  xe as getThemes,
  Pe as initAsciiTheme,
  $e as registerTheme,
  Ne as removeSticker,
  Ce as renderAsciiStickers,
  ee as setAsciiMode,
  Ie as setAsciiStyle,
  re as setTheme,
  Be as subscribeAsciiTheme,
  te as toggleAsciiMode,
  D as toggleAsciiStyle,
  De as updateSticker
};
