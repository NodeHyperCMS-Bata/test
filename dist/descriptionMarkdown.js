"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _markdown = _interopRequireDefault(require("./markdown"));
var _insane = _interopRequireDefault(require("insane"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function descriptionMarkdown(md) {
  return (0, _insane["default"])((0, _markdown["default"])(md), {
    "allowedAttributes": {
      "a": ["href", "name", "target", "class"],
      "iframe": ["allowfullscreen", "frameborder", "src", "class"],
      "img": ["src", "class"]
    },
    "allowedTags": ["a", "article", "b", "caption", "del", "div", "em", "code", "p", "i", "img", "ins", "kbd", "li", "section", "span", "strike", "strong", "u"]
  });
}
var _default = descriptionMarkdown;
exports["default"] = _default;