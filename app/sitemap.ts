import type { MetadataRoute } from "next"
import { getProjects } from "@/lib/project-data"

export const dynamic = "force-static"

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://benlhachemi.github.io"

  const staticPages = [
    { url: baseUrl, priority: 1, changeFrequency: "monthly" as const },
    { url: `${baseUrl}/projects`, priority: 0.9, changeFrequency: "weekly" as const },
    { url: `${baseUrl}/services`, priority: 0.7, changeFrequency: "monthly" as const },
    { url: `${baseUrl}/contact`, priority: 0.6, changeFrequency: "monthly" as const },
  ]

  const projectPages = getProjects().map((project) => ({
    url: `${baseUrl}/projects/${project.slug}`,
    priority: 0.8,
    changeFrequency: "monthly" as const,
    lastModified: project.date ? new Date(project.date) : undefined,
  }))

  return [...staticPages, ...projectPages]
}
