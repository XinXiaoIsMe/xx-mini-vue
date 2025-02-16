import { reactive } from '../reactive'

describe('reactive', () => {
  it('happy path', () => {
    const raw = {
      a: 1,
    }
    const observed = reactive(raw)
    expect(observed).not.toBe(raw)
    expect(observed.a).toBe(1)
  })
})
