# retiare
JS library to handle graph structures

Usage :

  var g = new Retiare.Graph();

  // add items
  g.item("mp", new Pizza("Marghareta"));
  g.item("it", new Ingredient("Tomato"));
  g.item("ic", new Ingredient("Cheese")); 
  
  // define relations
  g.def("pizza-owns-ingredients", [
    g.role("pizzas", 0, Pizza),
    g.role("ingredients", 0, Ingredient),
  ], [
    g.on("link", function linkHandler() {
      // ...
    })
  ]);
  
  // connect
  g.link({ "pizzas" : "mp", "ingredients" : "it" }, { qty : 4 });
  g.link({ "pizzas" : "mp", "ingredients" : "ic" });  

  // query
  g.ask("mp.ingredients");

