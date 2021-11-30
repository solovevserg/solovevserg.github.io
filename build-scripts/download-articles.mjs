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
  const path = `./articles/${title.replace(/ /g, '-')}.html`;
  html = html.replace('<head>', '<head><link rel="stylesheet" href="/css/global.css" />')
  await fs.writeFile(path, html)
}

async function main() {
  const articlesUrls = JSON.parse(await fs.readFile('./articles/article-links.json'))
  console.log(articlesUrls);
  await Promise.all(articlesUrls.map(url => getPage(url)));
}

main();