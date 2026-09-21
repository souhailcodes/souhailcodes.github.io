import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

type ProjectLink = {
  type: "github" | "website" | "youtube";
  url: string;
}

export interface ProjectMeta {
  slug: string;
  title: string;
  shortDescription: string;
  techStack: string[];
  links: ProjectLink[];
  image: string;
  logo?: string;
  date: string;
}

const projectsDir = path.join(process.cwd(), 'content', 'projects')

function parseProjectMdx(slug: string): ProjectMeta | null {
  const filePath = path.join(projectsDir, `${slug}.mdx`)
  if (!fs.existsSync(filePath)) return null
  const source = fs.readFileSync(filePath, 'utf-8')
  const { data } = matter(source)
  return {
    slug,
    title: data.title ?? slug,
    shortDescription: data.shortDescription ?? '',
    techStack: data.techStack ?? [],
    links: data.links ?? [],
    image: data.image ?? '',
    logo: data.logo ?? undefined,
    date: data.date ?? '',
  }
}

export function getProjectSlugs(): string[] {
  if (!fs.existsSync(projectsDir)) return []
  return fs.readdirSync(projectsDir)
    .filter(f => f.endsWith('.mdx') && f !== 'index.mdx')
    .map(f => f.replace(/\.mdx$/, ''))
}

export function getProjects(): ProjectMeta[] {
  return getProjectSlugs()
    .map(slug => parseProjectMdx(slug))
    .filter((p): p is ProjectMeta => p !== null)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export function getProjectBySlug(slug: string): ProjectMeta | undefined {
  return parseProjectMdx(slug) ?? undefined
}

export function getProjectMdxSource(slug: string): string | null {
  const filePath = path.join(projectsDir, `${slug}.mdx`)
  if (!fs.existsSync(filePath)) return null
  const source = fs.readFileSync(filePath, 'utf-8')
  const { content } = matter(source)
  return content
}