
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


