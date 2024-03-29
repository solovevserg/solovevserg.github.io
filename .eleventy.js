module.exports = function (eleventyConfig) {
    return {
        // templateFormats: ["ejs", "md", "html", "liquid"],
    
        // If your site lives in a different subdirectory, change this.
        // Leading or trailing slashes are all normalized away, so don’t worry about it.
        // If you don’t have a subdirectory, use "" or "/" (they do the same thing)
        // This is only used for URLs (it does not affect your file structure)
        // pathPrefix: "/",

        // markdownTemplateEngine: "liquid",
        dir: {
          input: "src",
          includes: "../src/_includes",
          data: "_data",
          output: "_site"
        }
      };
    
};
