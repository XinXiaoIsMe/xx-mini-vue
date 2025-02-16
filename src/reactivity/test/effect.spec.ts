import { effect } from '../effect'
import { reactive } from '../reactive'

describe('effect', () => {
  it('happy path', () => {
    const person = reactive({
      age: 10,
    })
    let nextAge: number | undefined
    effect(() => {
      nextAge = person.age + 1
    })

    // init
    expect(nextAge).toBe(11)

    // update
    person.age++
    expect(nextAge).toBe(12)
  })
})
