import {createMarkdownRenderer, MarkdownRenderer} from 'vitepress'
import fs from "fs"
import path from "path"
import matter from "gray-matter"
import {fileURLToPath} from "url"

let md: MarkdownRenderer
const dirname = path.dirname(fileURLToPath(import.meta.url))
const postDir = path.resolve(dirname, "../../blog")

declare const data: Post[]
export {data}

export interface Post {
    title: string
    url: string
    description: string
    date: {
        time: number
        string: string
    }
}

async function load() {
    md = md || (await createMarkdownRenderer(process.cwd()))
    return fs
        .readdirSync(postDir)
        .map((file) => getPost(file, postDir))
        .sort((a, b) => b.date.time - a.date.time)
}

// noinspection JSUnusedGlobalSymbols
export default {
    watch: path.join(postDir, '*.md'),
    load
}

const cache = new Map()

function getPost(file: string, postDir: string): Post {
    const fullPath = path.join(postDir, file)
    const timestamp = fs.statSync(fullPath).mtimeMs
    const cached = cache.get(fullPath)
    if (cached && timestamp === cached.timestamp) {
        return cached.post
    }
    const { data } = matter(fs.readFileSync(fullPath, 'utf-8'))
    const post = {
        title: data.title,
        url: `/blog/${file.replace(/\.md$/, '')}`,
        date: formatDate(data.date),
        description: md.render(data.description)
    }

    cache.set(fullPath, {
        timestamp,
        post
    })
    return post
}

function formatDate(raw: string): Post['date'] {
    const date = new Date(raw)

    date.setUTCHours(12)
    return {
        time: +date,
        string: date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    }
}
