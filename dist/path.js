"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "path", {
  enumerable: true,
  get: function get() {
    return _path["default"];
  }
});
exports.rootDir = rootDir;
var _path = _interopRequireDefault(require("path"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function rootDir() {
  var dir = process.cwd();
  for (var _len = arguments.length, dirs = new Array(_len), _key = 0; _key < _len; _key++) {
    dirs[_key] = arguments[_key];
  }
  dirs.forEach(function (element) {
    dir = _path["default"].join(dir, element);
  });
  return dir;
}