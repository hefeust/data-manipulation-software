
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


