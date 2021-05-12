
// from src/graph/method-allocate.js

/**
 * reallocate graph ppoling blocks
 *
 * @return this
 *
 * attempt to reallocate pool number of blocks
 *
 * idempotent : when called twice, only one is effzctive
 */
Graph.prototype.allocate = function() {
  var tlen = 0,
    blocks = this.__recall("blocks"),
    emptys = this.__recall("emptys");

  if(blocks.length > 0) {

    if(emptys.length > this.options.thresold)
      return false;

    tlen = (this.options.factor - 1) * this.options.size;

    this.options.thresold *= this.options.factor;
    this.options.size *= this.options.factor;
  } else {
    tlen = this.options.size;
  }

  var blocksTemp = new Array(tlen);
  var emptysTemp = new Array(tlen);

  for(var i = 0; i < tlen; i++) {
    blocksTemp[i] = new Block(i);
    emptysTemp[i] = i;
  }

  this.__store("blocks", blocks.concat(blocksTemp));
  this.__store("emptys", emptys.concat(emptysTemp));

  return true;
};

