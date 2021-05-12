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
