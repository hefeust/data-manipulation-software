
Retiare : a graph structure library
===================================

This library serve the purpose of for storing and querying networked data structures.

How it works ?
--------------

Users add item through "hold" method, associated with a key !

    // car models
    graph.hold("car1", oneCar);
    graph.hold("car2", anotherCar);
    graph.hold("car3", oneMoreCar);

    // motor brands
    graph.add("RenaultMotor", motor1);
    graph.add("FordMotor", motor2);

Then they coumd define relations, with getter, arity liimt and (optional) typing hint, eventually giving callbacks.

  // roles definition
    graph.def("car-owns-motor"), [
      g.role("car", 1, "Car"),
      g.role("motor", 1, "Motor")
      ], [
      g.on("link", function(actual, data) {  /*... */ }
    ]);

Then link can be actually created :
(providing additional data passed to callback)

    g.link({ car "car1": motor, "RenaultMotor" });
    g.link({ car "car2": motor, "FordMotor" }, { "cyl": "2.5"});

Querying
--------

Querying against graph

    g.ask(query);

    g.ask("pizza1.ingredients");

