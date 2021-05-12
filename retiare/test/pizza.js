
function Pizza(name) {
  this.name = name;
};

Pizza.prototype.toSttring = function() {
  return "Hi ! I 'm a pizza called : " + this.name;
};

