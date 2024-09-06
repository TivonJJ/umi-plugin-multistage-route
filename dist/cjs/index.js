var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  default: () => src_default
});
module.exports = __toCommonJS(src_exports);
var import_utils = require("@umijs/utils");
var import_fs = __toESM(require("fs"));
var import_path = __toESM(require("path"));
var PluginKey = "multistage-route";
function src_default(api) {
  const tempDirPath = api.paths.absTmpPath;
  const decoratorPath = import_path.default.join(PluginKey, "decorator.tpl");
  const wrappedRoutes = [];
  api.describe({
    key: PluginKey
  });
  api.onGenerateFiles(async () => {
    const exists = import_fs.default.existsSync(import_path.default.join(tempDirPath, decoratorPath));
    if (exists)
      return;
    api.writeTmpFile({
      path: "decorator.tsx",
      content: import_fs.default.readFileSync(import_path.default.join(__dirname, "./tpl/decorator.tpl"), "utf-8")
    });
    api.writeTmpFile({
      path: "index.ts",
      content: `
export {MultistageRoute} from 'umi-plugin-multistage-route/types.d.ts';
`
    });
    wrappedRoutes.forEach((item) => {
      api.writeTmpFile({
        path: item.path,
        content: item.content
      });
    });
  });
  api.onPatchRoute(async ({ route }) => {
    if (!route.name) {
      route.name = route.path;
    }
    if (route.multistage && route.path) {
      const outFileName = route.absPath.replace(/\//g, "-").replace(/:/, "_").replace(/^-/, "") + ".ts";
      const outPath = import_path.default.join("wrapper", outFileName);
      const routePath = route.file;
      if (!routePath)
        throw new Error("route.file is invalid");
      wrappedRoutes.push({
        path: outPath,
        content: import_utils.Mustache.render(
          import_fs.default.readFileSync(import_path.default.join(__dirname, "./tpl/wrapper.tpl"), "utf-8"),
          {
            route: (0, import_utils.winPath)(routePath),
            decorator: (0, import_utils.winPath)(import_path.default.join(api.paths.absTmpPath, "plugin-" + decoratorPath.replace(/\.tpl$/, ""))),
            opt: typeof route.multistage === "object" ? JSON.stringify(route.multistage) : void 0
          }
        )
      });
      route.file = (0, import_utils.winPath)(import_path.default.join(tempDirPath, "plugin-" + PluginKey, outPath));
    }
    return route;
  });
}
