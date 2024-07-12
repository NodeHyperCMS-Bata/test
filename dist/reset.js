"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _fs = _interopRequireDefault(require("fs"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function reset() {
  _fs["default"].unlinkSync(process.cwd() + '/config.js');
}
var _default = reset;
exports["default"] = _default;