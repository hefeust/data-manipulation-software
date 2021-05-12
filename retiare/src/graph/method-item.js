
/**
 * holds a user item in the graph structure
 *
 * @param String key
 * @param Object value
 */
Graph.prototype.item = function(key, value) {
  this.duck("ITEM", {
    key : key,
    value : value
  }, key);
  return this;
};
