
source code file organisation
=============================

For sake of simplicity, I decide to split source in multiple files.

I use the npm gulp program to assemble them.

Under src/ folder, you'll find a config.json which helps gulpfile.js program to determine which sequence and orders appply when building.

* "src/-/*.js" : assets files, like header, footer and so on
* "src/**/*.js" : for each major symbol working in the lib, a subfolder of src, including :
** declare.js : one unique declaration of the symbol
** properties*.js : one file per class properties set
** method*.js : one file per prototypic method
** wrapper*.js optional exportation wrappers

