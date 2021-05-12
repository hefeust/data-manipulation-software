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
