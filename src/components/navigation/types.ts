import type { CATEGORY_ICONS } from '@/lib/content/constants'

export type CategoryIconName = (typeof CATEGORY_ICONS)[number]

export type NavLink = {
  href: string
  label: string
}

export type NavCategory = NavLink & {
  id: string
  icon: CategoryIconName
  topics: NavLink[]
}

export type NavLabels = {
  primary: string
  home: string
  explore: string
  categories: string
}

export type NavData = {
  labels: NavLabels
  homeHref: string
  exploreHref: string
  categories: NavCategory[]
}

export type BreadcrumbItem = {
  label: string
  href?: string
}
