
// from src/graph/method-breed.js

/**
 * extract breed from block, given its UUID
 *
 * @param Number uuid
 * @param String type
 * @return Object
 *
 */
Graph.prototype.breed = function(uuid, type) {

  var blocks = this.__recall("blocks");

  var block = blocks[uuid];

  if(!block)
    throw new Error("Unfoundable block at UUID : " + uuid);

  if(! (type in Block.Ducks))
    throw new Error("Unreocngized type : " + type);

  return block[type];
};
