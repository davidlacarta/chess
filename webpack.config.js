const path = require("path");

module.exports = {
  mode: "production",
  entry: "./src/chess.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "chess.js",
    library: "chess",
    libraryTarget: "umd",
    globalObject: "this"
  }
};
