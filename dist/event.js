"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var event = {
  on: function on(name, fun) {
    process.on("nodejsCMSevent_".concat(name), fun);
  },
  emit: function emit(name) {
    var _process;
    for (var _len = arguments.length, param = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      param[_key - 1] = arguments[_key];
    }
    (_process = process).emit.apply(_process, ["nodejsCMSevent_".concat(name)].concat(param));
  }
};
var _default = event;
exports["default"] = _default;