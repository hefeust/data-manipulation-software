
// from src/graph/declare.js

/**
 * a Graph
 * @param options Object
 *
 * optional keys are :
 *
 * - size : pool number of blocks
 * - thresold : pool reallocation thresold (usually size * 0.01)
 * - factor : growing factor for reallocation
 */
function Graph(options) {

  Utils.holdify(this);

  options = options || {};

  this.options = {
    size : options.size || 1000,
    thresold : options.thresold || 10,
    factor : options.factor || 4
  };

  // graph number of blocks
  // an empty block is prepended to avoid problems
  // with "look" method
  this.__store("blocks", []);

  // empty blocks list
  this.__store("emptys", []);

  // lookup table
  this.__store("lookup", {});
}