const slugify = require('slugify');
const markdownIt = require('markdown-it');
const markdownItOptions = {
    html: true,
    linkify: true
};

const formatDateOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
};

const formatTimeOptions = {
  hour12: false,
  hour: 'numeric',
  minute: '2-digit'
};

const dateTimeOptions = {...formatDateOptions, ...formatTimeOptions };

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
      return collection.getFilteredByGlob(["./src/notes/**/*.md", "index.md"]);
  });

  config.addCollection("thoughts", function (collection) {
      return collection.getFilteredByGlob(["./src/thoughts/**/*.md"]);
  });

  config.addCollection("published", (collection) => {
    return collection
      .getFilteredByTags("feed")
      .filter((post) => post.data.published);
  });

  //config.addCollection("feed", function (collection) {
      //return collection.getFilteredByGlob(["./src/feed/**/*.md"]);
  //});

  config.addFilter('htmlDateString', (dateObj) => {
      return dateObj.toLocaleDateString("en-US", formatDateOptions);
  });

  config.addFilter('htmlDateTimeString', (dateObj) => {
      return dateObj.toLocaleString("en-US", dateTimeOptions);
  });

  config.addPassthroughCopy('src/assets');
  config.addPassthroughCopy('admin');

  return {
    templateFormats: [
        "md",
        "njk"
    ],

    dir: {
      input: './src',
      output: './build',
      layouts: "_layouts"
    }
  }

}
