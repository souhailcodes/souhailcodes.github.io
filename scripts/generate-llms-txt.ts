import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const projectsDir = path.join(process.cwd(), 'content', 'projects')
const outputFile = path.join(process.cwd(), 'public', 'llms.txt')
const { homepage } = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'package.json'), 'utf-8'))

const slugs = fs.readdirSync(projectsDir)
  .filter(f => f.endsWith('.mdx') && f !== 'index.mdx')
  .map(f => f.replace(/\.mdx$/, ''))

const projects = slugs.map(slug => {
  const source = fs.readFileSync(path.join(projectsDir, `${slug}.mdx`), 'utf-8')
  const { data } = matter(source)
  return {
    slug,
    title: data.title ?? slug,
    shortDescription: data.shortDescription ?? '',
    date: data.date ?? '',
  }
}).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

const projectLines = projects
  .map(p => `- [${p.title}](${homepage}/projects/${p.slug}.txt): ${p.shortDescription}`)
  .join('\n')

const content = `# Souhail Benlhachemi

> Full-stack Product Engineer based in Agadir, Morocco.

## Sitemap

- [Full content](${homepage}/llms-full.txt): Complete text of the entire website
- [About](${homepage}/llms/about.txt): Background, tech stack, experience, philosophy, and featured projects
- [Projects](${homepage}/llms/projects.txt): All projects (short version)
- [Services](${homepage}/llms/services.txt): Available services and what Souhail offers
- [Contact](${homepage}/llms/contact.txt): How to get in touch
- [CV](${homepage}/cv.pdf): CV in PDF format

## Projects

List of all projects by details

${projectLines}
`

fs.writeFileSync(outputFile, content, 'utf-8')
console.log(`Generated llms.txt with ${projects.length} projects`)
