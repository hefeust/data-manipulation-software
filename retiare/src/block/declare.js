
// from src/block/declare.js

/**
 * A block is a memory chunk of an object pool
 *
 *
 */
function Block(uuid) {

  // block UUID
  this.uuid = uuid;

  // duck type
  this.type = null;

  // data breed
  this.data = {};

  // scout block ID
  this.scout = 0;

  // followers blocks list
  this.followers = [];
}

