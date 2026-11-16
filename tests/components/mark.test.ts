import { describe, expect, it } from 'vitest'
import { withAlpha } from '@/components/content/mark'

describe('withAlpha', () => {
  it('appends the alpha channel to a six-digit hex token', () => {
    expect(withAlpha('#0ea5a4', 0.25)).toBe('#0ea5a440')
    expect(withAlpha('#6366F1', 1)).toBe('#6366F1ff')
    expect(withAlpha('#2dd4bf', 0)).toBe('#2dd4bf00')
  })

  it('clamps the alpha to the valid range', () => {
    expect(withAlpha('#fbbf24', 2)).toBe('#fbbf24ff')
    expect(withAlpha('#fbbf24', -1)).toBe('#fbbf2400')
  })

  it('leaves colors it cannot parse unchanged', () => {
    expect(withAlpha('', 0.25)).toBe('')
    expect(withAlpha('rgb(0 0 0)', 0.25)).toBe('rgb(0 0 0)')
  })
})
