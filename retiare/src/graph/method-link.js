
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

