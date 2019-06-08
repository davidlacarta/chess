import Jasmine from "jasmine";

// Compiled by Babel, required to run Jasmine with support for ES6
const jasmine = new Jasmine();
jasmine.loadConfigFile("spec/config/jasmine.json");
jasmine.execute();
