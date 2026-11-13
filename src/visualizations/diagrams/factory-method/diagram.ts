import type { FactoryEdge, FactoryNode, FactoryNodeId } from './types'

/** The document exporter of the article: `Exporter` is the creator, `Writer` the product. */
export const FACTORY_NODES: FactoryNode[] = [
  { id: 'client', kind: 'client', name: 'Client', members: [] },
  { id: 'exporter', kind: 'abstraction', name: 'Exporter', stereotype: 'abstract', members: ['save()', 'createWriter()'] },
  { id: 'writer', kind: 'abstraction', name: 'Writer', stereotype: 'interface', members: ['write()'] },
  { id: 'pdfExporter', kind: 'concrete', name: 'PdfExporter', members: ['createWriter()'] },
  { id: 'htmlExporter', kind: 'concrete', name: 'HtmlExporter', members: ['createWriter()'] },
  { id: 'pdfWriter', kind: 'concrete', name: 'PdfWriter', members: ['write()'] },
  { id: 'htmlWriter', kind: 'concrete', name: 'HtmlWriter', members: ['write()'] },
]

export const FACTORY_EDGES: FactoryEdge[] = [
  { from: 'client', to: 'exporter', kind: 'uses' },
  { from: 'exporter', to: 'writer', kind: 'uses' },
  { from: 'pdfExporter', to: 'exporter', kind: 'inherits' },
  { from: 'htmlExporter', to: 'exporter', kind: 'inherits' },
  { from: 'pdfWriter', to: 'writer', kind: 'inherits' },
  { from: 'htmlWriter', to: 'writer', kind: 'inherits' },
  { from: 'pdfExporter', to: 'pdfWriter', kind: 'creates' },
  { from: 'htmlExporter', to: 'htmlWriter', kind: 'creates' },
]

export function factoryNode(id: FactoryNodeId): FactoryNode {
  const node = FACTORY_NODES.find((candidate) => candidate.id === id)
  if (!node) throw new Error(`Unknown node: ${id}`)
  return node
}

/** Types a node must know to do its work: what it uses or instantiates, not what it inherits from. */
export function knownBy(id: FactoryNodeId): FactoryNodeId[] {
  return FACTORY_EDGES.filter((edge) => edge.from === id && edge.kind !== 'inherits').map((edge) => edge.to)
}
