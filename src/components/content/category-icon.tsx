import { Blocks, Cpu, Database, GitFork, Globe, Network, Puzzle, RadioTower, Server, Shield, type LucideIcon } from 'lucide-react'
import type { CategoryIconName } from '@/components/navigation/types'

const ICONS: Record<CategoryIconName, LucideIcon> = {
  cpu: Cpu,
  'git-fork': GitFork,
  network: Network,
  blocks: Blocks,
  puzzle: Puzzle,
  globe: Globe,
  server: Server,
  database: Database,
  'radio-tower': RadioTower,
  shield: Shield,
}

export function CategoryIcon({ name, className }: { name: CategoryIconName; className?: string }) {
  const Icon = ICONS[name]
  return <Icon className={className} aria-hidden />
}
