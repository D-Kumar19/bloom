import { publicPageMetadata } from '@/lib/pageMetadata'

export const metadata = publicPageMetadata({
  title: 'Create a bouquet',
  description:
    'Pick a bouquet, choose a note style, write your words, and share a private link. No account needed.',
  path: '/create',
})

export default function CreateLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return children
}
