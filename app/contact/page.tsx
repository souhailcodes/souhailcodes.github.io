import ContactContent from '@/content/contact.mdx'
import { Metadata } from 'next/types'

export const metadata: Metadata = {
  title: "Contact",
}

export default function Page() {
  return (
    <div className="prose dark:prose-invert max-w-none">
      <ContactContent />
    </div>
  )
}
