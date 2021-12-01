// import { Client } from "@notionhq/client";
import fs from 'fs/promises';
// Initializing a client
import NotionPageToHtml from "notion-page-to-html";
// using then
// NotionPageToHtml.convert(
//   "https://www.notion.so/asnunes/Simple-Page-Text-4d64bbc0634d4758befa85c5a3a6c22f"
// ).then((page) => console.log(page));

// using async/await
async function getPage(url) {
  let { title, icon, cover, html } = await NotionPageToHtml.convert(url);
  const path = `./src/articles/${title.replace(/ /g, '-')}.ejs`;
  html = html.replace('<head>', '<head><% include /_head.ejs %>');
  html = html.replace('<body>', '<body><% include /_page-fade-in-animation.ejs %><% include /_nav.ejs %><main style="overflow: hidden;" class="container">');
  html = html.replace('</body>', '</main><% include /_footer.ejs %><% include /_scripts.ejs %></body>', '</body>');
  html = html.replace('margin: 2em auto;', '');
  html = html.replace('max-width: 900px;', '');
  html = html.replace('class="page-title"', 'class="page-title" style="margin-top: calc(var(--indent) * 3)"');
  await fs.writeFile(path, html);
}

async function main() {
  await fs.mkdir('./articles', {recursive: true});
  const articlesUrls = JSON.parse(await fs.readFile('./src/articles/article-links.json'))
  console.log(articlesUrls);
  await Promise.all(articlesUrls.map(url => getPage(url)));
}

main();