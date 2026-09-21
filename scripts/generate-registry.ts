import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const projectsDir = path.join(process.cwd(), 'content', 'projects')
const outputFile = path.join(process.cwd(), 'lib', 'project-registry.tsx')
const metadataFile = path.join(process.cwd(), 'lib', 'project-metadata.ts')

const slugs = fs.readdirSync(projectsDir)
  .filter(f => f.endsWith('.mdx') && f !== 'index.mdx')
  .map(f => f.replace(/\.mdx$/, ''))

// Generate registry
const imports = slugs
  .map(s => `import ${toVarName(s)} from '@/content/projects/${s}.mdx'`)
  .join('\n')

const mapEntries = slugs
  .map(s => `  '${s}': ${toVarName(s)},`)
  .join('\n')

const registryContent = `// Auto-generated — do not edit manually. Run \`bun run generate-registry\` to update.
${imports}

export const projectRegistry: Record<string, React.ComponentType> = {
${mapEntries}
}

export const projectSlugs: string[] = [${slugs.map(s => `'${s}'`).join(', ')}]
`

fs.writeFileSync(outputFile, registryContent, 'utf-8')
console.log(`Generated registry with ${slugs.length} projects: ${slugs.join(', ')}`)

// Generate project metadata for slug-based MDX lookup
const metadataEntries = slugs.map(s => {
  const filePath = path.join(projectsDir, `${s}.mdx`)
  const source = fs.readFileSync(filePath, 'utf-8')
  const { data } = matter(source)
  return `  '${s}': ${JSON.stringify({ ...data, slug: s })}`
}).join(',\n')

const metadataContent = `// Auto-generated — do not edit manually. Run \`bun run generate-registry\` to update.

export interface ProjectMeta {
  slug: string;
  title: string;
  shortDescription: string;
  techStack: string[];
  links: { type: string; url: string }[];
  image: string;
  logo?: string;
  date: string;
}

export const projectMetadata: Record<string, ProjectMeta> = {
${metadataEntries},
}
`

fs.writeFileSync(metadataFile, metadataContent, 'utf-8')
console.log(`Generated metadata for ${slugs.length} projects`)

function toVarName(slug: string) {
  return slug.replace(/[^a-zA-Z0-9_$]/g, '_').replace(/^(\d)/, '_$1')
}