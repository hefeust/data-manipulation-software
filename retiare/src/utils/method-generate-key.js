
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
