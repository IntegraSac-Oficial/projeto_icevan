export interface NavItem {
  name: string
  href: string
}

export interface NavSection {
  title: string
  items: NavItem[]
}

export const navigation: NavSection[] = [
  {
    title: "Foundation",
    items: [
      { name: "Design Tokens", href: "/styleguide" },
    ],
  },
  {
    title: "Components",
    items: [
      { name: "Card",         href: "/styleguide/components/card" },
      { name: "Sidebar",      href: "/styleguide/components/sidebar" },
      { name: "Social Icons", href: "/styleguide/components/social-icons" },
    ],
  },
]
