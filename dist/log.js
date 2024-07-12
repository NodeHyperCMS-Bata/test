"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addText = addText;
exports["default"] = void 0;
exports.log = log;
exports.logReset = logReset;
exports.readHTMLlogs = readHTMLlogs;
exports.readLogs = readLogs;
var _colorlog = require("./colorlog");
var _fs = _interopRequireDefault(require("fs"));
var _ansiToHtml = _interopRequireDefault(require("ansi-to-html"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
var convert = new _ansiToHtml["default"]({
  fg: '#FFF',
  bg: '#000'
});
var file = process.cwd() + '/log.log';
if (!_fs["default"].existsSync(file)) {
  _fs["default"].writeFileSync(file, '', 'utf8');
}
function logReset() {
  return _fs["default"].writeFileSync(file, '', 'utf8');
}
function readLogs() {
  return _fs["default"].readFileSync(file, 'utf8');
}
function readHTMLlogs() {
  return convert.toHtml(readLogs());
}
function addText() {
  for (var _len = arguments.length, log = new Array(_len), _key = 0; _key < _len; _key++) {
    log[_key] = arguments[_key];
  }
  var str = log.join(' ');
  console.log(str);
  var logs = readLogs();
  logs += str;
  logs += '\n';
  _fs["default"].writeFileSync(file, logs, 'utf8');
}
function log(log) {
  var mode = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'log';
  var isdev = (process.env.MODE || "dev") == "dev";
  switch (mode) {
    case "log":
      if (isdev) addText("".concat(_colorlog.colorlog.cyan('[log]'), " ").concat(log));
      break;
    case "error":
      addText("".concat(_colorlog.colorlog.red('[error]'), " ").concat(log));
      break;
    case "warning":
      if (isdev) addText("".concat(_colorlog.colorlog.yellow('[warning]'), " ").concat(log));
      break;
    default:
      if (isdev) addText("".concat(_colorlog.colorlog.cyan('[log]'), " ").concat(log));
      break;
  }
}
var _default = log;
exports["default"] = _default;