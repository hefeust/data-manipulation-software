/**
LICENCE GOES HERE
 */


// from src/-/header.js

//  header from :
// (function(ctx, undefined) {})(this);
(function(ctx, undefined) {
  "use strict"


// from src/utils/declare.js

/**
 * Utils
 */
var Utils = {};


// from src/utils/method-compare-keys.js

/**
 * raw comparison of keys for two objects
 *
 * don't care of direct properties owning
 *
 * complexity is o(n * n)
 *
 * @param {Object} obj1
 * @param {Object} obj2
 * @return {Boolean}
*/

Utils.compareKeys = function(obj1, obj2) {
  var nloops = 0,
    score = 0;

  for(var k1 in obj1) {
    if(obj1.hasOwnProperty(k1)) {
      for(var k2 in obj2) {
	if(obj2.hasOwnProperty(k2)) {
	  nloops++;
	  if(k1 === k2)
	    score++;
        }
      }
    }
  }

  return nloops === (score * score);
};


// from src/utils/method/generate-key.js

Utils.generateKey = function(obj) {
  var key = "";
  var SEPARATOR = "###";
  var temp = [];
  for(var k in obj) {
    if(obj.hasOwnProperty(k)) {
      temp.push(k.toLowerCase());
    }
  }

  key = temp.sort().join(SEPARATOR);

  return key;
};


// from src/utils/holdify.js

Utils.holdify = function(obj) {

  var store = {};

  if("__store" in obj) return;
  if("__recall" in obj) return;
  if("__show" in obj) return;

  Object.defineProperty(obj, "__store", {
    get : function () {
      return function mkhold(k, v) {
        if(obj !== this) return;
        store[k] = v;
      };
    }
  });

  Object.defineProperty(obj, "__recall", {
    get : function () {
      return function mkrecall(k) {
        if(obj !== this) return;
        return store[k];
      };
    }
  });

  Object.defineProperty(obj, "__show", {
    get : function () {
      return function mkshow() {
        if(obj !== this) return;
        return store;
      };
    }
  });

};


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



/**
 * Block duck types
 */
Block.Ducks = {
  "EMPTY" : "empty-slot",
  "ITEM" : "user-item",
  "DEF" : "link-definition",
  "LINK" : "link-instance",
  "TERM" : "instance-term"
};


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


// from src/graph/method-def.js

/**
 * create a link definition
 *
 * @param Object roles
 * @param Object handlers
 *
 * Usage :
 *
 * g.def([
 *   g.role("pizza", 1, Pizza),
 *   g.role("ingredients", 0, Ingredient)
 * ], [
 *   g.on("link", function() {}),
 *   g.on("split", function() {}),
 *   g.on("match", function() {})
 * ]);
 *
 */
Graph.prototype.def = function(alias, roles, handlers) {
  var def = {
    roles : {},
    handlers : {},
    alias : alias
  };

  var role, handler;

  // assign roles
  for(var i = 0; i < roles.length; i++) {
    role = roles[i];

    if(role.getter in def.roles)
      throw new Error("Use of duplicate getter in roles");

    def.roles[role.getter] = role;
  }

  // assign handlers
  for(var i = 0; i < handlers.length; i++) {
    handler = handlers[i];

    if(handler.event in def.handlers)
      throw new Error("Use of duplicate event in handlers");

    def.handlers[handler.event] = handler.handler;
  }

  var alias = Utils.generateKey(def.roles);
  var block = this.duck("DEF", def, alias);

  return this;
};




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


// from src/graph/method-link.js

/**
 *
 *
 * Usage :
 *
 * create a link between items
 *
 * Usage :
 *
 * g.link({
 *   pizza : "Marghareta",
 *   ingredeients : "cheese"
 * })
 *
 */
Graph.prototype.link = function(actual, data) {
  data = data || {};
  var participants = {};
  for(var place in actual) {
    if(actual.hasOwnProperty(place)) {
      participants[place] = this.look(actual[place])
    }
  }

  // check for definition
  var defKey =  Utils.generateKey(participants);
  var defBlock = this.look(defKey);

  // build link
  var linkBlock = this.duck(
    "LINK",
    { data : data }
  );


  defBlock.followers.push(linkBlock.uuid);

  var itemBlock, termBlock;
  for(var place in participants) {
    if(participants.hasOwnProperty(place)) {
      itemBlock = participants[place];
      termBlock = this.duck("TERM", {
	related : itemBlock.uuid
      });

      itemBlock.followers.push(termBlock.uuid);
      linkBlock.followers.push(itemBlock.uuid);
      termBlock.scout = linkBlock.uuid;
    }
  };

  // console.log(defBlock);

  // apply callback and return
  var def = defBlock.breed("DEF");

  // @TODO : invoke with concrete participants
  var concrete = {};
  for(place in participants) {
    if(participants.hasOwnProperty(place)) {
      concrete[place] =
        participants[place].breed("ITEM").value;
    }
  }

  def.handlers.link.call(this, concrete, data);

  return this;
};



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

/**
 *  on event handler helper
 *
 *  @param String event
 *  @param Function handler
 *  @return Object on-handler
 *
 *  this method acts much more as a helper function
 *
 *  it is used to generate proper entries to "def" method
 */
Graph.prototype.on = function(event, handler) {

  // @TODO : check if handlers are valid callbacks
  // and respond to valid events (link, split, match)


  return {
    event : event,
    handler : handler
  };
};


// from src/graph/method-query.js

/**
 * query graph
 *
 * Usage :
 *
 *   g.ask("#Marghareta");
 *   g.ask("#Marghareta.ingredients");
 *   g.ask("#pizza-owns-ingredients@pizza");
 *   g.ask(query);
 *
 *   #key : query by key
 *   .relation : query by relation
 *
 */
Graph.prototype.ask = function(query) {

};


/**
 *  role helper
 *
 *  @param String getter
 *  @param Number limit (0 stands for no limit)
 *  @param Object hint constructor  to match
 *  @return Object role
 *
 *  this method acts much more as a helper function
 *
 *  it is used to generate proper entries to "def" method
 */
Graph.prototype.role = function(getter, limit, hint) {
  return {
     getter : getter,
     limit : limit,
     hint : hint || Object
  };
};


// from src/-/wrapper.js

/*
 * library wrapper
 */
var wrapper = {};

wrapper.Graph = Graph;

wrapper.Graph.defaultOptions = {
  size : 1000,
  thresold : 10,
  factor : 4
};

// return wrapper;
ctx.Retiare = wrapper;


// from src/-/footer.js

//  footer of header :
// (function(ctx, undefined) {})(this);
})(this);
