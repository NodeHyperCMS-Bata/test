"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.consoleColors = exports.colorlog = void 0;
var consoleColors = {
  black: "\x1b[30m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
  white: "\x1b[37m"
};
exports.consoleColors = consoleColors;
var consoleColor = {};
var _loop = function _loop(color) {
  consoleColor[color] = function () {
    for (var _len = arguments.length, text = new Array(_len), _key = 0; _key < _len; _key++) {
      text[_key] = arguments[_key];
    }
    return consoleColors[color] + text.join(' ') + consoleColors.white;
  };
};
for (var color in consoleColors) {
  _loop(color);
}
var colorlog = consoleColor;
exports.colorlog = colorlog;