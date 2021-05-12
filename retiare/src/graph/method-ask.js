
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
 * Selectors
 *   key : query by key
 *   .relation : query by relation
 *   #index : quert by index
 *   * : all indexes
 *   ?callback : invoque callbck
 */
Graph.prototype.ask = function(query) {
  var parsed = Utils.parse(query);
};

