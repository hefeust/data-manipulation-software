
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
