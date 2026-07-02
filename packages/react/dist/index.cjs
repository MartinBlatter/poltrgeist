"use strict";
var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropNames = Object.getOwnPropertyNames;
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
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  Haunted: () => Haunted,
  PoltrgeistProvider: () => PoltrgeistProvider,
  usePoltrgeist: () => usePoltrgeist
});
module.exports = __toCommonJS(index_exports);

// src/PoltrgeistProvider.tsx
var import_react = require("react");
var import_poltrgeist = require("poltrgeist");
var import_jsx_runtime = require("react/jsx-runtime");
var PoltrgeistContext = (0, import_react.createContext)(null);
function PoltrgeistProvider({ children, options }) {
  (0, import_react.useEffect)(() => {
    import_poltrgeist.poltrgeist.haunt(options);
    return () => import_poltrgeist.poltrgeist.release();
  }, []);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PoltrgeistContext.Provider, { value: import_poltrgeist.poltrgeist, children });
}

// src/usePoltrgeist.ts
var import_react2 = require("react");
var import_poltrgeist2 = require("poltrgeist");
function usePoltrgeist(effects) {
  const cleanups = (0, import_react2.useRef)([]);
  const ref = (0, import_react2.useCallback)(
    (el) => {
      cleanups.current.forEach((fn) => fn());
      cleanups.current = [];
      if (!el) return;
      for (const effect of effects) {
        import_poltrgeist2.poltrgeist.apply(el, effect);
      }
    },
    [effects.join(",")]
  );
  return { ref };
}

// src/Haunted.tsx
var import_react3 = require("react");
var import_poltrgeist3 = require("poltrgeist");
var import_jsx_runtime2 = require("react/jsx-runtime");
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
  const ref = (0, import_react3.useRef)(null);
  (0, import_react3.useEffect)(() => {
    if (!ref.current) return;
    for (const effect of effects) {
      import_poltrgeist3.poltrgeist.apply(ref.current, effect);
    }
  }, [effects.join(",")]);
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(Tag, __spreadProps(__spreadValues({ ref }, rest), { children }));
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Haunted,
  PoltrgeistProvider,
  usePoltrgeist
});
//# sourceMappingURL=index.cjs.map