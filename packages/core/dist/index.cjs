'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var __defProp = Object.defineProperty;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};

// src/utils/random.ts
function roll(probability) {
  return Math.random() < probability;
}
function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}
function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}
function randomIntBetween(min, max) {
  return Math.floor(randomBetween(min, max + 1));
}

// src/utils/dom.ts
var STYLE_ID = "poltrgeist-styles";
function injectStyle(css) {
  let tag = document.getElementById(STYLE_ID);
  if (!tag) {
    tag = document.createElement("style");
    tag.id = STYLE_ID;
    document.head.appendChild(tag);
  }
  const marker = `/* block-${Math.random().toString(36).slice(2)} */`;
  tag.textContent += `
${marker}
${css}`;
  return () => {
    var _a;
    if (!tag) return;
    const text = (_a = tag.textContent) != null ? _a : "";
    const idx = text.indexOf(marker);
    if (idx === -1) return;
    const end = text.indexOf("/* block-", idx + marker.length);
    tag.textContent = text.slice(0, idx) + (end === -1 ? "" : text.slice(end));
  };
}
function cloneAtPosition(el) {
  const rect = el.getBoundingClientRect();
  const clone = el.cloneNode(true);
  clone.style.cssText = `
    position: fixed;
    top: ${rect.top}px;
    left: ${rect.left}px;
    width: ${rect.width}px;
    height: ${rect.height}px;
    margin: 0;
    pointer-events: none;
    z-index: 9999;
  `;
  document.body.appendChild(clone);
  return clone;
}
function wrapChars(el) {
  var _a;
  const original = el.innerHTML;
  const text = (_a = el.textContent) != null ? _a : "";
  const spans = [];
  el.innerHTML = "";
  for (const ch of text) {
    const span = document.createElement("span");
    span.style.display = "inline-block";
    span.textContent = ch === " " ? "\xA0" : ch;
    spans.push(span);
    el.appendChild(span);
  }
  return {
    spans,
    unwrap: () => {
      el.innerHTML = original;
    }
  };
}
function prefersReducedMotion() {
  var _a, _b;
  return (_b = (_a = window.matchMedia) == null ? void 0 : _a.call(window, "(prefers-reduced-motion: reduce)").matches) != null ? _b : false;
}

// src/engine.ts
var DEFAULT_PROBABILITY = 0.15;
var DEFAULT_INTERVAL = { min: 8e3, max: 3e4 };
var Engine = class {
  constructor() {
    this.cleanups = [];
    this.effects = /* @__PURE__ */ new Map();
  }
  register(effect) {
    this.effects.set(effect.name, effect);
  }
  haunt(options = {}) {
    var _a, _b;
    if (options.respectReducedMotion !== false && prefersReducedMotion()) return;
    const allowedEffects = options.effects ? options.effects.map((n) => this.effects.get(n)).filter(Boolean) : [...this.effects.values()];
    const images = (_a = options.images) != null ? _a : [];
    const interval = __spreadValues(__spreadValues({}, DEFAULT_INTERVAL), (_b = options.interval) != null ? _b : {});
    const getProbability = (name) => {
      var _a2, _b2;
      if (typeof options.probability === "number") return options.probability;
      return (_b2 = (_a2 = options.probability) == null ? void 0 : _a2[name]) != null ? _b2 : DEFAULT_PROBABILITY;
    };
    for (const effect of allowedEffects) {
      if (effect.trigger === "timer" || effect.trigger === "dom-text") {
        this.scheduleEffect(effect, interval, images);
        continue;
      }
      for (const selector of effect.defaultTargets) {
        document.querySelectorAll(selector).forEach((el) => {
          if (!roll(getProbability(effect.name))) return;
          const cleanup = effect.attach(el, { images });
          this.cleanups.push(cleanup);
        });
      }
    }
    this.applyDataAttributes(options, images);
  }
  apply(target, effectName, opts = {}) {
    const effect = this.effects.get(effectName);
    if (!effect) throw new Error(`Unknown effect: "${effectName}"`);
    const elements = typeof target === "string" ? [...document.querySelectorAll(target)] : target instanceof NodeList ? [...target] : [target];
    for (const el of elements) {
      const cleanup = effect.attach(el, opts);
      this.cleanups.push(cleanup);
    }
  }
  release() {
    for (const fn of this.cleanups) fn();
    this.cleanups = [];
  }
  applyDataAttributes(options, images) {
    document.querySelectorAll("[data-poltrgeist]").forEach((el) => {
      var _a;
      const names = ((_a = el.dataset.poltrgeist) != null ? _a : "").split(/\s+/).filter(Boolean);
      for (const name of names) {
        const effect = this.effects.get(name);
        if (!effect) continue;
        if (options.effects && !options.effects.includes(name)) continue;
        const cleanup = effect.attach(el, { images });
        this.cleanups.push(cleanup);
      }
    });
  }
  scheduleEffect(effect, interval, images) {
    let timer;
    const run = () => {
      const candidates = [];
      for (const selector of effect.defaultTargets) {
        document.querySelectorAll(selector).forEach((el) => candidates.push(el));
      }
      if (candidates.length > 0) {
        const el = pickRandom(candidates);
        const cleanup = effect.attach(el, { images });
        this.cleanups.push(cleanup);
      }
      schedule();
    };
    const schedule = () => {
      const delay = Math.random() * (interval.max - interval.min) + interval.min;
      timer = setTimeout(run, delay);
    };
    schedule();
    this.cleanups.push(() => clearTimeout(timer));
  }
};

// src/effects/explode.ts
var CSS = `
@keyframes pg-particle {
  0%   { transform: translate(0,0) scale(1); opacity: 1; }
  100% { transform: translate(var(--pg-dx), var(--pg-dy)) scale(0); opacity: 0; }
}
.pg-particle {
  position: fixed;
  border-radius: 50%;
  pointer-events: none;
  z-index: 9999;
  animation: pg-particle 0.6s ease-out forwards;
}
`;
var COLORS = ["#ff6b6b", "#ffd93d", "#6bcb77", "#4d96ff", "#ff922b", "#da77f2"];
var explode = {
  name: "explode",
  defaultTargets: ["button", '[role="button"]', 'input[type="submit"]', 'input[type="button"]'],
  trigger: "click",
  attach(el) {
    const removeStyle = injectStyle(CSS);
    const handler = (e) => {
      const count = randomIntBetween(8, 16);
      const x = e.clientX;
      const y = e.clientY;
      for (let i = 0; i < count; i++) {
        const particle = document.createElement("div");
        particle.className = "pg-particle";
        const size = randomBetween(4, 10);
        const angle = Math.PI * 2 * i / count + randomBetween(-0.3, 0.3);
        const dist = randomBetween(40, 100);
        particle.style.cssText = `
          left: ${x - size / 2}px;
          top: ${y - size / 2}px;
          width: ${size}px;
          height: ${size}px;
          background: ${COLORS[i % COLORS.length]};
          --pg-dx: ${Math.cos(angle) * dist}px;
          --pg-dy: ${Math.sin(angle) * dist}px;
        `;
        document.body.appendChild(particle);
        particle.addEventListener("animationend", () => particle.remove(), { once: true });
      }
    };
    el.addEventListener("click", handler);
    return () => {
      el.removeEventListener("click", handler);
      removeStyle();
    };
  }
};

// src/effects/shy.ts
var CSS2 = `
.pg-shy {
  transition: transform 0.15s ease-out !important;
}
`;
var MAX_DRIFT = 14;
var shy = {
  name: "shy",
  defaultTargets: ["button", '[role="button"]', "a"],
  trigger: "hover",
  attach(el) {
    const removeStyle = injectStyle(CSS2);
    el.classList.add("pg-shy");
    const onMove = (e) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.sqrt(dx * dx + dy * dy) || 1;
      const factor = Math.min(MAX_DRIFT / dist, 1) * MAX_DRIFT;
      el.style.transform = `translate(${-dx / dist * factor}px, ${-dy / dist * factor}px)`;
    };
    const onLeave = () => {
      el.style.transform = "";
    };
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
      el.classList.remove("pg-shy");
      el.style.transform = "";
      removeStyle();
    };
  }
};

// src/effects/yeet.ts
var CSS3 = `
@keyframes pg-yeet {
  0%   { transform: translate(0,0) rotate(0deg) scale(1); opacity: 1; }
  100% { transform: translate(var(--pg-ydx), var(--pg-ydy)) rotate(var(--pg-yrot)) scale(0.2); opacity: 0; }
}
.pg-yeet-clone {
  animation: pg-yeet 0.7s cubic-bezier(0.2, 0, 0.8, 1) forwards;
}
`;
var yeet = {
  name: "yeet",
  defaultTargets: ["button", '[role="button"]'],
  trigger: "click",
  attach(el) {
    const removeStyle = injectStyle(CSS3);
    const handler = () => {
      const clone = cloneAtPosition(el);
      const angle = randomBetween(-Math.PI / 3, -Math.PI * 2 / 3);
      const dist = randomBetween(400, 900);
      clone.style.setProperty("--pg-ydx", `${Math.cos(angle) * dist}px`);
      clone.style.setProperty("--pg-ydy", `${Math.sin(angle) * dist}px`);
      clone.style.setProperty("--pg-yrot", `${randomBetween(-720, 720)}deg`);
      clone.classList.add("pg-yeet-clone");
      el.style.visibility = "hidden";
      clone.addEventListener("animationend", () => {
        clone.remove();
        el.style.visibility = "";
      }, { once: true });
    };
    el.addEventListener("click", handler);
    return () => {
      el.removeEventListener("click", handler);
      el.style.visibility = "";
      removeStyle();
    };
  }
};

// src/effects/wobble.ts
var CSS4 = `
@keyframes pg-wobble-char {
  0%, 100% { transform: translateY(0); }
  50%       { transform: translateY(var(--pg-wobble-y)); }
}
.pg-wobble-char {
  animation: pg-wobble-char 0.4s ease-in-out forwards;
  animation-delay: var(--pg-wobble-delay);
}
`;
var wobble = {
  name: "wobble",
  defaultTargets: ["h1", "h2", "h3", "h4", "label", "p"],
  trigger: "timer",
  attach(el) {
    const removeStyle = injectStyle(CSS4);
    let cancelled = false;
    if (el._pgWobbling) {
      removeStyle();
      return removeStyle;
    }
    el._pgWobbling = true;
    const { spans, unwrap } = wrapChars(el);
    spans.forEach((span, i) => {
      span.style.setProperty("--pg-wobble-y", `${randomBetween(-5, 5)}px`);
      span.style.setProperty("--pg-wobble-delay", `${i * 30}ms`);
      span.classList.add("pg-wobble-char");
    });
    const duration = 400 + spans.length * 30 + 200;
    let done = false;
    const restore = () => {
      if (done) return;
      done = true;
      unwrap();
      el._pgWobbling = false;
    };
    const timer = setTimeout(() => {
      if (!cancelled) restore();
    }, duration);
    return () => {
      cancelled = true;
      clearTimeout(timer);
      restore();
      removeStyle();
    };
  }
};

// src/effects/ghost-image.ts
var CSS5 = `
@keyframes pg-ghost-drift {
  0%   { opacity: 0; }
  20%  { opacity: var(--pg-ghost-opacity); }
  80%  { opacity: var(--pg-ghost-opacity); }
  100% { opacity: 0; }
}
.pg-ghost-image {
  position: fixed;
  pointer-events: none;
  z-index: 1;
  animation: pg-ghost-drift var(--pg-ghost-dur) ease-in-out forwards;
  filter: blur(1px) grayscale(0.4);
  max-width: 220px;
  max-height: 220px;
  object-fit: contain;
}
`;
var EDGES = ["top", "bottom", "left", "right"];
var FALLBACK_IMAGES = [
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 80"><path d="M32 0 C14 0 4 14 4 32 L4 56 L12 48 L20 56 L28 48 L36 56 L44 48 L52 56 L60 48 L60 32 C60 14 50 0 32 0Z" fill="%23888"/><circle cx="22" cy="28" r="5" fill="%23fff"/><circle cx="42" cy="28" r="5" fill="%23fff"/></svg>'
];
var ghostImage = {
  name: "ghost-image",
  defaultTargets: ["body"],
  trigger: "timer",
  attach(_el, opts) {
    var _a;
    const removeStyle = injectStyle(CSS5);
    const images = ((_a = opts == null ? void 0 : opts.images) == null ? void 0 : _a.length) ? opts.images : FALLBACK_IMAGES;
    const src = pickRandom(images);
    const edge = pickRandom(EDGES);
    const img = document.createElement("img");
    img.className = "pg-ghost-image";
    img.src = src;
    img.alt = "";
    img.setAttribute("aria-hidden", "true");
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const dur = randomBetween(4, 8);
    const opacity = randomBetween(0.06, 0.14);
    const size = randomBetween(80, 200);
    img.style.setProperty("--pg-ghost-opacity", String(opacity));
    img.style.setProperty("--pg-ghost-dur", `${dur}s`);
    img.style.width = `${size}px`;
    const pos = randomBetween(0.1, 0.9);
    const drift = randomBetween(30, 70);
    if (edge === "top") {
      img.style.left = `${vw * pos}px`;
      img.style.top = `-${size}px`;
      img.style.transform = `translateY(${drift}px)`;
    } else if (edge === "bottom") {
      img.style.left = `${vw * pos}px`;
      img.style.bottom = `-${size}px`;
      img.style.transform = `translateY(-${drift}px)`;
    } else if (edge === "left") {
      img.style.top = `${vh * pos}px`;
      img.style.left = `-${size}px`;
      img.style.transform = `translateX(${drift}px)`;
    } else {
      img.style.top = `${vh * pos}px`;
      img.style.right = `-${size}px`;
      img.style.transform = `translateX(-${drift}px)`;
    }
    document.body.appendChild(img);
    img.addEventListener("animationend", () => img.remove(), { once: true });
    return () => {
      img.remove();
      removeStyle();
    };
  }
};

// src/effects/heartbeat.ts
var CSS6 = `
@keyframes pg-heartbeat {
  0%   { box-shadow: inset 0 0 0px 0px rgba(180,0,0,0); }
  15%  { box-shadow: inset 0 0 60px 20px rgba(180,0,0,0.18); }
  30%  { box-shadow: inset 0 0 20px 5px rgba(180,0,0,0.08); }
  50%  { box-shadow: inset 0 0 80px 30px rgba(180,0,0,0.22); }
  100% { box-shadow: inset 0 0 0px 0px rgba(180,0,0,0); }
}
.pg-heartbeat-overlay {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 9998;
  animation: pg-heartbeat var(--pg-hb-dur) ease-in-out forwards;
}
`;
var heartbeat = {
  name: "heartbeat",
  defaultTargets: ["body"],
  trigger: "timer",
  attach() {
    const removeStyle = injectStyle(CSS6);
    const overlay = document.createElement("div");
    overlay.className = "pg-heartbeat-overlay";
    const dur = randomBetween(1.5, 3);
    overlay.style.setProperty("--pg-hb-dur", `${dur}s`);
    document.body.appendChild(overlay);
    overlay.addEventListener("animationend", () => overlay.remove(), { once: true });
    return () => {
      overlay.remove();
      removeStyle();
    };
  }
};

// src/effects/cthulhu.ts
var WORDS = [
  "Ph'nglui",
  "mglw'nafh",
  "Cthulhu",
  "R'lyeh",
  "wgah'nagl",
  "fhtagn",
  "Azathoth",
  "Nyarlathotep",
  "Shoggoth",
  "Yogg-Sothoth",
  "Dagon",
  "Ia",
  "I\xE4",
  "Nug",
  "Yeb",
  "Tsathoggua",
  "Yog-Sothoth",
  "Hastur",
  "Shub-Niggurath",
  "cyclopean",
  "eldritch",
  "gibbous",
  "ululating",
  "nameless",
  "nigh"
];
function getTextNodes(el) {
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, {
    acceptNode: (node) => {
      var _a, _b;
      return ((_b = (_a = node.textContent) == null ? void 0 : _a.trim().length) != null ? _b : 0) > 0 ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
    }
  });
  const nodes = [];
  let n;
  while (n = walker.nextNode()) nodes.push(n);
  return nodes;
}
var cthulhu = {
  name: "cthulhu",
  defaultTargets: ["p", "li", "h1", "h2", "h3", "span", "label"],
  trigger: "dom-text",
  attach(el) {
    var _a;
    const nodes = getTextNodes(el);
    if (!nodes.length) return () => {
    };
    const node = pickRandom(nodes);
    const original = (_a = node.textContent) != null ? _a : "";
    const words = original.split(/(\s+)/);
    const realWords = words.map((w, i) => ({ i, isWord: /\S/.test(w) })).filter((x) => x.isWord);
    if (!realWords.length) return () => {
    };
    const target = pickRandom(realWords);
    const replacement = pickRandom(WORDS);
    words[target.i] = replacement;
    node.textContent = words.join("");
    const dur = randomBetween(4e3, 8e3);
    const timer = setTimeout(() => {
      node.textContent = original;
    }, dur);
    return () => {
      clearTimeout(timer);
      node.textContent = original;
    };
  }
};

// src/effects/mirror.ts
function getTextNodes2(el) {
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, {
    acceptNode: (node) => {
      var _a, _b;
      return ((_b = (_a = node.textContent) == null ? void 0 : _a.trim().length) != null ? _b : 0) > 3 ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
    }
  });
  const nodes = [];
  let n;
  while (n = walker.nextNode()) nodes.push(n);
  return nodes;
}
var mirror = {
  name: "mirror",
  defaultTargets: ["p", "li", "h1", "h2", "h3", "span", "label"],
  trigger: "dom-text",
  attach(el) {
    var _a;
    const nodes = getTextNodes2(el);
    if (!nodes.length) return () => {
    };
    const node = pickRandom(nodes);
    const original = (_a = node.textContent) != null ? _a : "";
    const words = original.split(/(\s+)/);
    const realWords = words.map((w, i) => ({ i, isWord: /\S{4,}/.test(w) })).filter((x) => x.isWord);
    if (!realWords.length) return () => {
    };
    const target = pickRandom(realWords);
    const word = words[target.i];
    const span = document.createElement("span");
    span.style.cssText = "display:inline-block; transform:scaleX(-1);";
    span.textContent = word;
    const parts = original.split(word);
    const before = document.createTextNode(parts[0]);
    const after = document.createTextNode(parts.slice(1).join(word));
    node.replaceWith(before, span, after);
    const dur = randomBetween(3e3, 6e3);
    const timer = setTimeout(() => {
      const restored = document.createTextNode(original);
      before.replaceWith(restored);
      span.remove();
      after.remove();
    }, dur);
    return () => {
      clearTimeout(timer);
      try {
        const restored = document.createTextNode(original);
        before.replaceWith(restored);
        span.remove();
        after.remove();
      } catch (e) {
      }
    };
  }
};

// src/index.ts
var engine = new Engine();
engine.register(explode);
engine.register(shy);
engine.register(yeet);
engine.register(wobble);
engine.register(ghostImage);
engine.register(heartbeat);
engine.register(cthulhu);
engine.register(mirror);
var poltrgeist = {
  haunt: (options) => engine.haunt(options),
  apply: (target, effect, opts) => engine.apply(target, effect, opts),
  release: () => engine.release()
};
var index_default = poltrgeist;

exports.default = index_default;
exports.poltrgeist = poltrgeist;
//# sourceMappingURL=index.cjs.map
//# sourceMappingURL=index.cjs.map