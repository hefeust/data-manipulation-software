
// from src/utils/holdify.js

Utils.holdify = function(obj) {

  var store = {};

  if("__store" in obj) return;
  if("__recall" in obj) return;
  if("__show" in obj) return;

  Object.defineProperty(obj, "__store", {
    get : function () {
      return function mkhold(k, v) {
        if(obj !== this) return;
        store[k] = v;
      };
    }
  });

  Object.defineProperty(obj, "__recall", {
    get : function () {
      return function mkrecall(k) {
        if(obj !== this) return;
        return store[k];
      };
    }
  });

  Object.defineProperty(obj, "__show", {
    get : function () {
      return function mkshow() {
        if(obj !== this) return;
        return store;
      };
    }
  });

};
