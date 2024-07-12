"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
exports.restart = restart;
var _child_process = _interopRequireDefault(require("child_process"));
var _sys = _interopRequireDefault(require("sys"));
var _log = _interopRequireDefault(require("./log"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function restart() {
  (0, _log["default"])('Restarting...');
  var js_command = process.env.JS_COMMAND || "npm";
  _child_process["default"].exec("".concat(js_command, " run ").concat(js_command, "_restart"), function (error, stdout, stderr) {
    if (error) (0, _log["default"])('Restart Error, ' + error, 'error');
    if (stderr) (0, _log["default"])('Restart Error, ' + stderr, 'error');
    (0, _log["default"])('Restart log, ' + stdout, 'log');
  });
}
var _default = restart;
exports["default"] = _default;