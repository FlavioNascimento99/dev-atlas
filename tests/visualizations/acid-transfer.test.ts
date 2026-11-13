import { describe, expect, it } from 'vitest'
import { buildTransfer, INITIAL_BALANCES, total, TRANSFER_AMOUNT } from '@/visualizations/animations/acid-transfer/script'

const EXPECTED = total(INITIAL_BALANCES)

describe('transfer with and without a transaction', () => {
  it('rolls the debit back when the server crashes inside a transaction', () => {
    const steps = buildTransfer({ transaction: true, crash: true })
    expect(steps.map((step) => step.statement)).toEqual(['begin', 'debit', 'crash', 'recover'])
    expect(steps.at(-1)?.balances).toEqual(INITIAL_BALANCES)
  })

  it('never exposes a committed total different from the initial one inside a transaction', () => {
    for (const crash of [true, false]) {
      for (const step of buildTransfer({ transaction: true, crash })) expect(total(step.committed)).toBe(EXPECTED)
    }
  })

  it('keeps the writes uncommitted until COMMIT, then publishes both at once', () => {
    const steps = buildTransfer({ transaction: true, crash: false })
    expect(steps.map((step) => step.statement)).toEqual(['begin', 'debit', 'credit', 'commit'])
    expect(steps.slice(0, -1).every((step) => step.committed === INITIAL_BALANCES)).toBe(true)
    expect(steps.at(-1)?.committed).toEqual({
      alice: INITIAL_BALANCES.alice - TRANSFER_AMOUNT,
      bob: INITIAL_BALANCES.bob + TRANSFER_AMOUNT,
    })
  })

  it('loses the money when the server crashes between two auto-committed statements', () => {
    const steps = buildTransfer({ transaction: false, crash: true })
    expect(steps.map((step) => step.statement)).toEqual(['debit', 'crash', 'recover'])
    const last = steps.at(-1)
    expect(last?.balances).toEqual({ ...INITIAL_BALANCES, alice: INITIAL_BALANCES.alice - TRANSFER_AMOUNT })
    expect(total(last?.committed ?? INITIAL_BALANCES)).toBe(EXPECTED - TRANSFER_AMOUNT)
  })

  it('commits every statement by itself without a transaction', () => {
    const steps = buildTransfer({ transaction: false, crash: false })
    expect(steps.every((step) => step.committed === step.balances)).toBe(true)
    expect(total(steps[0]?.committed ?? INITIAL_BALANCES)).toBe(EXPECTED - TRANSFER_AMOUNT)
    expect(total(steps.at(-1)?.committed ?? INITIAL_BALANCES)).toBe(EXPECTED)
  })

  it('gives every step of a run a distinct id', () => {
    for (const transaction of [true, false]) {
      for (const crash of [true, false]) {
        const ids = buildTransfer({ transaction, crash }).map((step) => step.id)
        expect(new Set(ids).size).toBe(ids.length)
      }
    }
  })
})
