
function Pizza(name) {
  this.name = name;
};

Pizza.prototype.toSttring = function() {
  return "Hi ! I 'm a pizza called : " + this.name;
};



function Ingredient(name, description) {
  this.name = name;
this.description = description;
};

Ingredient.prototype.toString = function() {
  return this.name + " : " + this.description;
};



var ti = new Ingredient("Tomato", "tomato sauce");
var ci = new Ingredient("Curryied chicken", "chicken cooked with curry");
var ki = new Ingredient("Cream", "milk cream");
var hi = new Ingredient("Cheese", "Mozarella and gorgonzola");
var bi = new Ingredient("beef", "beef ! for ham angers !");



var mp = new Pizza("Marghareta");
var vp = new Pizza("VeryTastedBeef");
var cp = new Pizza("ChickenCurry");




// from test/graph.js

var g = new Retiare.Graph(Retiare.Graph.defaultOptions);

// link definition
g.def("pizza-owns-ingredients", [
    g.role("pizzas", 0, Pizza),
    g.role("ingredients", 0, Ingredient)
  ], [
    g.on("link", function(actual, data) {
      console.log("link-is-built");
      console.log(actual);
    })
]);

console.log("After graph definition");
console.log(g.info());


// attaching mkssq items
g.item("mp", mp);
g.item("vp", vp);
g.item("cp", cp);

// attaching ingredient items
g.item("ti", ti);
g.item("ci", ci);
g.item("ki", ki);
g.item("hi", hi);
g.item("bi", bi);

console.log("After items add");
console.log(g.info());

// Marghareta piiza
g.link({ pizzas : "mp", ingredients : "ti" });
g.link({ pizzas : "mp", ingredients : "hi" });

// VeryTastedBeef
g.link({ pizzas : "vp", ingredients : "ti" });
g.link({ pizzas : "vp", ingredients : "bi" });
g.link({ pizzas : "vp", ingredients : "hi" });

// Curry Chicken Piiza
g.link({ pizzas : "cp", ingredients : "ci" });
g.link({ pizzas : "cp", ingredients : "ki" });
g.link({ pizzas : "cp", ingredients : "hi" });

console.log(g);


