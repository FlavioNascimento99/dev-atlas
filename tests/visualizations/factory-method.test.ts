import { describe, expect, it } from 'vitest'
import { FACTORY_EDGES, FACTORY_NODES, factoryNode, knownBy } from '@/visualizations/diagrams/factory-method/diagram'

const concreteCreators = FACTORY_EDGES.filter((edge) => edge.kind === 'inherits' && edge.to === 'exporter').map((edge) => edge.from)

describe('Factory Method class diagram', () => {
  it('lets the client know only the abstract creator', () => {
    expect(knownBy('client')).toEqual(['exporter'])
  })

  it('lets the creator know only the product interface', () => {
    expect(knownBy('exporter')).toEqual(['writer'])
  })

  it('never points the client or an abstraction at a concrete class', () => {
    for (const node of FACTORY_NODES.filter((candidate) => candidate.kind !== 'concrete')) {
      for (const known of knownBy(node.id)) expect(factoryNode(known).kind).toBe('abstraction')
    }
  })

  it('creates each concrete product in exactly one concrete creator', () => {
    const created = concreteCreators.map((creator) => knownBy(creator))
    expect(created).toEqual([['pdfWriter'], ['htmlWriter']])
    for (const edge of FACTORY_EDGES.filter((candidate) => candidate.kind === 'creates')) {
      expect(concreteCreators).toContain(edge.from)
    }
  })

  it('makes every created product an implementation of the product interface', () => {
    for (const edge of FACTORY_EDGES.filter((candidate) => candidate.kind === 'creates')) {
      expect(factoryNode(edge.to).kind).toBe('concrete')
      expect(FACTORY_EDGES).toContainEqual({ from: edge.to, to: 'writer', kind: 'inherits' })
    }
  })

  it('declares the factory method in the creator and overrides it in every concrete creator', () => {
    for (const id of ['exporter', ...concreteCreators] as const) expect(factoryNode(id).members).toContain('createWriter()')
  })
})
