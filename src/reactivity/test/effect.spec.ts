import type { AnyFn } from '../../types/types'
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

  it('should return runner when call effect', () => {
    let foo = 10
    const runner = effect(() => {
      foo++
      return 'test'
    })
    expect(foo).toBe(11)
    const r = runner()
    expect(foo).toBe(12)
    expect(r).toBe('test')
  })

  it('scheduler', () => {
    // 1. effect首次运行调用fn，不调用scheduler
    // 2. 依赖更新后，存在scheduler则调用scheduler
    // 3. 调用runner时，仍然调用fn
    let dummy: number | undefined
    let run: AnyFn | undefined
    const obj = reactive({ foo: 1 })
    const scheduler = jest.fn(() => {
      // eslint-disable-next-line ts/no-use-before-define
      run = runner
    })
    const runner = effect(() => {
      dummy = obj.foo
    }, {
      scheduler,
    })

    expect(scheduler).not.toHaveBeenCalled()
    expect(dummy).toBe(1)
    obj.foo++
    expect(scheduler).toHaveBeenCalledTimes(1)
    expect(dummy).toBe(1)
    expect(run).toBe(runner)
    run?.()
    expect(dummy).toBe(2)
  })
})
