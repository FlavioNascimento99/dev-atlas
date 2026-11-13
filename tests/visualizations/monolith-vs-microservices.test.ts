import { describe, expect, it } from 'vitest'
import { ARCHITECTURES, callKind, MODULES } from '@/visualizations/diagrams/monolith-vs-microservices/diagram'

const { monolith, microservices } = ARCHITECTURES

describe('monolith and microservices diagram', () => {
  it('packages the monolith as one deploy unit with one database shared by every module', () => {
    expect(monolith.deployUnits).toEqual([[...MODULES]])
    expect(monolith.databases).toEqual([{ owners: [...MODULES] }])
  })

  it('keeps every call of the monolith in process', () => {
    expect(monolith.calls.map((call) => callKind(monolith, call))).toEqual(['inProcess', 'inProcess'])
  })

  it('gives every microservice its own deploy unit', () => {
    for (const unit of microservices.deployUnits) expect(unit).toHaveLength(1)
    expect(microservices.deployUnits.flat()).toEqual(['gateway', ...MODULES])
  })

  it('gives every microservice a private database and shares none', () => {
    expect(microservices.databases.map((database) => database.owners)).toEqual(MODULES.map((module) => [module]))
  })

  it('turns every call between microservices into a network call', () => {
    for (const call of microservices.calls) expect(callKind(microservices, call)).toBe('network')
  })

  it('keeps the same business calls in both styles: only the kind of call changes', () => {
    for (const call of monolith.calls) expect(microservices.calls).toContainEqual(call)
  })
})
