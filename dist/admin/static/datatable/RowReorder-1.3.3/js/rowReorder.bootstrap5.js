"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
/*! Bootstrap 5 styling wrapper for RowReorder
 * © SpryMedia Ltd - datatables.net/license
 */

(function (factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD
    define(['jquery', 'datatables.net-bs5', 'datatables.net-rowreorder'], function ($) {
      return factory($, window, document);
    });
  } else if ((typeof exports === "undefined" ? "undefined" : _typeof(exports)) === 'object') {
    // CommonJS
    var jq = require('jquery');
    var cjsRequires = function cjsRequires(root, $) {
      if (!$.fn.dataTable) {
        require('datatables.net-bs5')(root, $);
      }
      if (!$.fn.dataTable.RowReorder) {
        require('datatables.net-rowreorder')(root, $);
      }
    };
    if (typeof window !== 'undefined') {
      module.exports = function (root, $) {
        if (!root) {
          // CommonJS environments without a window global must pass a
          // root. This will give an error otherwise
          root = window;
        }
        if (!$) {
          $ = jq(root);
        }
        cjsRequires(root, $);
        return factory($, root, root.document);
      };
    } else {
      cjsRequires(window, jq);
      module.exports = factory(jq, window, window.document);
    }
  } else {
    // Browser
    factory(jQuery, window, document);
  }
})(function ($, window, document, undefined) {
  'use strict';

  var DataTable = $.fn.dataTable;
  return DataTable;
});