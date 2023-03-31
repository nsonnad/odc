const _ = require("lodash");
const deslugify = (str) => _.startCase(str.replace(/-/g, " "));

module.exports = {
  eleventyComputed: {
    // turn file name back into title automatically, since filename = title in obsidian anyway
    title(data) {
      let hadTitle = false;
      const title = data.title || deslugify(data.page?.fileSlug);
      if (data.title) {
        hadTitle = true;
      }
      return title;
    }
  }
};
