import { GithubLogo } from "@/components/logos/GithubLogo"
import { ShadcnLogo } from "@/components/logos/ShadcnLogo"
import { YouTubeLogo } from "@/components/logos/YouTubeLogo"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Globe } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

type TechStack = string
type ProjectLink = {
  type: "github" | "website" | "youtube";
  url: string;
}

export interface ProjectCardProps {
  slug: string;
  title: string;
  shortDescription: string;
  techStack: TechStack[];
  links: ProjectLink[];
  image: string;
  logo?: string;
  date: string;
  className?: string;
}

const renderTechStack = (techStack: TechStack) => {
  switch (techStack) {
    case 'shadcn': return <ShadcnLogo />
  }
}

const getLinkTitle = (link: ProjectLink) => {
  switch (link.type) {
    case 'github': return 'Github repo'
    case 'website': return 'Live website'
    case 'youtube': return 'YouTube video'
  }
}

const getLinkIcon = (link: ProjectLink) => {
  switch (link.type) {
    case 'github': return <GithubLogo />
    case 'website': return <Globe />
    case 'youtube': return <YouTubeLogo />
  }
}

export function ProjectCard({ title, slug, className, shortDescription, techStack, links, image, logo, date }: ProjectCardProps) {
  return (
    <div className={cn("not-prose w-full rounded-none shadow-xs bg-card border", className)}>
      <div className="relative">
        <Image
          src={image}
          alt="Project image"
          className="w-full h-56 object-cover"
          width={600}
          height={400}
        />
        {logo && (
          <Image
            src={logo}
            alt={`${title} logo`}
            width={40}
            height={40}
            className="absolute bottom-0 left-6 translate-y-1/3 size-12 object-cover rounded-lg drop-shadow-md"
          />
        )}
      </div>

      <div className="space-y-4 p-6">
        {/* Title */}
        <div className="flex items-center justify-between gap-6">
          <h2 className="text-xl font-medium">{title}</h2>
          <div className="flex flex-wrap gap-2 *:size-4">
            {techStack.map((elt, i) => (
              <div key={i}>{renderTechStack(elt)}</div>
            ))}
          </div>
        </div>

        {/* Date */}
        <div className="text-xs text-muted-foreground">{date}</div>

        {/* Short Description */}
        <p className="text-muted-foreground">{shortDescription}</p>

        {/* Links & Button */}
        <div className="flex items-center justify-between gap-6">
          <div className="flex flex-wrap gap-0 *:text-muted-foreground *:grayscale-100">
            {links.map((link, i) => (
              <Link key={i} href={link.url} title={getLinkTitle(link)}>
                <Button size="icon-sm" variant="ghost">
                  {getLinkIcon(link)}
                </Button>
              </Link>
            ))}
          </div>

          <Link title="More Info" href={`/projects/${slug}`}>
            <Button variant="default" size="default" className="rounded-none cursor-pointer">
              More Info
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}