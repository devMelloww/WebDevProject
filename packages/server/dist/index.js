"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
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
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};
var import_express = __toESM(require("express"));
var import_profiles = __toESM(require("./routes/profiles"));
var import_mongoose = __toESM(require("mongoose"));
var import_auth = __toESM(require("./routes/auth"));
var import_promises = __toESM(require("node:fs/promises"));
const app = (0, import_express.default)();
const path = require("path");
const port = process.env.PORT || 3e3;
const staticDir = process.env.STATIC || "public";
import_mongoose.default.connect("mongodb://localhost:27017/profiles").then(() => {
  console.log("Connected to MongoDB");
}).catch((err) => {
  console.error("Failed to connect to MongoDB", err);
});
const nodeModules = path.resolve(
  __dirname,
  "../../../node_modules"
);
console.log("Serving NPM packages from", nodeModules);
app.use("/node_modules", import_express.default.static(nodeModules));
app.use(import_express.default.static(staticDir));
app.use(import_express.default.json());
app.use("/api/profiles", import_profiles.default);
app.use("/auth", import_auth.default);
app.use("/api/profiles", import_auth.authenticateUser, import_profiles.default);
app.use("/app", (req, res) => __async(exports, null, function* () {
  const indexHtml = path.resolve(staticDir, "index.html");
  const html = yield import_promises.default.readFile(indexHtml, { encoding: "utf8" });
  res.send(html);
}));
app.get("/hello", (req, res) => {
  res.send("Hello, World");
});
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
