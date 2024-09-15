'use client'

import { GithubLogo } from './logos/GithubLogo'
import { XLogo } from './logos/XLogo'
import { YouTubeLogo } from './logos/YouTubeLogo'
import { LinkedInLogo } from './logos/LinkedInLogo'
import { Button } from './ui/button'
import { Copy, Mail } from 'lucide-react'
import { useState } from 'react'

const socials = [
  { icon: GithubLogo, href: 'https://github.com/souhailcodes', title: 'GitHub' },
  { icon: YouTubeLogo, href: 'https://youtube.com/@souhailcodes', title: 'YouTube' },
  { icon: XLogo, href: 'https://x.com/souhailcodes', title: 'Twitter' },
  { icon: LinkedInLogo, href: 'https://linkedin.com/in/souhail-benlhachemi', title: 'LinkedIn' },
]

export function Footer() {
  const [isCopied, setIsCopied] = useState<boolean>(false)

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('benlhachemi.souhail@gmail.com')
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 2000)
  }

  return (
    <footer className="w-full flex flex-col md:flex-row items-center justify-between gap-6 md:gap-12 py-8 border-t">
      <div className="flex items-center gap-1.5">
        {socials.map((social) => (
          <Button key={social.href} variant="outline" size="icon-sm" title={social.title} render={<a href={social.href} target="_blank" rel="noopener noreferrer" />}>
            <social.icon />
          </Button>
        ))}
      </div>

      <p className="text-sm text-muted-foreground flex items-center gap-1.5">
        <Mail className="size-4" />
        benlhachemi.souhail@gmail.com

        <div className="w-8 flex items-center justify-start text-primary">
          {isCopied ? 'Copied!' : (
            <Button variant="ghost" size="icon-xs" className="text-muted-foreground -ml-1" title="Copy email"
              onClick={handleCopyEmail}>
              <Copy />
            </Button>
          )}
        </div>
      </p>

      <p className="text-sm text-muted-foreground">
        &copy; {new Date().getFullYear()} Souhail Benlhachemi. All rights reserved.
      </p>
    </footer>
  )
}
