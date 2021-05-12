
/**
 * look for a block, given its key
 * @param {String} key
 */
Graph.prototype.look = function(key) {
   var lookup = this.__recall("lookup");


   if(! (key in lookup))
     throw new Error("no uuid for key : " + key);

   var uuid = lookup[key];
   var blocks = this.__recall("blocks");
   var block = blocks[uuid];

   if(! block)
     throw new Error("no block for key : " + key);

   return block;
};
