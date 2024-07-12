"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _marked = _interopRequireDefault(require("marked"));
var _insane = _interopRequireDefault(require("insane"));
var _markedMangle = require("marked-mangle");
var _markedGfmHeadingId = require("marked-gfm-heading-id");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
_marked["default"].use((0, _markedMangle.mangle)());
_marked["default"].use((0, _markedGfmHeadingId.gfmHeadingId)({
  prefix: "markdown-h-"
}));
var renderer = {
  heading: function heading(text, level) {
    var escapedText = text.toLowerCase().replace(/[^\w]+/g, '-');
    return "\n\t\t\t<".concat(level + 1 > 6 ? 'b' : 'h' + (level + 1), ">\n\t\t\t\t<a name=\"").concat(escapedText, "\" class=\"anchor\" href=\"#").concat(escapedText, "\">\n\t\t\t\t\t<span class=\"header-link\"></span>\n\t\t\t\t</a>\n\t\t\t\t").concat(text, "\n\t\t\t</").concat(level + 1 > 6 ? 'b' : 'h' + (level + 1), ">");
  }
};
_marked["default"].use({
  renderer: renderer
});
function markdown(md) {
  return _marked["default"].parse((0, _insane["default"])(md.replace(/	/g, '    '), {
    "allowedAttributes": {
      "a": ["href", "name", "target", "class"],
      "iframe": ["allowfullscreen", "frameborder", "width", "height", "src", "class"],
      "img": ["src", "class"]
    }
  }));
}
var _default = markdown;
exports["default"] = _default;