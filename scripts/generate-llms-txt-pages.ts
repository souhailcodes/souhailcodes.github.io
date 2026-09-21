import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const { homepage } = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'package.json'), 'utf-8'))
const outDir = path.join(process.cwd(), 'public', 'llms')
fs.mkdirSync(outDir, { recursive: true })

// Load all project data for cross-referencing ProjectCard slugs
const projectsDir = path.join(process.cwd(), 'content', 'projects')
const allProjectSlugs = fs.readdirSync(projectsDir)
  .filter(f => f.endsWith('.mdx') && f !== 'index.mdx')
  .map(f => f.replace(/\.mdx$/, ''))

const allProjects = allProjectSlugs.map(slug => {
  const source = fs.readFileSync(path.join(projectsDir, `${slug}.mdx`), 'utf-8')
  const { data } = matter(source)
  return {
    slug,
    title: data.title ?? slug,
    shortDescription: data.shortDescription ?? '',
    date: data.date ?? '',
  }
}).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

const projectsBySlug = new Map(allProjects.map(p => [p.slug, p]))

function extr(text: string, prefix: string): string | null {
  const m = text.match(new RegExp(`\\b${prefix}=["']([^"']*)["']`))
  return m ? m[1] : null
}

function stripMdx(mdx: string): string {
  let content = mdx

  // Remove frontmatter
  content = content.replace(/^---[\s\S]*?---\n*/, '')

  // Remove import statements
  content = content.replace(/^import .+?;?$/gm, '')

  // Extract text from JSX expression strings
  content = content.replace(/\{(["'`])([^"'`]*?)\1\}/g, '$2')

  // --- Process React components that carry data ---

  // <ProjectCard /> → lookup slug in project data, render as text
  content = content.replace(
    /<ProjectCard[\s\S]*?\/\s*>/g,
    match => {
      const slug = extr(match, 'slug')
      if (!slug) return ''
      const p = projectsBySlug.get(slug)
      if (!p) return ''
      const lines = [`- **${p.title}** (*${p.date}*): ${p.shortDescription}`]
      return lines.join('\n')
    }
  )

  // <Link href="...">inner</Link> → [inner](href)
  content = content.replace(
    /<Link\s+href=["']([^"']*)["'][^>]*>([\s\S]*?)<\/Link>/g,
    (_, href, inner) => {
      const clean = inner.replace(/<[^>]+>/g, '').trim()
      return clean ? `[${clean}](${href})` : ''
    }
  )

  // <Button>text</Button> → text
  content = content.replace(/<Button[^>]*>([\s\S]*?)<\/Button>/g, '$1')

  // <CopyButton ... /> → remove entirely
  content = content.replace(/<CopyButton[^>]*\/\s*>/g, '')

  // Remove remaining JSX expression blocks
  content = content.replace(/\{[^}]+\}/g, '')

  // Remove self-closing component tags
  content = content.replace(/<[A-Z][^>]*?\/\s*>/g, '')

  // Remove opening/closing component tags (keep inner text)
  content = content.replace(/<[A-Z][^>]*?>/g, '')
  content = content.replace(/<\/[A-Z][^>]*?>/g, '')

  // Remove HTML-like opening tags
  content = content.replace(/<([a-z][a-z0-9]*)(\s+[^>]*?)?\s*\/?\s*>/gi, '')

  // Remove HTML-like closing tags
  content = content.replace(/<\/([a-z][a-z0-9]*)\s*>/gi, '')

  // Collapse multiple blank lines
  content = content.replace(/\n{3,}/g, '\n\n')

  // Strip trailing whitespace per line
  content = content.replace(/[ \t]+$/gm, '')

  return content.trim()
}

// --- about ---
const aboutSource = fs.readFileSync(path.join(process.cwd(), 'content', 'about.mdx'), 'utf-8')
fs.writeFileSync(path.join(outDir, 'about.txt'), stripMdx(aboutSource), 'utf-8')
console.log('Generated llms/about.txt')

// --- services ---
const servicesSource = fs.readFileSync(path.join(process.cwd(), 'content', 'services.mdx'), 'utf-8')
fs.writeFileSync(path.join(outDir, 'services.txt'), stripMdx(servicesSource), 'utf-8')
console.log('Generated llms/services.txt')

// --- contact ---
const contactSource = fs.readFileSync(path.join(process.cwd(), 'content', 'contact.mdx'), 'utf-8')
fs.writeFileSync(path.join(outDir, 'contact.txt'), stripMdx(contactSource), 'utf-8')
console.log('Generated llms/contact.txt')

// --- projects listing ---
const projectList = allProjects
  .map(p => `- [${p.title}](${homepage}/projects/${p.slug}.txt): ${p.shortDescription}`)
  .join('\n')

const projectsBody = `# Projects

> A list of projects I've built and shipped.

${projectList}
`
fs.writeFileSync(path.join(outDir, 'projects.txt'), projectsBody, 'utf-8')
console.log(`Generated llms/projects.txt with ${allProjects.length} projects`)

// --- individual project pages ---
const projOutDir = path.join(process.cwd(), 'public', 'projects')
fs.mkdirSync(projOutDir, { recursive: true })

for (const p of allProjects) {
  const source = fs.readFileSync(path.join(projectsDir, `${p.slug}.mdx`), 'utf-8')
  const { data, content: body } = matter(source)

  const techStack = data.techStack?.length ? data.techStack.join(', ') : ''
  const links = data.links?.length
    ? data.links.map((l: { type: string; url: string }) => `- ${l.type}: ${l.url}`).join('\n')
    : ''

  const bodyText = stripMdx(body)

  const parts = [`# ${p.title}`, p.date ? `> ${p.date}` : '']
  if (p.shortDescription) parts.push(``, p.shortDescription)
  if (techStack) parts.push(``, `**Tech Stack:** ${techStack}`)
  if (links) parts.push(``, `**Links:**`, links)
  if (bodyText) parts.push(``, `---`, '', bodyText)

  const content = parts.filter(Boolean).join('\n')

  fs.writeFileSync(path.join(projOutDir, `${p.slug}.txt`), content, 'utf-8')
  console.log(`  Generated projects/${p.slug}.txt`)
}

// --- llms-full.txt (complete website text) ---
const header = `# Souhail Benlhachemi

> Full-stack Product Engineer based in Agadir, Morocco — building products from idea to production using the JS/TS ecosystem.

Souhail is a full-stack engineer with 3+ years of experience shipping SaaS platforms, desktop apps, automation tools, and component libraries and 6+ years coding. Former indie founder (20+ projects). Currently part-time technical co-founder at Octolead. Open to remote engineering roles.

## Sitemap

- [Full content](${homepage}/llms-full.txt): Complete text of the entire website
- [About](${homepage}/llms/about.txt): Background, tech stack, experience, philosophy, and featured projects
- [Projects](${homepage}/llms/projects.txt): All projects (short version)
- [Services](${homepage}/llms/services.txt): Available services and what Souhail offers
- [Contact](${homepage}/llms/contact.txt): How to get in touch
- [CV](${homepage}/cv.pdf): CV in PDF format
`

const aboutText = stripMdx(fs.readFileSync(path.join(process.cwd(), 'content', 'about.mdx'), 'utf-8'))
const servicesText = stripMdx(fs.readFileSync(path.join(process.cwd(), 'content', 'services.mdx'), 'utf-8'))
const contactText = stripMdx(fs.readFileSync(path.join(process.cwd(), 'content', 'contact.mdx'), 'utf-8'))

const projectTexts = allProjects.map(p => {
  const source = fs.readFileSync(path.join(projectsDir, `${p.slug}.mdx`), 'utf-8')
  const { data, content: body } = matter(source)
  const techStack = data.techStack?.length ? data.techStack.join(', ') : ''
  const links = data.links?.length
    ? data.links.map((l: { type: string; url: string }) => `- ${l.type}: ${l.url}`).join('\n')
    : ''
  const bodyText = stripMdx(body)
  const parts = [`## ${p.title}`, p.date ? `> ${p.date}` : '']
  if (p.shortDescription) parts.push('', p.shortDescription)
  if (techStack) parts.push('', `**Tech Stack:** ${techStack}`)
  if (links) parts.push('', `**Links:**`, links)
  if (bodyText) parts.push('', `---`, '', bodyText)
  return parts.filter(Boolean).join('\n')
}).join('\n\n')

const fullContent = [
  header,
  '',
  '## About',
  '',
  aboutText,
  '',
  '## Services',
  '',
  servicesText,
  '',
  '## Contact',
  '',
  contactText,
  '',
  '## Projects',
  '',
  projectTexts,
].join('\n')

fs.writeFileSync(path.join(process.cwd(), 'public', 'llms-full.txt'), fullContent, 'utf-8')
console.log('Generated llms-full.txt')
