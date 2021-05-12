
// from src/graph/method-info.js

Graph.prototype.info = function() {

  var emptys = this.__recall("emptys");

  var info = {
    size : this.options.size,
    thresold : this.options.thresold,
    factor : this.options.factor,
    emptys : emptys.length
  };

  return info;
};