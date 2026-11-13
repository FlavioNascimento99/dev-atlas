export type FactoryNodeId = 'client' | 'exporter' | 'writer' | 'pdfExporter' | 'htmlExporter' | 'pdfWriter' | 'htmlWriter'

export type FactoryNodeKind = 'client' | 'abstraction' | 'concrete'

/** `uses` and `creates` are knowledge of another type; `inherits` covers both extending a class and implementing an interface. */
export type FactoryEdgeKind = 'uses' | 'creates' | 'inherits'

export type FactoryNode = {
  id: FactoryNodeId
  kind: FactoryNodeKind
  /** Class name as written in the article's code. */
  name: string
  stereotype?: 'abstract' | 'interface'
  members: string[]
}

export type FactoryEdge = {
  from: FactoryNodeId
  to: FactoryNodeId
  kind: FactoryEdgeKind
}
