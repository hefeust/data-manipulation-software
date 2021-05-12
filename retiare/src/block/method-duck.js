
// from src/block/method-duck.js

/**
 * duck type a block with given type and value
 *
 * @param type
 * @param value
 * @returns this
 */
Block.prototype.duck = function(type, value) {

  if(!(type in Block.Ducks))
    throw new Error("unsupported duck type");

  this.type = type;
  this.data[type] = value;
  return this;
};
