
// from src/graph/method-duck.js

/**
 * Ducks a data block
 *
 */
Graph.prototype.duck = function(type, value, key) {

  // console.log(Block.Ducks);

  if(!(type in Block.Ducks))
    throw new Error("wrong data duck type : " + type);

  this.allocate();

  var blocks = this.__recall("blocks");
  var emptys = this.__recall("emptys");
  var lookup = this.__recall("lookup");

  var uuid = emptys.pop();
  var block = blocks[uuid];

  // if a key is given, update lookup hash
  if(key) {
    block.key = key;
    lookup[key] = uuid;
  }

  block.type = type;
  block.data[type] = value;

  this.__store("blocks", blocks);
  this.__store("emptys", emptys);
  this.__store("lookup", lookup);

  return block;

};
