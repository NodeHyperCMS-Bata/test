"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _site = require("./site");
function themeRequire() {
  var file = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  return require('../theme/' + (0, _site.getSiteInfoAwait)().theme + file);
}
var _default = themeRequire;
exports["default"] = _default;