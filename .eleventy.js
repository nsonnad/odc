const slugify = require('slugify');
const markdownIt = require('markdown-it');
const markdownItOptions = {
    html: true,
    linkify: true
};
  
module.exports = function (config) {
      
  const md = markdownIt(markdownItOptions)
    .use(require('markdown-it-footnote'))
    .use(require('markdown-it-attrs'))
    .use(function(md) {
        // Recognize Mediawiki links ([[text]])
        md.linkify.add("[[", {
            validate: /^\s?([^\[\]\|\n\r]+)(\|[^\[\]\|\n\r]+)?\s?\]\]/,
            normalize: match => {
                const parts = match.raw.slice(2,-2).split("|");
                parts[0] = parts[0].replace(/.(md|markdown)\s?$/i, "");
                match.text = (parts[1] || parts[0]).trim();
                match.url = `/notes/${slugify(parts[0].trim())}/`;
            }
        })
    })
  
  config.addFilter("markdownify", string => {
      return md.render(string)
  })

  config.setLibrary('md', md);
  
  config.addCollection("notes", function (collection) {
      return collection.getFilteredByGlob(["./src/feed/**/*.md", "index.md"]);
  });

  config.addPassthroughCopy('assets');

  return {
    dir: {
      input: './src',
      output: './build',
      layouts: "_layouts"
    }
  }

}
