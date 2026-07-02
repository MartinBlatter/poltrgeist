var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
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
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __objRest = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};

// src/PoltrgeistProvider.tsx
import { useEffect, createContext, useContext } from "react";
import { poltrgeist } from "poltrgeist";
import { jsx } from "react/jsx-runtime";
var PoltrgeistContext = createContext(null);
function PoltrgeistProvider({ children, options }) {
  useEffect(() => {
    poltrgeist.haunt(options);
    return () => poltrgeist.release();
  }, []);
  return /* @__PURE__ */ jsx(PoltrgeistContext.Provider, { value: poltrgeist, children });
}

// src/usePoltrgeist.ts
import { useCallback, useRef } from "react";
import { poltrgeist as poltrgeist2 } from "poltrgeist";
function usePoltrgeist(effects) {
  const cleanups = useRef([]);
  const ref = useCallback(
    (el) => {
      cleanups.current.forEach((fn) => fn());
      cleanups.current = [];
      if (!el) return;
      for (const effect of effects) {
        poltrgeist2.apply(el, effect);
      }
    },
    [effects.join(",")]
  );
  return { ref };
}

// src/Haunted.tsx
import { useEffect as useEffect2, useRef as useRef2 } from "react";
import { poltrgeist as poltrgeist3 } from "poltrgeist";
import { jsx as jsx2 } from "react/jsx-runtime";
function Haunted(_a) {
  var _b = _a, {
    as,
    effects,
    children
  } = _b, rest = __objRest(_b, [
    "as",
    "effects",
    "children"
  ]);
  const Tag = as != null ? as : "div";
  const ref = useRef2(null);
  useEffect2(() => {
    if (!ref.current) return;
    for (const effect of effects) {
      poltrgeist3.apply(ref.current, effect);
    }
  }, [effects.join(",")]);
  return /* @__PURE__ */ jsx2(Tag, __spreadProps(__spreadValues({ ref }, rest), { children }));
}
export {
  Haunted,
  PoltrgeistProvider,
  usePoltrgeist
};
//# sourceMappingURL=index.js.map