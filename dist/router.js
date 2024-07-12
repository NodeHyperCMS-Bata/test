"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Router = Router;
Object.defineProperty(exports, "express", {
  enumerable: true,
  get: function get() {
    return _express["default"];
  }
});
var _express = _interopRequireDefault(require("express"));
var _path = _interopRequireDefault(require("path"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function Router() {
  var router = _express["default"].Router();
  router.server = function (path) {
    for (var _len = arguments.length, cb = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      cb[_key - 1] = arguments[_key];
    }
    router.all.apply(router, [path].concat(cb));
  };
  router.receive = function (dir) {
    dir = _path["default"].normalize(dir);
    for (var _len2 = arguments.length, cb = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
      cb[_key2 - 1] = arguments[_key2];
    }
    router.server.apply(router, [dir.replace(/\\/g, '/')].concat(cb));
    if (_path["default"].extname(dir) == '') {
      router.server.apply(router, [_path["default"].join(dir.replace(/\\/g, '/'), 'index.php')].concat(cb));
    }
  };
  return router;
}