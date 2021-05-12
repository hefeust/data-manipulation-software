
// from src/block/method-breed.js

/**
 * gets the breed for this block
 *
 * @param type
 * @returns this
 */
Block.prototype.breed = function(type) {

  // check if type is an existing one
  if(!(type in Block.Ducks))
    throw new Error("unsupported duck type");

  // check if breed object owns the duck type
  if(!(type in this.data))
    throw new Error("wrong duck for this block");

  return this.data[type];
};
