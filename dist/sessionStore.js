"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _default = function _default(session) {
  function sessionStore(database) {
    this.database = database;
  }
  sessionStore.prototype = new session.Store();
  sessionStore.prototype.constructor = sessionStore;
  sessionStore.prototype.get = function (sid, fn) {
    var table = this.database.table(sid);
    table.get().then(function (data) {
      fn && fn(null, data);
    });
  };
  sessionStore.prototype.set = function (sid, sess, fn) {
    var table = this.database.table(sid);
    table.set(sess).then(function () {
      fn && fn(null);
    });
  };
  sessionStore.prototype.destroy = function (sid, fn) {
    var table = this.database.table(sid);
    table.remove().then(function () {
      fn && fn(null);
    });
  };
  return sessionStore;
};
exports["default"] = _default;