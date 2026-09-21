import type { MDXComponents } from 'mdx/types'
import NextImage, { ImageProps } from 'next/image'
import { ProjectCard as ProjectCardComponent, type ProjectCardProps } from './components/ProjectCard'
import { Button } from './components/ui/button'
import { projectMetadata } from './lib/project-metadata'
import Link from 'next/link'

function resolveProjectCard(props: Record<string, unknown>) {
  if (props.slug && !props.title && !props.shortDescription) {
    const meta = projectMetadata[props.slug as string]
    if (meta) return <ProjectCardComponent {...(meta as unknown as ProjectCardProps)} />
    return null
  }
  return <ProjectCardComponent {...(props as unknown as ProjectCardProps)} />
}

export const components = {
  table: ({ children }) => (
    <div className="my-6 w-full overflow-x-auto rounded-lg border border-border">
      <table className="w-full text-left text-sm">{children}</table>
    </div>
  ),
  thead: ({ children }) => (
    <thead className="border-b border-border bg-muted/50">{children}</thead>
  ),
  th: ({ children }) => (
    <th className="px-4 py-3 font-semibold text-foreground">{children}</th>
  ),
  td: ({ children }) => (
    <td className="px-4 py-3 text-muted-foreground">{children}</td>
  ),
  tr: ({ children }) => (
    <tr className="border-b border-border last:border-b-0 even:bg-muted/30">{children}</tr>
  ),
  pre: ({ children }) => (
    <pre className="my-6 overflow-x-auto rounded-lg border border-border bg-muted p-4 text-sm leading-relaxed [&>code]:border-none [&>code]:bg-transparent [&>code]:p-0">
      {children}
    </pre>
  ),
  code: ({ children, ...props }) => (
    <code
      className="rounded-md border border-border bg-muted px-1.5 py-0.5 text-sm font-mono"
      {...props}
    >
      {children}
    </code>
  ),
  blockquote: ({ children }) => (
    <blockquote className="my-6 border-l-4 border-primary pl-4 italic text-muted-foreground">
      {children}
    </blockquote>
  ),
  a: ({ children, ...props }) => (
    <a className="font-medium text-primary underline underline-offset-2 hover:text-primary/80" {...props}>
      {children}
    </a>
  ),
  img: (props) => (
    <NextImage
      sizes="100vw"
      className="my-6 rounded-lg"
      style={{ width: '100%', height: 'auto' }}
      {...(props as ImageProps)}
    />
  ),
  hr: () => <hr className="my-8 border-border" />,
  ProjectCard: resolveProjectCard,
  Button: ({ children, ...props }) => (
    <Button {...props}>{children}</Button>
  ),
  Link: ({ children, ...props }) => (
    <Link {...props}>{children}</Link>
  ),
} satisfies MDXComponents

export function useMDXComponents(): MDXComponents {
  return components
}