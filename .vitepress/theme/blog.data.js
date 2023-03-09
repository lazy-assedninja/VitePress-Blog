import fs from "fs"
import path from "path"
import matter from "gray-matter"
import { createMarkdownRenderer } from "vitepress"
import { fileURLToPath } from "url"

let md
const dirname = path.dirname(fileURLToPath(import.meta.url))
const postDir = path.resolve(dirname, "../../blog")

async function load(asFeed = false) {
  md = md || (await createMarkdownRenderer(process.cwd()))
  return fs
      .readdirSync(postDir)
      .map(file => getArticle(file, postDir, asFeed))
      .sort((a, b) => b.date.time - a.date.time)
}

export default {
  watch: path.join(postDir, "*.md"),
  load
}

const cache = new Map()

function getArticle(file, postDir, asFeed = false) {
  const fullPath = path.join(postDir, file)
  const timestamp = fs.statSync(fullPath).mtimeMs
  const cached = cache.get(fullPath)
  if (cached && timestamp === cached.timestamp) {
    return cached.post
  }

  const src = fs.readFileSync(fullPath, "utf-8")
  const { data } = matter(src)
  const post = {
    title: data.title,
    href: `/blog/${file.replace(/\.md$/, ".html")}`,
    date: formatDate(data.date),
    description: data.description && md.render(data.description)
  }
  if (asFeed) post.data = data // only attach these when building the RSS feed to avoid bloating the client bundle size

  cache.set(fullPath, {
    timestamp,
    post: post
  })
  return post
}

function formatDate(date) {
  if (!(date instanceof Date)) date = new Date(date)
  date.setUTCHours(12)

  return {
    time: +date,
    string: date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    })
  }
}
