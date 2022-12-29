const markdownIt = require("markdown-it");
const miObs = require("markdown-it-obsidian")();

module.exports = function (config) {
  let options = {
    html: true
  };

  let markdownLib = markdownIt(options).use(miObs);

  config.setLibrary("md", markdownLib);

  config.addPassthroughCopy('assets');

  return {
    dir: {
      input: './src',
      output: './build'
    }
  }

}
