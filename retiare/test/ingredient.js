
function Ingredient(name, description) {
  this.name = name;
this.description = description;
};

Ingredient.prototype.toString = function() {
  return this.name + " : " + this.description;
};

