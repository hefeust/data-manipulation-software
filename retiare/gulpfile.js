

var gulp = require("gulp");
var gconcat = require("gulp-concat");
var gJSONEditor = require("gulp-json-editor");
var gutil = require("gulp-util");
var gorder = require("gulp-order");

var config = require("./src/config.json");

var orderedSteps = (function()  {
  var list = [];
  var cbs = config.build.steps;
  var cbo = config.build.order;
  var glob;
  for(o = 0; o < cbo.length; o++) {
    for(s = 0; s < cbs.length; s++) {
      glob = cbo[o] + "/" + cbs[s] + "*.js"
      list.push(glob);
    }
  }

  list = ["-/licence.js", "-/header.js"]
    .concat(list)
    .concat(["-/wrapper.js", "-/footer.js"]);

  return list;
})();

gulp.task("default", function() {
  // gutil.log(config);
  var list = [];
  for(t in gulp.tasks) {
    list.push(t);
  }
  gutil.log("*** available tasks***\n" + list.sort().join("\n"));
});

// build whole library
gulp.task("build:all", function() {
  gutil.log(orderedSteps);
  return gulp.src("src/**/*.js")
    .pipe(gorder(orderedSteps))
    .pipe(gconcat("loopix.js"))
    .pipe(gulp.dest("build"));
});

// to be improved : how to make properly test suites ?
gulp.task("build:test", function() {

  var testOrder = [
    "pizza.js", "ingredient.js",
    "define-ingredients.js", "define-pizzas.js",
    "graph.js"
  ];

  gulp.src("test/*.js")
    .pipe(gorder(testOrder))
    .pipe(gconcat("loopix-graph-test.js"))
    .pipe(gulp.dest("build"))
})

