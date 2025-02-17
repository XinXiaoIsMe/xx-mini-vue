import { reactive, readonly } from '../reactive'

describe('reactive', () => {
  it('happy path', () => {
    const raw = {
      a: 1,
    }
    const observed = reactive(raw)
    expect(observed).not.toBe(raw)
    expect(observed.a).toBe(1)
  })

  it('readonly', () => {
    const person = {
      age: 10,
      hobbies: ['football', 'basketball']
    }
    const readonlyPerson = readonly(person)
    expect(readonlyPerson).not.toBe(person)
    expect(readonlyPerson.age).toBe(10)
  })

  it('test set readonly variable', () => {
    console.warn = jest.fn(console.warn)
    const person = {
      age: 10,
      hobbies: ['football', 'basketball']
    }
    const readonlyPerson = readonly(person)
    readonlyPerson.age = 11
    expect(console.warn).toHaveBeenCalled()
  })
})
